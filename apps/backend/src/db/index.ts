// import mongoose, { Connection } from "mongoose";
// import { DB_NAME } from "../constants";

// const connectDB = async (): Promise<void> => {
//     try {
//         const connectionInstance: Connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
//     } catch (error: any) {
//         console.log("MONGODB connection FAILED ", error);
//         process.exit(1);
//     }
// };

// export default connectDB;
