import mongoose, { Schema, Document, Model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the interface for a comment document
interface IComment extends Document {
    content: string;
    video: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
}

// Define the comment schema
const commentSchema: Schema<IComment> = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
);

// Apply the pagination plugin
commentSchema.plugin(mongooseAggregatePaginate);

// Define and export the Comment model
export const Comment: Model<IComment> = mongoose.model<IComment>("Comment", commentSchema);
