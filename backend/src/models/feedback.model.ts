import mongoose, { Document, Schema } from "mongoose";

export interface IFeedback extends Document {
  userId?: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  feedbackType: "General" | "Bug" | "Suggestion";
  message: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema<IFeedback>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    email: { type: String },
    feedbackType: {
      type: String,
      enum: ["General", "Bug", "Suggestion"],
      default: "General",
    },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
