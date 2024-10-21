import mongoose from "mongoose";
import dotenvConfig from "./dotenv.config.js";

export const environment = async () => {
    try {
        await mongoose.connect(`${dotenvConfig.mongoUrlProducts}`);
        console.log('Connected to MongoDB')
        
    } catch (error) {
        console.error(console, 'connection error:')
    }
}