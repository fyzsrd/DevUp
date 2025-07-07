const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const express =require('express')
const { validateSignupData } = require('../utils/validation')
const authRouter = express.Router();
const User = require('../models/userSchema');


//sign up
authRouter.post('/signup', async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
   

    const user = new User({
      firstName,
      lastName,
      emailId,
      password,

    });

    await user.save()

    res.status(200).send('user added succefully')

  } catch (err) {

    res.status(400).send('Error saving user: ' + err.message);

  }
})

//login
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Creadentials")
    }

const isPasswordValid = await user.comparePassword(password);


    if (isPasswordValid) {
      //create jwt
     
    const token = user.jwtsign();
      res.cookie("token", token)

      //send cookie
      res.status(200).send('u are Autherised')
    } else {
      throw new Error('Password is invalid')
    }

  } catch (err) {
    res.status(400).send('ERROR: ' + err.message)
  }

})

//logout
authRouter.post('/logout' ,async (req,res)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now())
  }).send()
})



module.exports=authRouter;