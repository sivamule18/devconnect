const mongoose = require("mongoose");
const validator = require("validator");

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
module.exports = mongoose.model('User', userSchema);