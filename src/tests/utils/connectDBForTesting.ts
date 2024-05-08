import mongoose from "mongoose";

export async function connectDBForTesting() {
    try {
        const dbUri = "mongodb://localhost:27017";
        const dbName = "test";
        await mongoose.connect(dbUri, {
            dbName,
            autoCreate: true,
        });
    } catch (error) {
        console.log("DB connect error");
    }
}

export async function disconnectDBForTesting() {
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.log("DB disconnect error");
    }
}