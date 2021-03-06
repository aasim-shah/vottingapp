import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import db from "../db/db.js";


const userSchema = mongoose.Schema({
    first_name :String,
    last_name :String,
    age :Number,
    marital_status :String,
    video : String,
    phone :Number,
    city :String,
    contest_id : String,
    verified : Boolean,
    otp: String,
    galary:[],
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
    }],
    createdAt    : { type: Date, required: true, default: Date.now }
})

userSchema.methods.Authuser = async function(){
    const token = jwt.sign({_id : this.id} , 'mysupersecret')
    this.tokens = this.tokens.concat({token : token})
    await this.save()
    return token;
}


userSchema.index({name: 'text', username: 'text'});

const userModel = mongoose.model('user' , userSchema)
export default userModel 