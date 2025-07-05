const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const userAuth = async(req, res, next) => {
    try{
        const{token}=req.cookies
        if(!token){
            throw new Error('Unauthorized: Token not found');

        }

        const decoded= await jwt.verify(token,"secret")

        const {_id}=decoded
        const user=await User.findById(_id)

        if(!user){
            throw new Error('Invalid user: please sign in again');

        }

        req.user=user
        next()

    }catch(err){
        res.status(400).send('ERROR: '+ err.message)
    }

}

module.exports ={userAuth}