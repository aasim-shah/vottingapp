import userModel from "../models/userModel.js";


class apps {
  async  home(req ,res) {
     const maxVotes = await userModel.find().sort({total_votes : -1})
      console.log(maxVotes)
       res.render('home' , {user: maxVotes})
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