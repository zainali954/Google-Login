import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("Error: MONGO_URI environment variable is not defined. Please check your environment configuration.");
        process.exit(1);  // Exit the process if MONGO_URI is missing
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected to: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);  // Exit the process on connection failure
    }
};

export default connectDB;
