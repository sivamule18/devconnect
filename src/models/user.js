const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 100,
    },
    secondName: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address:" + value)
            }
        }
    },
    password: {
        type: String,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("password is week:" + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("gender data is not valid")
            }
        }

    },
    photoUrl: {
        type: String,
        default: "https://pinnacle.works/wp-content/uploads/2022/06/dummy-image.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("this not photo url:" + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is default about user!"
    },
    skills: {
        type: [String],

    }

}, {
    timestamps: true,
});
userSchema.methods.getJWT = async function(){
    const user=this;
   const token = await jwt.sign({ _id: user._id }, 'developer$234',{
    expiresIn:'1d'})
return token;
}
userSchema.methods.validatePassword=async function(passwordInputByuser){
    const user=this;
    const passwordHash=user.password;
    const isPassowrdValid=await bcrypt.compare(
        passwordInputByuser,
        passwordHash)
    return isPassowrdValid;
}
module.exports = mongoose.model('User', userSchema);