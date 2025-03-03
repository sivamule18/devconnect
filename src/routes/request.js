const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../midlewares/auth');


requestRouter.post('/sendconnectionrequest', userAuth, async (req, res) => {
    const user = req.user;
    console.log('sending request')
    res.send(user.secondName + 'send')
})

module.exports = requestRouter;