const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation');
const User = require("../models/user");
const bcrypt = require('bcrypt');


authRouter.post('/signup', async (req, res) => {
    // validation of data

    try {
        validateSignUpData(req);
        const { firstName, secondName, email, password } = req.body;

        // encrypt the password

        const passwordHash = await bcrypt.hash(password, 10);
        //creating new instance for user model

        const user = new User({
            firstName,
            secondName,
            email,
            password: passwordHash,

        });

        await user.save();
        res.send('user details added sucessfully')
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message)
    }
});


authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('invalid ');
        }
        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {
            const token = await user.getJWT();
            // add the token to cookie and send response to the user
            res.cookie("token", token);
            res.send('login successful')
        } else {
            throw new Error('invalid data');
        }
    } catch (err) {
        res.status(400).send('ERROR:' + err.message);
    }
});

authRouter.post('/logout', async (req, res) => {
    res
        .cookie('token', null, {
            expires: new Date(Date.now()),
        })
        .send('logout successful');

})




module.exports = authRouter;