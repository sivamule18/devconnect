const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sivamule18:jHBj12j27ePiKT4C@nodepractice.m8ntr.mongodb.net/devconnect")

}
module.exports = connectDB;

