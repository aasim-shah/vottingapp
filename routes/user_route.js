import  express, { urlencoded }  from 'express';
import users from '../controllers/users_controller.js'
import multer from "multer";
import  userModel from '../models/userModel.js';
import cookieParser from 'cookie-parser';
import postModel from '../models/postsModel.js';
import auth from '../middlewares/auth.js';
import Jimp from 'jimp'
const userAuth =new  auth();
const Tokenauth = userAuth.Tokenauth
const isAdmin = userAuth.isAdmin
const router = express.Router()
router.use(urlencoded({extended : false}))
router.use(cookieParser())


const user = new users()


router.use(express.json())

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/images')   
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)      
  }
})
var upload = multer({ storage: storage });





router.get('/', user.home);
router.get('/admin' ,Tokenauth,isAdmin , user.admin_get)

router.get('/dashboard' , Tokenauth  , user.dashboard_get)
router.get('/logout', Tokenauth,  user.logout);

router.post('/images',Tokenauth , upload.single('image') ,async function(req, res) {
  const user = await  userModel.findOne({phone : req.user.phone})
  let data  = new postModel({
    user_id : req.user.phone,
    name : req.user.first_name,
    image : req.file.originalname
  })
  const data_saved  =await data.save()
  res.redirect('/user/image/' + data_saved._id)
});


router.get('/image/:post' , async(req ,res)=> {
  const id = req.params.post
  console.log(id)
  const image =( await postModel.findById(id)).image
  
  const pathh =  'public/images/'+image
  Jimp.read(pathh)
  .then(lenna => {
    return lenna
      .resize(600 , 320) // resize
      .quality(60) // set JPEG quality
      .write('./public/images/'+ 'jimp'+image); // save
  })
  .catch(err => {
    console.error(err);
  });
  let updatedImg = await postModel.findByIdAndUpdate(id , { image : 'jimp'+image})
res.redirect('/user/profile')
})




router.get('/profile' , Tokenauth, user.profile_get)

router.post('/voted' , Tokenauth, user.voted_post)
router.post('/url/voted' , Tokenauth, user.voted_post_url)
router.post('/admin/search' , Tokenauth,isAdmin, user.admin_search)
router.post('/search' ,  user.user_search)
router.post('/uploadvideo', Tokenauth , upload.single('video'),  user.partipant_video)
router.post('/participate',Tokenauth ,upload.single('image'),  user.participate_post)

router.get('/participate/:id' , Tokenauth, user.participate_get)
export default router;