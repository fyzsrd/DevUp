const express =require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionSchema');
const User = require('../models/userSchema');
const userRouter = express.Router();

const SAFE_USER_DATA=["firstName","lastName", "photoUrl","about","age"]
//get alloending connections
userRouter.get('/user/requests/received', userAuth, async (req,res)=>{
   try{
     const loggedInUser=req.user;

    const recievedConenction= await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"

    }).populate("fromUserId",SAFE_USER_DATA)
    console.log(recievedConenction);
    if(!recievedConenction){
        return res.status(400).json({message:"no pending request",})
    }

    const data =recievedConenction.map((row)=>row.fromUserId)
    res.status(200).json({message:"these are youre request",data:recievedConenction})

   }catch(err){
    res.status(400).json({message:"ERROR: " + err.message})
   }
})


userRouter.get('/user/request/accepeted',userAuth,async (req,res)=>{
   try{
     const loggedInUser=req.user

    const connectionRequest= await ConnectionRequest.find({
        $or:[
            {toUserId:loggedInUser._id, status:"accepted"},
            {fromUserId:loggedInUser._id, status:"accepted"},
        ]
    })
    .populate('fromUserId',SAFE_USER_DATA)
    .populate("toUserId",SAFE_USER_DATA)

    const data=connectionRequest.map((row)=>{
        if(row.fromUserId.toString() === loggedInUser._id.toString()){
            return  row.toUserId
        }else{
            return row.fromUserId
        }
      
    })
   
    res.json({message:"req are:",data:data})
   }catch(err){
    res.status(400).json({message:"ERROR: " + err.message})
   }
})

//rejected one
userRouter.get('/user/request/rejected',userAuth,async (req,res)=>{
   try{
     const loggedInUser=req.user

    const connectionRequest= await ConnectionRequest.find({
        $or:[
            {toUserId:loggedInUser._id, status:"rejected"},
            {fromUserId:loggedInUser._id, status:"rejected"},
        ]
    }).populate('fromUserId',SAFE_USER_DATA)

    const data=connectionRequest.map((row)=>row.fromUserId)
   
    res.json({message:"req are:",data:data})
   }catch(err){
    res.status(400).json({message:"ERROR: " + err.message})
   }
})


userRouter.get('/user/feed/',userAuth, async (req,res)=>{
   try{
     const loggedInUser=req.user;

     const page=parseInt(req.query.page) || 1;
     let limit=parseInt(req.query.limit) || 10;

     limit =limit>50? 50: limit;
     const skip=(page -1) * limit


    const connectionRequest=await ConnectionRequest.find({
        $or:[{fromUserId:loggedInUser._id }, {toUserId: loggedInUser._id}]

    }).select("fromUserId toUserId" )

    const hideUserFromFeed=new Set()
    connectionRequest.forEach((req)=>{
        hideUserFromFeed.add(req.fromUserId.toString());
        hideUserFromFeed.add(req.toUserId.toString());
    })
    
    const users =await User.find({
        $and:[
          {_id:  {$nin: Array.from(hideUserFromFeed) }},
          {_id:{$ne:loggedInUser._id}}
        ]
    }).select(SAFE_USER_DATA).skip(skip).limit(limit)

    res.status(200).json({message:"datta is : ",data:users})
   }catch(err){
    res.status(400).json({message:"ERORR: ",data:err.message})
   }
})


module.exports=userRouter;