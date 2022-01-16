import Jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';

  
class auth {
    
  isAdmin (req, res, next) {
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
  
  
  
    
  
  //jwt verfication 
  Tokenauth = async (req ,res , next)=>{
    try {
     const token = req.cookies.jwt_Token
     const verfiy = await Jwt.verify(token , 'mysupersecret')
     const verfified_user = await userModel.findById(verfiy._id)
     req.user = verfified_user
     next()
    } catch (error) {
      res.cookie('url' , req.get('Referer') )
      res.redirect('/login')
    }
   } 
    
 }
 export default auth