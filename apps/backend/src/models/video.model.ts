import mongoose, { Schema, Document, Model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the interface for the Video document
interface IVideo extends Document {
    videoFile: string;
    thumbnail: string;
    title: string;
    description: string;
    duration: number;
    views: number;
    isPublished: boolean;
    owner: mongoose.Types.ObjectId;
}

// Define the video schema
const videoSchema: Schema<IVideo> = new Schema(
    {
        videoFile: {
            type: String, // cloudinary URL
            required: true
        },
        thumbnail: {
            type: String, // cloudinary URL
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
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

// Apply mongoose aggregate paginate plugin
videoSchema.plugin(mongooseAggregatePaginate);

// Define and export the Video model
export const Video: Model<IVideo> = mongoose.model<IVideo>("Video", videoSchema);
