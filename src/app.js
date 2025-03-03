const express = require('express')
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(cookieParser());
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);


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
