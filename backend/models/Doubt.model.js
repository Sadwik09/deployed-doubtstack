import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [5000, "Description cannot be more than 5000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    subject: {
      type: String,
      required: [true, "Please specify a subject"],
      trim: true,
    },
    department: {
      type: String,
      required: true,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isUrgent: {
      type: Boolean,
      default: false,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
    },
    acceptedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
    views: {
      type: Number,
      default: 0,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    answerCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
doubtSchema.index({ title: "text", description: "text", tags: "text" });
doubtSchema.index({ subject: 1, department: 1 });
doubtSchema.index({ createdAt: -1 });
doubtSchema.index({ isResolved: 1 });

// Virtual for vote score
doubtSchema.virtual("voteScore").get(function () {
  // Add safety checks for undefined arrays
  const upvotes = this.upvotes || [];
  const downvotes = this.downvotes || [];
  return upvotes.length - downvotes.length;
});

// Populate answers
doubtSchema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "doubt",
  options: { sort: { createdAt: -1 } },
});

const Doubt = mongoose.model("Doubt", doubtSchema);

export default Doubt;
