import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please provide answer content"],
      maxlength: [5000, "Answer cannot be more than 5000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doubt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doubt",
      required: true,
    },
    parentAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      default: null,
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
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isFacultyVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileType: String,
      },
    ],
    editHistory: [
      {
        editedAt: Date,
        previousContent: String,
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
answerSchema.index({ doubt: 1, createdAt: -1 });
answerSchema.index({ author: 1 });

// Virtual for vote score
answerSchema.virtual("voteScore").get(function () {
  // Add safety checks for undefined arrays
  const upvotes = this.upvotes || [];
  const downvotes = this.downvotes || [];
  return upvotes.length - downvotes.length;
});

// Populate replies (nested answers)
answerSchema.virtual("replies", {
  ref: "Answer",
  localField: "_id",
  foreignField: "parentAnswer",
  options: { sort: { createdAt: 1 } },
});

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
