import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    branch: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    department: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
      required: function () {
        return this.role === "student";
      },
    },
    bio: {
      type: String,
      maxlength: [200, "Bio cannot be more than 200 characters"],
    },
    reputation: {
      type: Number,
      default: 0,
    },
    stats: {
      questionsAsked: {
        type: Number,
        default: 0,
      },
      answersGiven: {
        type: Number,
        default: 0,
      },
      bestAnswers: {
        type: Number,
        default: 0,
      },
      helpfulVotes: {
        type: Number,
        default: 0,
      },
    },
    badges: [
      {
        name: String,
        icon: String,
        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update reputation based on activity
userSchema.methods.updateReputation = function (action) {
  const points = {
    question_posted: 5,
    answer_posted: 10,
    answer_accepted: 25,
    upvote_received: 5,
    downvote_received: -2,
    best_answer: 50,
  };

  const pointsToAdd = points[action] || 0;
  console.log(
    `Updating reputation for user ${this._id} with action: ${action}, points: ${pointsToAdd}`
  );

  this.reputation += pointsToAdd;
  if (this.reputation < 0) this.reputation = 0;

  console.log(`New reputation value: ${this.reputation}`);
};

const User = mongoose.model("User", userSchema);

export default User;
