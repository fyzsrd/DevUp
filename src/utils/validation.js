 const validator=require('validator')


 const validateSignupData =(req)=>{
    const { firstName, lastName, emailId, password}=req.body;

    if(!firstName || !lastName){
        throw new Error("please enter Valid Name")
    }else if( !validator.isEmail(emailId)){
        throw new Error("Not Valid Email")
    }
    // else if(!validator.isStrongPassword(password)){
    //     throw new Error("please enter a strong password")
    // }
 };

 const validateProfileData =(req)=>{
    const AllowedEditItems=["firstName","lastName","photoUrl", "about", "gender", "age","skills"];

  const isEditAllowed=Object.keys(req.body).every((field)=>AllowedEditItems.includes(field));
  return isEditAllowed
 }

 const validateNewPassword=(req)=>{
   const {currentPassword,newPassword}=req.body;

   if(!currentPassword || !newPassword){
      throw new Error("Both current and new passwords are required")
   }
   
 }
 module.exports={
    validateSignupData,
    validateProfileData,
    validateNewPassword
 }