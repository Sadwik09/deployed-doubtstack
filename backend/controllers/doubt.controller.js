import Answer from "../models/Answer.model.js";
import Doubt from "../models/Doubt.model.js";
import Tag from "../models/Tag.model.js";

// @desc    Get all doubts with filters
// @route   GET /api/doubts
// @access  Public
export const getDoubts = async (req, res) => {
  try {
    const {
      subject,
      department,
      tags,
      isResolved,
      isUrgent,
      search,
      sort = "-createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    const query = {};

    if (subject) query.subject = subject;
    if (department) query.department = department;
    if (tags) query.tags = { $in: tags.split(",") };
    if (isResolved !== undefined) query.isResolved = isResolved === "true";
    if (isUrgent !== undefined) query.isUrgent = isUrgent === "true";

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const doubts = await Doubt.find(query)
      .populate("author", "name profilePhoto role department reputation")
      .populate("acceptedAnswer")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Doubt.countDocuments(query);

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
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Get single doubt by ID
// @route   GET /api/doubts/:id
// @access  Public
export const getDoubtById = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate("author", "name profilePhoto role department reputation badges")
      .populate({
        path: "acceptedAnswer",
        populate: {
          path: "author",
          select: "name profilePhoto role reputation",
        },
      });

    if (!doubt) {
      return res.status(404).json({
        status: "error",
        message: "Doubt not found",
      });
    }

    // Increment view count
    doubt.views += 1;
    await doubt.save();

    // Get all answers for this doubt
    const answers = await Answer.find({
      doubt: req.params.id,
      parentAnswer: null,
    })
      .populate("author", "name profilePhoto role reputation badges")
      .populate({
        path: "replies",
        populate: {
          path: "author",
          select: "name profilePhoto role reputation",
        },
      })
      .sort("-voteScore -createdAt");

    res.status(200).json({
      status: "success",
      data: {
        doubt,
        answers,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Create new doubt
// @route   POST /api/doubts
// @access  Private
export const createDoubt = async (req, res) => {
  try {
    const { title, description, subject, isUrgent, tags } = req.body;

    // Handle tags - ensure it's an array
    let processedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        processedTags = tags;
      } else if (typeof tags === "string") {
        // If it's a string, split by comma
        processedTags = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
      }
    }

    // No file attachments since we removed the upload feature

    const doubt = await Doubt.create({
      title,
      description,
      tags: processedTags,
      subject,
      department: req.user.department,
      author: req.user.id,
      attachments: [], // No attachments
      isUrgent: isUrgent === "true" || isUrgent === true || isUrgent === "on",
    });

    // Update user stats
    req.user.stats.questionsAsked += 1;
    console.log(
      `Calling updateReputation for question_posted for user ${req.user._id}`
    );
    req.user.updateReputation("question_posted");
    await req.user.save();

    // Update tag usage count
    if (processedTags && processedTags.length > 0) {
      for (const tagName of processedTags) {
        await Tag.findOneAndUpdate(
          { name: tagName.toLowerCase() },
          { $inc: { usageCount: 1 } },
          { upsert: true, new: true }
        );
      }
    }

    const populatedDoubt = await Doubt.findById(doubt._id).populate(
      "author",
      "name profilePhoto role department"
    );

    res.status(201).json({
      status: "success",
      data: { doubt: populatedDoubt },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Update doubt
// @route   PUT /api/doubts/:id
// @access  Private
export const updateDoubt = async (req, res) => {
  try {
    let doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({
        status: "error",
        message: "Doubt not found",
      });
    }

    // Check ownership
    if (doubt.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this doubt",
      });
    }

    const { title, description, tags, subject, isUrgent } = req.body;

    doubt = await Doubt.findByIdAndUpdate(
      req.params.id,
      { title, description, tags, subject, isUrgent },
      { new: true, runValidators: true }
    ).populate("author", "name profilePhoto role department");

    res.status(200).json({
      status: "success",
      data: { doubt },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Delete doubt
// @route   DELETE /api/doubts/:id
// @access  Private
export const deleteDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({
        status: "error",
        message: "Doubt not found",
      });
    }

    // Check ownership
    if (doubt.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this doubt",
      });
    }

    // Delete all associated answers
    await Answer.deleteMany({ doubt: req.params.id });

    await doubt.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Doubt deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Mark doubt as resolved
// @route   PUT /api/doubts/:id/resolve
// @access  Private
export const resolveDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({
        status: "error",
        message: "Doubt not found",
      });
    }

    // Only author can resolve
    if (doubt.author.toString() !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Only the doubt author can mark it as resolved",
      });
    }

    doubt.isResolved = true;
    doubt.resolvedAt = Date.now();
    await doubt.save();

    res.status(200).json({
      status: "success",
      data: { doubt },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Vote on doubt
// @route   POST /api/doubts/:id/vote
// @access  Private
export const voteDoubt = async (req, res) => {
  try {
    const { voteType } = req.body;
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({
        status: "error",
        message: "Doubt not found",
      });
    }

    const userId = req.user.id;

    // Remove previous votes
    doubt.upvotes = doubt.upvotes.filter((id) => id.toString() !== userId);
    doubt.downvotes = doubt.downvotes.filter((id) => id.toString() !== userId);

    // Add new vote
    if (voteType === "upvote") {
      doubt.upvotes.push(userId);

      // Send notification to doubt author
      if (doubt.author.toString() !== userId) {
        // Get io instance from app
        const io = req.app.get("io");
        const connectedUsers = req.app.get("connectedUsers");

        // Import sendNotification function
        const { sendNotification } = await import(
          "./notification.controller.js"
        );

        // Send notification
        sendNotification(io, connectedUsers, {
          recipient: doubt.author,
          sender: req.user,
          type: "upvoted_doubt",
          doubt: doubt,
          message: `${req.user.name} upvoted your question`,
        });
      }
    } else if (voteType === "downvote") {
      doubt.downvotes.push(userId);
    }

    await doubt.save();

    res.status(200).json({
      status: "success",
      data: {
        voteScore: doubt.voteScore,
        upvotes: doubt.upvotes.length,
        downvotes: doubt.downvotes.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Follow/unfollow doubt
// @route   POST /api/doubts/:id/follow
// @access  Private
export const followDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({
        status: "error",
        message: "Doubt not found",
      });
    }

    const userId = req.user.id;
    const isFollowing = doubt.followers.includes(userId);

    if (isFollowing) {
      // Unfollow
      doubt.followers = doubt.followers.filter(
        (id) => id.toString() !== userId
      );
    } else {
      // Follow
      doubt.followers.push(userId);
    }

    await doubt.save();

    res.status(200).json({
      status: "success",
      data: {
        isFollowing: !isFollowing,
        followerCount: doubt.followers.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
