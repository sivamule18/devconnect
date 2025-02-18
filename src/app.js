const express = require('express')
const connectDB = require("./config/database");
const { validateSignUpData } = require('./utils/validation');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("./models/user");
const { userAuth } = require('./midlewares/auth');
app.use(express.json());
app.use(cookieParser());

// post API

app.post('/signup', async (req, res) => {
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

// login API

app.post('/login', async (req, res) => {
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
})

// profile API

app.get('/profile', userAuth, async (req, res) => {

    // validate my token
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send('ERROR:', err.message);
    }
})

app.post('/sendconnectionrequest', userAuth, async (req, res) => {
    const user = req.user;
    console.log('sending request')
    res.send(user.secondName+'send')
})


connectDB()
    .then(() => {
        console.log('db connected')
        app.listen(3333, () => {
            console.log("server listening on port 3333")
        })
    })
    .catch((err) => {
        console.error('db not connected')
    });
