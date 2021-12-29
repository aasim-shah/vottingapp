import mongoose from "mongoose";

const conn = mongoose.connect('mongodb://asim:Mardan8110@cluster0-shard-00-00.btwlh.mongodb.net:27017,cluster0-shard-00-01.btwlh.mongodb.net:27017,cluster0-shard-00-02.btwlh.mongodb.net:27017/voting_app?ssl=true&replicaSet=atlas-x564yd-shard-0&authSource=admin&retryWrites=true&w=majority').then(()=> {
    console.log('db connected');

}).catch((e) => {
    console.log(e);
    console.log('catch errorr');
})

export default mongoose