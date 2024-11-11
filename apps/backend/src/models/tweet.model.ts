import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Tweet document
interface ITweet extends Document {
    content: string;
    owner: mongoose.Types.ObjectId;
}

// Define the tweet schema
const tweetSchema: Schema<ITweet> = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

// Define and export the Tweet model
export const Tweet: Model<ITweet> = mongoose.model<ITweet>("Tweet", tweetSchema);
