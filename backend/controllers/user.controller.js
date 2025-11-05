import mongoose from "mongoose";
import Answer from "../models/Answer.model.js";
import Doubt from "../models/Doubt.model.js";
import User from "../models/User.model.js";

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user profile: " + error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    // Check authorization
    if (req.params.id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this profile",
      });
    }

    const { name, bio, branch, semester, profilePhoto } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, branch, semester, profilePhoto },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Get user's doubts
// @route   GET /api/users/:id/doubts
// @access  Public
export const getUserDoubts = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID format",
      });
    }

    const { page = 1, limit = 10 } = req.query;

    const doubts = await Doubt.find({ author: req.params.id })
      .populate("author", "name profilePhoto role")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Doubt.countDocuments({ author: req.params.id });

    res.status(200).json({
      status: "success",
      data: {
        doubts,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user doubts:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user doubts: " + error.message,
    });
  }
};

// @desc    Get user's answers
// @route   GET /api/users/:id/answers
// @access  Public
export const getUserAnswers = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID format",
      });
    }

    const { page = 1, limit = 10 } = req.query;

    const answers = await Answer.find({ author: req.params.id })
      .populate("author", "name profilePhoto role")
      .populate("doubt", "title")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Answer.countDocuments({ author: req.params.id });

    res.status(200).json({
      status: "success",
      data: {
        answers,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user answers:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user answers: " + error.message,
    });
  }
};
