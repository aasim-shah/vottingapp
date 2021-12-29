import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import db from "../db/db.js";


const userSchema = mongoose.Schema({
    name :String,
    username : String,
    google_id : String,
    password : String,
    image : String,
    voted : {type : Boolean , default : false},
    isAdmin : Boolean,
    isParticipant : Boolean,
    tokens : [{
        token : String,
    }]
})


userSchema.index({name: 'text', username: 'text'});

const userModel = mongoose.model('user' , userSchema)
export default userModel 