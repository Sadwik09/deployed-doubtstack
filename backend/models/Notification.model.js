import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "new_answer",
        "new_reply",
        "accepted_answer",
        "upvoted_answer",
        "upvoted_doubt",
      ],
      required: true,
    },
    doubt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doubt",
    },
    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ doubt: 1 });
notificationSchema.index({ answer: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
