 const validator=require('validator')


 const validateSignupData =(req)=>{
    const { firstName, lastName, emailId, password}=req.body;

    if(!firstName || !lastName){
        throw new Error("please enter Valid Name")
    }else if( !validator.isEmail(emailId)){
        throw new Error("Not Valid Email")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password")
    }
 };

 module.exports={
    validateSignupData
 }