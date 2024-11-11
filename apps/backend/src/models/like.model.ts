import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Like document
interface ILike extends Document {
    video?: mongoose.Types.ObjectId;
    comment?: mongoose.Types.ObjectId;
    tweet?: mongoose.Types.ObjectId;
    likedBy: mongoose.Types.ObjectId;
}

// Define the like schema
const likeSchema: Schema<ILike> = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

// Define and export the Like model
export const Like: Model<ILike> = mongoose.model<ILike>("Like", likeSchema);
