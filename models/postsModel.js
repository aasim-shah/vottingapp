import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import db from "../db/db.js";


const postSchema = mongoose.Schema({
  user_id : String,
  image:String,
  name: String
})



const postModel = mongoose.model('posts' , postSchema)
export default postModel 