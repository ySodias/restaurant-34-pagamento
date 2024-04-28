import mongoose from "mongoose";


const connectToMongoDB = async () => {
    const url = process.env.DATABASE_URL;
    const dbName = process.env.DATABASE_NAME;

    try {
        await mongoose.connect(`${url}/${dbName}`);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const disconnectFromMongoDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
};

export { connectToMongoDB, disconnectFromMongoDB };
