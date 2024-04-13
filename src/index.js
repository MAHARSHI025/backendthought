import connectDB from "./DB/db.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
    path: './env'
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("DB connection Failed", error);
    })