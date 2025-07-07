const express = require('express')
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionSchema');
const User = require('../models/userSchema');
const requestRouter = express.Router();

//send connection request
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status

    const allowedStatus = ["interested", "ignored"]
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "invalid Status Type: " + status })
    }
    if(fromUserId.toString() === toUserId){
      return res.status(400).json({message:"Your and sending request to Yourself Dont be dual person"})
    }
    const toUser=await User.findById(toUserId);
    if(!toUser){
      return res.status(400).json({message:"user Doesnt Exist"})
    }
    
    //check if there is exisiting connection
    const exisitingConenctionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })

    if (exisitingConenctionRequest) {
      return res.status(400).json({ message: "connection Request already Exists" })
    }


    const newConnectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    })

    const data = await newConnectionRequest.save()
    res.json({
      message: "Connection Request",
      data
    })

  } catch (err) {
    res.status(400).json({
      message: "error happend",
      data: err.message

    })

  }
})



module.exports = requestRouter;