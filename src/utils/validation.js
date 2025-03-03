const validator = require('validator');
const validateSignUpData = (req) => {
    const { firstName, secondName, email, password } = req.body
    if (!firstName || !secondName) {
        throw new Error('name is not valid')
    } else if (!validator.isEmail(email)) {
        throw new Error('email is not valid');
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('your password is not strong')
    }
}

const validateEditProfile = (req) => {
    const editfields = [
        "firstName",
        "secondName",
        "email",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills"
    ];
    const isEditAllowed=Object.keys(req.body).every((field)=>
    editfields.includes(field)
);
return isEditAllowed;
};
module.exports = {
    validateSignUpData,
    validateEditProfile, 
}