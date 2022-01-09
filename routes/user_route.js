import  express, { urlencoded }  from 'express';
import users from '../controllers/users_controller.js'
import passport  from 'passport';
import  Jwt from 'jsonwebtoken';
import session from 'express-session';
import multer from "multer";

import  userModel from '../models/userModel.js';
import passportLocal from 'passport-local';
import passportGoogle from 'passport-google-oauth2'
import cookieParser from 'cookie-parser';
const googleAuth = passportGoogle.Strategy
const local = passportLocal.Strategy
const router = express.Router()
router.use(urlencoded({extended : false}))
router.use(cookieParser())


const user = new users()
router.use(session({
    secret: 'sdfsadfsdfasdf cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
router.use(express.json())
router.use(passport.initialize());
router.use(passport.session());


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/images')   
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)      
  }
})
var upload = multer({ storage: storage });


const isAdmin = async function(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) {
        console.log("isAdmin");
      return next();
    } else {
      console.log(req.user)
      console.log('not admin');    
     res.redirect('/user/login')
    }
  }}



passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  userModel.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new googleAuth({
  clientID:     '771092605828-t9d8cb8pcdpa167rklqkp40pu8jj917u.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "https://voting-app-demo.glitch.me/user/auth/google/callback",
  passReqToCallback   : true
},
 function(request, accessToken, refreshToken, profile, done) {
    userModel.findOne({ google_id : profile.id },async function (err, user) {
      if(user == null ){
        const user  = await  userModel.create({google_id : profile.id})
        return done( err ,  user)
      }
      return done(err, user);
    });
  }
));


  

//jwt verfication 
 
const Tokenauth = async (req ,res , next)=>{
 try {
  const token = req.cookies.jwt_Token
  const verfiy =  Jwt.verify(token , 'mysupersecret')
  const verfified_user = await userModel.findOne({google_id : verfiy.google_id})
  req.user = verfified_user
  next()
 } catch (error) {
   console.log(error)
   res.redirect('/user/login')
 }
} 




router.get('/auth/google',
  passport.authenticate('google', { scope:
      [  'profile' ] }
));

router.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        failureRedirect: '/auth/google/failure'
}),user.google_login2 ); // user.google_login






router.get('/', user.home);
router.get('/admin' ,Tokenauth,isAdmin , user.admin_get)
router.get('/login', user.login_get);
router.post('/login', passport.authenticate('local', { failureRedirect: 'login' }),
user.login_post
);
router.get('/dashboard' , Tokenauth  , user.dashboard_get)
router.get('/logout', Tokenauth,  user.logout);

router.post('/projects',Tokenauth , upload.array('uploadedImages', 6),async function(req, res) {
  const user = await userModel.findOneAndUpdate({google_id : req.user.google_id} , {galary : req.files})
  res.redirect('back');
});

router.get('/profile' , Tokenauth, user.profile_get)

router.post('/voted' , Tokenauth, user.voted_post)
router.post('/admin/search' , Tokenauth, user.admin_search)
router.post('/uploadvideo', Tokenauth , upload.single('video'),  user.partipant_video)
router.post('/participate',Tokenauth ,upload.single('image'),  user.participate_post)

router.get('/participate/:id' , Tokenauth, user.participate_get)
export default router;