import connectDB from "./DB/db.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
    path: './env'
})

const port = process.env.PORT || 4000
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`SERVER IS RUNNING ON PORT ${port}`);
        })
    })
    .catch((error) => {
        console.log("DB connection Failed", error);
    })