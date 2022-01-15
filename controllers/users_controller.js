
import userModel from "../models/userModel.js";
import contestModel from "../models/contestModel.js";
import  Jwt  from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import contesModel from "../models/contestModel.js";
import path from 'path'
import { name } from "ejs";

class users {
   async home(req ,res) {  
        res.redirect('/')
    }
   
    async  login_post(req ,res) {
        const Token = await req.user.Authuser()
        res.cookie('jwt_Token' , Token )
        console.log(req.user)
      console.log('login post')
         res.redirect('/user/dashboard')
    }
  
   async profile_get(req ,res) {
     const google_id = req.user.google_id;
     const user = await userModel.findOne({google_id})
     let contest = await contestModel.find({_id : {$in : user.contests}})

         res.render('profile' , {user , contest})
    }
  
    async  login_get(req ,res) {
      res.render('login')
    }

    async  google_login(req ,res) {
        const user = await userModel.findOne({ google_id : req.user.id})
        console.log(req.user)
        if(user){
            const token = Jwt.sign({google_id : req.user.id} , 'mysupersecret')
            res.cookie('jwt_Token' , token )
             res.redirect('/user/dashboard')
        }else{
            const token = Jwt.sign({google_id : req.user.id} , 'mysupersecret')
            const d= new userModel({
                google_id : req.user.id,
                tokens : [{token : token}]
            })
            const user_added = await d.save()
            res.redirect('/user/login')
        }

      }
  
  
  async  google_login2(req ,res) {
        const user = await userModel.findOne({ google_id : req.user.google_id})
            const token = Jwt.sign({google_id : req.user.google_id} , 'mysupersecret')
              res.cookie('jwt_Token' , token )
                  console.log(req.session.url)
                res.redirect('/')
        }
  
  

    async  dashboard_get(req ,res) {
const contests = await contesModel.find()
    const participants = await userModel.find({isParticipant : true})
     const maxVotes = await userModel.find({isParticipant : true}).sort({total_votes : -1}).limit(5)
       res.render('home' , {user: maxVotes , contests : contests , participants})
    }


    
    async  admin_get(req ,res) {
        console.log(req.user)
        res.render('adminhome')
    }
      
    async  admin_search(req ,res) {
        const username = req.body.search;
        console.log(username)
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
    const user = await userModel.findOneAndUpdate({google_id : req.user.google_id}, {video : req.file.originalname})
  res.redirect('back')
  }

  
    async  voted_post(req ,res) {
              const id = req.body.contest_id;

      const participant_id = req.body.participant_id;
                  console.log(participant_id)

      if(req.user.google_id == participant_id){
        res.send('You Can\'t Vote Your Self')
      }
        const check_voted = await userModel.findOne({google_id : req.user.google_id})
        const participant = await userModel.findOne({google_id : participant_id})
      if(participant == null){res.send('Select a participant First')}
        const pariticipant_total_votes = participant.total_votes;
        const user_vote = check_voted.voted;
      const votes = await contestModel.findById(id)
        const n = Number(votes.votes)
        if(user_vote){
           res.send('<h3 class="text-center">you Already voted </h3>')
        }else{
            const new_votes = await contestModel.findByIdAndUpdate(id , {votes : n+1})
            const user = await userModel.findOneAndUpdate({google_id : req.user.google_id} , {
                voted : true  
            })
            const participant_voted = await userModel.findOneAndUpdate({google_id : participant_id} , {
             total_votes :pariticipant_total_votes + 1
            })
            res.redirect('back')
        }
        }
  
  
  
  
      async  voted_post_url(req ,res) {
      const participant_id = req.body.participant_id;
      if(req.user.google_id == participant_id){
        res.send('You Can\'t Vote Your Self')
      }
        console.log(req.user.google_id)
        console.log(participant_id)
        const check_voted = await userModel.findOne({google_id : req.user.google_id})
        const participant = await userModel.findOne({google_id : participant_id})
        const contest_id = participant.contest_id;
        console.log(contest_id)
        console.log(participant)
      if(participant == null){res.send('Select a participant First')}
        const pariticipant_total_votes = participant.total_votes;
        const user_vote = check_voted.voted;
      const votes = await contestModel.findById(contest_id)
        const n = Number(votes.votes)
        if(user_vote){
           res.send('<h3 class="text-center">you Already voted </h3>')
        }else{
            const new_votes = await contestModel.findByIdAndUpdate(contest_id , {votes : n+1})
            const user = await userModel.findOneAndUpdate({google_id : req.user.google_id} , {
                voted : true  
            })
            const participant_voted = await userModel.findOneAndUpdate({google_id : participant_id} , {
             total_votes :pariticipant_total_votes + 1
            })
            res.redirect('back')
        }
        }
  
  
  
  

    async participate_get(req ,res) {      
      const contest_id = req.params.id;
      const user = await userModel.findOne({google_id :req.user.google_id})
          if(user.isParticipant){
              res.render('participate' , {contest : contest_id , participant: true}  )
          }else{
                  res.render('participate' , {contest : contest_id , participant : false} )
          }
    }

  async participate_post (req, res)  {
    console.log(req.body.contest_id)
    const user  = await userModel.findOneAndUpdate({google_id : req.user.google_id} , {
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        marital_status : req.body.marital_status,
        city : req.body.city,
        state : req.body.state,
        phone : req.body.phone,
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