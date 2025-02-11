
const express = require('express')

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user");

app.use(express.json());

// post API
app.post('/signup', async (req, res) => {
    //creating new instance for user model
    const user = new User(req.body);
    try {
        await user.save();
        res.send('user details added sucessfully')
    } catch (err) {
        res.status(400).send('Error saving the user:' + err.message)
    }
});


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



