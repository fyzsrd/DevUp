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
    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({ message: "Your and sending request to Yourself Dont be dual person" })
    }
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: "user Doesnt Exist" })
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

//connectio reques accept
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const loggedUser = req.user._id

    const { status, requestId } = req.params;
    console.log("Request ID:", requestId);
console.log("Logged-in User:", loggedUser.toString());
console.log("Expected toUserId:", "686b5eb3c5b1aeab7eeddc31");

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "sattus not allows" })
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedUser,
      status: "interested",
    })
    if (!connectionRequest) {
      return res.status(400).json({
        message: "Connection request not found",
        hint: "Check if it's already accepted/rejected or not for this user"
      });
    }
    console.log(status)
    connectionRequest.status = status
    const data = await connectionRequest.save()
    res.status(200).json({ message: "connection request" + status })

  } catch (err) {
    res.status(400).json({ message: "Error : ", data: err.message })
  }
})

module.exports = requestRouter;