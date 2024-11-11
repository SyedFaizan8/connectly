import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Subscription document
interface ISubscription extends Document {
    subscriber: mongoose.Types.ObjectId;
    channel: mongoose.Types.ObjectId;
}

// Define the subscription schema
const subscriptionSchema: Schema<ISubscription> = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        channel: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

// Define and export the Subscription model
export const Subscription: Model<ISubscription> = mongoose.model<ISubscription>("Subscription", subscriptionSchema);
