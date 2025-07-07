const express = require('express')
const { userAuth, adminAuth } = require('../middleware/auth');
const User = require('../models/userSchema');
const profileRouter = express.Router();
const { validateProfileData, validateNewPassword } = require('../utils/validation')

//get user by profile
profileRouter.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send('we welcome ' + user)

  } catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

// get all users
profileRouter.get('/profile/feed', userAuth, async (req, res) => {
  try {

    const data = await User.find()

    res.send(data)
  } catch (err) {
    res.status(401).send("erroe")
  }
})

// delete user
profileRouter.delete('/profile/delete', userAuth, async (req, res) => {

  try {
    const userId = req.body._id
 
    const user = await User.findByIdAndDelete(userId)
   

    res.json({
      message: "user Deleted",

    })
  } catch (err) {
    res.status(401).send(err.message)
  }
})


//update user
profileRouter.patch('/profile/update/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age"];
  const isUpdateAllowed = Object.keys(data).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );

  try {
    if (!isUpdateAllowed) {
      throw new Error('Update Not Allowed');
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.send({ message: 'User updated', user });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});


//profiel edit
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {


  try {

    if (!validateProfileData(req)) {
      throw new Error("validation error")
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
    await loggedInUser.save()



    res.json({
      message: "Profile Updated Successfully",
      data: loggedInUser,
    })


  } catch (err) {
    res.status(400).send({ error: err.message });
  }

})

//change password API
profileRouter.patch('/profile/passwordEdit',userAuth,async(req,res)=>{
  try{
   validateNewPassword(req);

   const user=req.user

   const {currentPassword,newPassword}=req.body;

   const isMatch=await user.comparePassword(currentPassword);

   if(!isMatch){
   return res.status(401).json({ error: "Current password is incorrect" });
   } 

   user.password=newPassword
   await user.save()

   res.status(200).json({
    message:"user Password changed succefully"
   })

  }catch(err){

    res.json({
      message:"error happend while changing password",
      error:err.message
    })

  }
})

module.exports = profileRouter;