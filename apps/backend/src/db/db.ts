import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;


// example for mongoose connection below
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

// alternative db connection
// import mongoose from 'mongoose';
// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI as string, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log('MongoDB connected successfully');
//     } catch (error) {
//         console.error('MongoDB connection failed:', error);
//         throw error;
//     }
// };
// export default connectDB;
