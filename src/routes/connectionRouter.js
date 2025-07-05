const express =require('express')
const {userAuth}=require('../middleware/auth')
const connectionRouter = express.Router();

//send connection request
connectionRouter.post('/sendConnectionReq',userAuth, async(req,res)=>{
  const user=req.user

  res.send(user.firstName + " Sendding connection rewquest")
})



module.exports=connectionRouter;