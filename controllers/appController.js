import userModel from "../models/userModel.js";
import contesModel from "../models/contestModel.js";



class apps {
  async  home(req ,res) {
    const contests = await contesModel.find()
    const participants = await userModel.find({isParticipant : true})
     const maxVotes = await userModel.find({isParticipant : true}).sort({total_votes : -1}).limit(5)
    
       res.render('home' , {user: maxVotes , contests : contests , participants})
    }
    async  okay(req ,res) {
        res.send('sajdflsjdlfjsalo okay')
    }
    async  username_get(req ,res){
        const username = req.params.username;
        console.log(username)
        const user = await userModel.findOne({username : username})
        if(user){if(user.isParticipant){
        res.render('profileURL' , {user : user})
    }else{
        res.render('profileURL' , {user : ''})
    }}
    else{
        
        res.render('profileURL' , {user : ''})
        }
    }
}
export default apps