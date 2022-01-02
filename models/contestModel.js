import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import db from "../db/db.js";


const contestSchema = mongoose.Schema({
   name : String,
  expire_date :Date,
   votes : String
})



const contestModel = mongoose.model('contest' , contestSchema)
export default contestModel 