const mongoose = require("../Backend/node_modules/mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.join(__dirname, "../Backend/.env")
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });

        console.log("MongoDB connected successfully");

        return mongoose.connection;

    } catch (error) {
        console.error("MongoDB connection failed:");
        console.error(error.message);

        throw error;
    }
};

module.exports = connectDB;