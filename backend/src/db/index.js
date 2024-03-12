import mongoose from "mongoose";

export const Connect_DB = async() => {
    try {
       let connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
       console.log(connectionInstance.connection.host);
    } catch (error) {
        console.log(`Failed to connect the DB`, error);
    }
}