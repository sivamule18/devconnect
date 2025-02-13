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
            throw new Error('invalid data');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {

            // create a JWT token
            const token = await jwt.sign({ _id: user._id }, 'developer$234')

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

// Feed API - GET /feed -- get alla the users from the database
//    get user email

app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const user = await User.findOne();
        if (!user) {
            res.status(404).send('user not found');
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(400).send('something went wrong')
    }
    try {
        const user = await User.find({ email: userEmail })
        if (user.length === 0) {
            res.status(404).send('user not found')
        } else {
            res.send(user)
        }
    } catch (err) {
        res.status(400).send('something went wrong')
    }
})

// delete API

app.delete("/user", async (req, res) => {
    const userID = req.body.userID;
    try {
        const user = await User.findByIdAndDelete(userID)
        res.send('user deleted successfully')
    } catch (err) {
        res.status(400).send('something went wrong')
    }
})

// patch APPI

app.patch("/user", async (req, res) => {
    const userID = req.body.userID;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = [
            "firstName",
            "secondName",
            "password",
            "age",
            "gender",
            "photoUrl",
            "about",
            "skills"
        ];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed) {
            throw new Error("update not valid")
        }
        if (data?.skills.length > 10) {
            throw new Error('skills cant be more than 10')
        }
        await User.findByIdAndUpdate({ _id: userID }, data, {
            returnDocument: "after",
            runValidators: true,
        })

        res.send('user details updated sucessfully')
    } catch (err) {
        res.status(400).send('UPDATE FAILED:' + err.message)

    }
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
