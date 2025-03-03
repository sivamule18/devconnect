const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../midlewares/auth');
const { validateEditProfile } = require('../utils/validation');

profileRouter.get('/profile', userAuth, async (req, res) => {

    // validate my token
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send('ERROR:' + err.message);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditProfile(req)) {
            throw new Error('invalid to do edit')
        } 
        const loggedInUser = req.user;
        console.log(loggedInUser);
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.json({message: `${loggedInUser.firstName},profile was edited sucessfully`,data:loggedInUser,})
    } catch (err) {
        res.status(400).send('ERROR:' + err.message);
    }
})


module.exports = profileRouter;