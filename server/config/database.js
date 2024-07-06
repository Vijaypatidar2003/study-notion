const mongoose=require('mongoose');

require("dotenv").config();

async function connectDB(){
    try{
        let conn=mongoose.connect(process.env.DATABASE_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log('connection established successfully')
    }catch(error){
        console.log('connection cannot be established')
        console.log(error)
        process.exit(1);
    }
}

module.exports=connectDB;