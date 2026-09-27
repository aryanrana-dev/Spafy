import mongoose from "mongoose"


export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected");

        try {
            const userIndexes = await mongoose.connection.collection("users").indexes();
            const legacyPhoneIndex = userIndexes.find(idx => idx.name === "phone_1" && !idx.sparse);
            if (legacyPhoneIndex) {
                await mongoose.connection.collection("users").dropIndex("phone_1");
                console.log("Dropped legacy non-sparse phone_1 index");
            }
        } catch (idxErr) {
            // Ignore index drop if collection doesn't exist yet
        }
    }
    catch (err) {
        console.log(err);
    }
};