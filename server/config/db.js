const mongoose = require("mongoose");
require('dotenv').config();

const uri =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

const connectToDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Successfully connected to DB");
    } catch (error) {
        console.log("Unable to connect DB", error.message);
    }
}

module.exports = connectToDB;