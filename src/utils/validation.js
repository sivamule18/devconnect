const validator=require('validator');
const validateSignUpData=(req)=>{
    const {firstName,secondName,email,password}=req.body
    if(!firstName||!secondName){
        throw new Error('name is not valid')
    }else if(!validator.isEmail(email)){
        throw new Error('email is not valid');
    }else if(!validator.isStrongPassword(password)){
        throw new Error('your password is not strong')
    }  
}
module.exports={
    validateSignUpData,
}