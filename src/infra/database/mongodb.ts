import mongoose from "mongoose";

const connectToMongoDB = async (urlManual?: string) => {
    const url = process.env.DATABASE_URL;
    const dbName = process.env.DATABASE_NAME;

    try {
        urlManual ? await mongoose.connect(urlManual) : await mongoose.connect(`${url}/${dbName}`);
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
