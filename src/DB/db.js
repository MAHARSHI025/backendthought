import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectionIntance = await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DB_NAME}`)
        console.log("DB IS CONNECTED");
    } catch (error) {
        console.log("DB connection error", error);
        throw error
    }
}

export default connectDB