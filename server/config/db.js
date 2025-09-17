const mongoose = require("mongoose");
require('dotenv').config();

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to DB");
    } catch (error) {
        console.log("Unable to connect DB", error.message);
    }
}

module.exports = connectToDB;