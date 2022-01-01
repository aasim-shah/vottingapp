import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import db from "../db/db.js";


const userSchema = mongoose.Schema({
    first_name :String,
    last_name :String,
    age :Number,
    Marital_status :String,
    first_name :String,
    phone :String,
    city :String,
    state :String,
    instagram_username :String,
    username : String,
    google_id : String,
    password : String,
    total_votes : {type : Number , default : 0},
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