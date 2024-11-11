import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Playlist document
interface IPlaylist extends Document {
    name: string;
    description: string;
    videos: mongoose.Types.ObjectId[];
    owner: mongoose.Types.ObjectId;
}

// Define the playlist schema
const playlistSchema: Schema<IPlaylist> = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

// Define and export the Playlist model
export const Playlist: Model<IPlaylist> = mongoose.model<IPlaylist>("Playlist", playlistSchema);
