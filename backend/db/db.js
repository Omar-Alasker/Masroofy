import mongoose from 'mongoose'

const connectDB = async (mongoUri) => {
    try {
        const connection = await mongoose.connect(mongoUri);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } 
    catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB