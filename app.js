import  express, { urlencoded }  from 'express';
import userRoute from './routes/user_route.js'
import apps from './controllers/appController.js'
import db from './db/db.js'
import connectEnsureLogin from 'connect-ensure-login';
import session from 'express-session';
import bcrypt, { hash } from 'bcrypt'
import passport from 'passport'
import userModel from './models/userModel.js';
import LocalStrategy from 'passport-local'
import cookieParser from 'cookie-parser';
import axios from 'axios'
import  Jwt from 'jsonwebtoken';
import auth from './middlewares/auth.js';
import postModel from './models/postsModel.js';
const userAuth =new  auth();
const Tokenauth = userAuth.Tokenauth

const app = express()
const port = process.env.port || 8000



app.use(urlencoded({extended : false}))
app.use(cookieParser())

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())
const home = new apps()


passport.use(new LocalStrategy(
  function(username, password, done) {
    userModel.findOne({ phone : username },async function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if(!await bcrypt.compare(password , user.password)){ return done(false)}
      return done(null, user)
    });
  }
));





passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.serializeUser(function(user, done) {
  done(null, user.id);
});






app.use('/user' , userRoute)
app.use(express.static('./public/images'))
app.use('/user' , express.static('./public/images'))
app.set('view engine' , 'ejs')

// registeration router
app.get('/register' , (req ,res) => {
  res.render('register')
})
app.post('/register' ,async (req , res)=> {
  let {first_name , username , phone , password} = req.body;
  const hash = await bcrypt.hash(password , 10);
  const d = new userModel({
    first_name ,
    username,
    password : hash,
    phone
  })
  const registered_user = await userModel.findOne({ phone: req.body.phone });
  if (registered_user) {
    res.redirect("/login");
  } else {
        const userregistered = await d.save();
        const regtoken = await d.Authuser()

         res.render("otp", { reg_user: userregistered });
  }
})  

app.get('/feeds' , Tokenauth , async (req ,res)=> {
  const posts = await postModel.find()
  res.render('feeds' , {posts})
})


// login route?
app.get('/login' , (req ,res)=> { res.render('login')})
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),async (req ,res) => {
  const Token = await req.user.Authuser()
  res.cookie('jwt_Token' , Token )
res.redirect(req.cookies.url || '/')
res.clearCookie('url')
});



// otp routes 
app.get("/otp", (req, res) => {
  res.render("otp");
});


// otp verification middleware
const otpVerifeid = async function(req, res, next) {
  let userr = await userModel.findOne({ phone : req.body.phone });
  console.log("userrr");
if(userr){
    let verified = userr.verified;
  if (verified) {
    return next();
  } else {
    console.log('not verfied user')
    res.render("otp", { reg_user: userr });
  }
}else{
  res.redirect('/login')
}
};
// otp verification middleware

app.post("/verify/otp", async (req, res) => {
  let otp = req.body.verify_otp;
  console.log(otp);
  let verified = await userModel.findOne({ otp: otp });
  console.log(verified)
    let verify = await userModel.findOneAndUpdate(
      { otp: otp },
      { verified: true }
    )
    if(verify){
    res.redirect("/login");
  } else {
    res.redirect("/verify/otp");
  }
});


app.post("/get/otp", async (req, res) => {
  let reg_phone = req.body.reg_phone;
  var otp = generateOTP();
  axios({
    url: "https://www.fast2sms.com/dev/bulkV2",
    method: "post",
    headers: {
      authorization:
        "UwizLrB0fQhFpNVtYdy8xH4oMmlbGDv91qakTIg25ZSsPWKCu6NaFrqQZl0WGMLHzPIRnctfDxvs5uk6"
    },
    data: {
      variables_values: otp,
      route: "otp",
      numbers: reg_phone
    }
  })
    .then(ee => {
      console.log(ee.data);
    })
    .catch(err => {
      console.log(err);
    });
  console.log(otp);
  let save_otp = await userModel.findOneAndUpdate(
    { phone: reg_phone },
    {
      otp: otp
    }
  );
  if (save_otp) {
    res.render("verifyOtp");
  } else {
    res.send("filed to save otp");
  }
});

function generateOTP() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

app.get('/' , home.home)
app.get('/logout' , (req ,res)=> {
  res.clearCookie('jwt_Token')
  res.redirect('/login')
}
)


app.get('/:username' , home.username_get)

app.listen(port , ()=> {
    console.log('server is running on 8000')
})