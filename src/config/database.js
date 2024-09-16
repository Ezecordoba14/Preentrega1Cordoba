import mongoose from "mongoose";

export const environment = async () => {
    try {
        await mongoose.connect("mongodb+srv://EzeCordoba:Franco140@cluster0.9jzufs6.mongodb.net/products_?retryWrites=true&w=majority&appName=Cluster0");
        console.log('Connected to MongoDB')
        
    } catch (error) {
        console.error(console, 'connection error:')
    }
}