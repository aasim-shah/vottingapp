import userModel from "../models/userModel.js";
import contestModel from "../models/contestModel.js";
import  Jwt  from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import contesModel from "../models/contestModel.js";
import path from 'path'
import { name } from "ejs";
import postModel from "../models/postsModel.js";

class users {
   async home(req ,res) {  
        res.redirect('/')
    }
   
   
   async profile_get(req ,res) {
     const phone = req.user.phone;
     const user = await userModel.findOne({phone})
     const posts = await postModel.find({user_id : req.user.phone})
     let contest = await contestModel.find({_id : {$in : user.contests}})
         res.render('profile' , {user , contest , posts})
    }
  
  
 
  
  


    async  dashboard_get(req ,res) {
const contests = await contesModel.find()
    const participants = await userModel.find({isParticipant : true})
     const maxVotes = await userModel.find({isParticipant : true}).sort({total_votes : -1}).limit(5)
       res.render('home' , {user: maxVotes , contests : contests , participants})
    }


    
    async  admin_get(req ,res) {
        res.render('adminhome')
    }
      
    async  admin_search(req ,res) {
        const username = req.body.search;
     const searched = await   userModel.findOne({$text: {$search: `${username}`}});
        res.send(searched)
    }
  
        
    async  user_search(req ,res) {
        const username = req.body.data;
        console.log(username)
     const searched = await  userModel.findOne({$text: {$search: `${username}`}});
        res.send(searched)
    }
  
  async partipant_video (req ,res) {
    console.log('vidoe uploading')
    const user = await userModel.findOneAndUpdate({phone : req.user.phone}, {video : req.file.originalname})
  res.redirect('back')
  }

  
    async  voted_post(req ,res) {
              const id = req.body.contest_id;

      const participant_id = req.body.participant_id;

      if(req.user.phone == participant_id){
        res.send('You Can\'t Vote Your Self')
      }
        const check_voted = await userModel.findOne({phone : req.user.phone})
        const participant = await userModel.findOne({phone : participant_id})
      if(participant == null){res.send('Select a participant First')}
        const pariticipant_total_votes = participant.total_votes;
        const user_vote = check_voted.voted;
      const votes = await contestModel.findById(id)
        const n = Number(votes.votes)
        if(user_vote){
           res.send('<h3 class="text-center">you Already voted </h3>')
        }else{
            const new_votes = await contestModel.findByIdAndUpdate(id , {votes : n+1})
            const user = await userModel.findOneAndUpdate({phone : req.user.phone} , {
                voted : true  
            })
            const participant_voted = await userModel.findOneAndUpdate({phone : participant_id} , {
             total_votes :pariticipant_total_votes + 1
            })
            res.redirect('back')
        }
        }
  
  
  
  
      async  voted_post_url(req ,res) {
      const participant_id = req.body.participant_id;
      if(req.user.phone == participant_id){
        res.send('You Can\'t Vote Your Self')
      } 
        const check_voted = await userModel.findOne({phone : req.user.phone})
        const participant = await userModel.findOne({phone : participant_id})
        const contest_id = participant.contest_id;
      if(participant == null){res.send('Select a participant First')}
        const pariticipant_total_votes = participant.total_votes;
        const user_vote = check_voted.voted;
      const votes = await contestModel.findById(contest_id)
        const n = Number(votes.votes)
        if(user_vote){
           res.send('<h3 class="text-center">you Already voted </h3>')
        }else{
            const new_votes = await contestModel.findByIdAndUpdate(contest_id , {votes : n+1})
            const user = await userModel.findOneAndUpdate({phone : req.user.phone} , {
                voted : true  
            })
            const participant_voted = await userModel.findOneAndUpdate({phone : participant_id} , {
             total_votes :pariticipant_total_votes + 1
            })
            res.redirect('back')
        }
        }
  
  
  
  

    async participate_get(req ,res) {      
      const contest_id = req.params.id;
      const user = await userModel.findOne({phone :req.user.phone})
          if(user.isParticipant){
              res.render('participate' , {contest : contest_id , participant: true}  )
          }else{
                  res.render('participate' , {contest : contest_id , participant : false} )
          }
    }

  async participate_post (req, res)  {
    const user  = await userModel.findOneAndUpdate({phone : req.user.phone} , {
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        marital_status : req.body.marital_status,
        city : req.body.city,
        state : req.body.state,
        instagram_username : req.body.instagram_username,
      username : req.body.username,
        age : req.body.age,
        image : req.file.originalname,
        isParticipant : true,
        contest_id : req.body.contest_id,
        // $push : {contests : req.body.contest_id}
    })
     if(user){
         res.redirect('/user/profile')
     }
    };
  
  

  
  
    async  logout(req ,res) {
        res.clearCookie('jwt_Token')
        res.redirect('/user/login')
    }
    
}


export default users