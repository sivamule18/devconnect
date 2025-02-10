
const express = require('express')

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user");

app.use(express.json());

// post API
// app.post('/signup', async (req, res) => {
//     //creating new instance for user model
//     const user = new User(req.body);

    // Feed API - GET /feed -- get alla the users from the database

    //    get user email

//     app.get("/user", async (req, res) => {
//         const userEmail = req.body.email;
//         try{
// const user =await User.findOne();
// if(!user) {
//     res.status(404).send ('user not found');
// }else{
//     res.send(user);
// }
//         }catch(err){
// res.status(400).send('something went wrong')
//         }
//         // try {
//         //     const user = await User.find({ email: userEmail })
//         //     if(user.length ===0){
//         //         res.status(404).send('user not found')
//         //     }else{
//         //         res.send(user)  
//         //     }
//         // } catch (err) {
//         //     res.status(400).send('something went wrong')
//         // }


//     })
    // try {
    //     await user.save();
    //     res.send('user added sucessfuly');
    // } catch (err) {
    //     res.status(400).send('error saving the user' + err.message);

    // }
// })

// delete API

// app.delete("/user",async(req,res)=>{
//     const userID =req.body.userID;
//     try{
// const user=await User.findByIdAndDelete(userID)
// res.send('user deleted successfully')
//     }catch(err){
// res.status(400).send('something went wrong')
//     }
// })

// patch APPI

app.patch("/user",async(req,res)=>{
    const userID=req.body.userID;
    const data=req.body;
    try{
await User.findByIdAndUpdate({_id:userID},data)
res.send('user details updated sucessfully')
    }catch(err){
        res.status(400).send('somenthing went wrong')

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



