import Answer from "../models/Answer.model.js";
import Doubt from "../models/Doubt.model.js";
import User from "../models/User.model.js";

// @desc    Create new answer
// @route   POST /api/answers/doubts/:doubtId
// @access  Private
export const createAnswer = async (req, res) => {
  try {
    const { content, parentAnswerId } = req.body;

    // Check if doubt exists
    const doubt = await Doubt.findById(req.params.doubtId);
    if (!doubt) {
      return res.status(404).json({
        status: "error",
        message: "Doubt not found",
      });
    }

    // Create answer
    const answer = await Answer.create({
      content,
      author: req.user.id,
      doubt: req.params.doubtId,
      parentAnswer: parentAnswerId || null,
    });

    // Update doubt answer count
    doubt.answerCount += 1;
    await doubt.save();

    // Update user stats and reputation
    req.user.stats.answersGiven += 1;
    console.log(
      `Calling updateReputation for answer_posted for user ${req.user._id}`
    );
    req.user.updateReputation("answer_posted");
    await req.user.save();

    // Populate answer with author details
    const populatedAnswer = await Answer.findById(answer._id).populate(
      "author",
      "name profilePhoto role department reputation badges"
    );

    // Send notification to doubt author (if it's not the same user)
    if (doubt.author.toString() !== req.user.id) {
      // Get io instance from app
      const io = req.app.get("io");
      const connectedUsers = req.app.get("connectedUsers");

      // Import sendNotification function
      const { sendNotification } = await import("./notification.controller.js");

      // Send notification
      sendNotification(io, connectedUsers, {
        recipient: doubt.author,
        sender: req.user,
        type: parentAnswerId ? "new_reply" : "new_answer",
        doubt: doubt,
        answer: answer,
        message: parentAnswerId
          ? `${req.user.name} replied to your answer`
          : `${req.user.name} answered your question`,
      });
    }

    res.status(201).json({
      status: "success",
      data: { answer: populatedAnswer },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Update answer
// @route   PUT /api/answers/:id
// @access  Private
export const updateAnswer = async (req, res) => {
  try {
    let answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        status: "error",
        message: "Answer not found",
      });
    }

    // Check ownership
    if (answer.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to update this answer",
      });
    }

    const { content } = req.body;

    // Store edit history
    answer.editHistory.push({
      editedAt: Date.now(),
      previousContent: answer.content,
    });
    answer.isEdited = true;

    answer.content = content;
    await answer.save();

    const populatedAnswer = await Answer.findById(answer._id).populate(
      "author",
      "name profilePhoto role department reputation"
    );

    res.status(200).json({
      status: "success",
      data: { answer: populatedAnswer },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Delete answer
// @route   DELETE /api/answers/:id
// @access  Private
export const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        status: "error",
        message: "Answer not found",
      });
    }

    // Check ownership
    if (answer.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Not authorized to delete this answer",
      });
    }

    // Update doubt answer count
    const doubt = await Doubt.findById(answer.doubt);
    if (doubt) {
      doubt.answerCount -= 1;
      if (
        doubt.acceptedAnswer &&
        doubt.acceptedAnswer.toString() === answer._id.toString()
      ) {
        doubt.acceptedAnswer = null;
        doubt.isResolved = false;
      }
      await doubt.save();
    }

    // Delete child answers (replies)
    await Answer.deleteMany({ parentAnswer: req.params.id });

    await answer.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Answer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Vote on answer
// @route   POST /api/answers/:id/vote
// @access  Private
export const voteAnswer = async (req, res) => {
  try {
    const { voteType } = req.body;
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        status: "error",
        message: "Answer not found",
      });
    }

    const userId = req.user.id;
    const wasUpvoted = answer.upvotes.includes(userId);
    const wasDownvoted = answer.downvotes.includes(userId);

    // Remove previous votes
    answer.upvotes = answer.upvotes.filter((id) => id.toString() !== userId);
    answer.downvotes = answer.downvotes.filter(
      (id) => id.toString() !== userId
    );

    // Add new vote
    if (voteType === "upvote") {
      answer.upvotes.push(userId);

      // Update answer author's reputation
      if (!wasUpvoted) {
        const author = await User.findById(answer.author);
        console.log(
          `Calling updateReputation for upvote_received for user ${author._id}`
        );
        author.updateReputation("upvote_received");
        author.stats.helpfulVotes += 1;
        await author.save();

        // Send notification to answer author
        if (author._id.toString() !== req.user.id) {
          // Get io instance from app
          const io = req.app.get("io");
          const connectedUsers = req.app.get("connectedUsers");

          // Import sendNotification function
          const { sendNotification } = await import(
            "./notification.controller.js"
          );

          // Send notification
          sendNotification(io, connectedUsers, {
            recipient: author._id,
            sender: req.user,
            type: "upvoted_answer",
            doubt: await Doubt.findById(answer.doubt).select("title"),
            answer: answer,
            message: `${req.user.name} upvoted your answer`,
          });
        }
      }
    } else if (voteType === "downvote") {
      answer.downvotes.push(userId);

      if (!wasDownvoted) {
        const author = await User.findById(answer.author);
        console.log(
          `Calling updateReputation for downvote_received for user ${author._id}`
        );
        author.updateReputation("downvote_received");
        await author.save();
      }
    }

    await answer.save();

    res.status(200).json({
      status: "success",
      data: {
        voteScore: answer.voteScore,
        upvotes: answer.upvotes.length,
        downvotes: answer.downvotes.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Accept answer (mark as best answer)
// @route   POST /api/answers/:id/accept
// @access  Private
export const acceptAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        status: "error",
        message: "Answer not found",
      });
    }

    const doubt = await Doubt.findById(answer.doubt);

    if (!doubt) {
      return res.status(404).json({
        status: "error",
        message: "Associated doubt not found",
      });
    }

    // Only doubt author can accept answer
    if (doubt.author.toString() !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Only the doubt author can accept an answer",
      });
    }

    // Unaccept previous answer if any
    if (doubt.acceptedAnswer) {
      const prevAnswer = await Answer.findById(doubt.acceptedAnswer);
      if (prevAnswer) {
        prevAnswer.isAccepted = false;
        await prevAnswer.save();
      }
    }

    // Accept new answer
    answer.isAccepted = true;
    await answer.save();

    doubt.acceptedAnswer = answer._id;
    doubt.isResolved = true;
    doubt.resolvedAt = Date.now();
    await doubt.save();

    // Update answer author's reputation and stats
    const author = await User.findById(answer.author);
    console.log(
      `Calling updateReputation for answer_accepted for user ${author._id}`
    );
    author.updateReputation("answer_accepted");
    author.stats.bestAnswers += 1;
    await author.save();

    // Send notification to answer author
    if (author._id.toString() !== req.user.id) {
      // Get io instance from app
      const io = req.app.get("io");
      const connectedUsers = req.app.get("connectedUsers");

      // Import sendNotification function
      const { sendNotification } = await import("./notification.controller.js");

      // Send notification
      sendNotification(io, connectedUsers, {
        recipient: author._id,
        sender: req.user,
        type: "accepted_answer",
        doubt: doubt,
        answer: answer,
        message: `${req.user.name} accepted your answer as the best answer`,
      });
    }

    res.status(200).json({
      status: "success",
      data: { answer },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Verify answer (faculty only)
// @route   POST /api/answers/:id/verify
// @access  Private (Faculty/Admin)
export const verifyAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        status: "error",
        message: "Answer not found",
      });
    }

    answer.isFacultyVerified = !answer.isFacultyVerified;
    answer.verifiedBy = answer.isFacultyVerified ? req.user.id : null;
    await answer.save();

    // Award badge to answer author if verified
    if (answer.isFacultyVerified) {
      const author = await User.findById(answer.author);
      console.log(
        `Calling updateReputation for best_answer for user ${author._id}`
      );
      author.updateReputation("best_answer");

      // Add verified answer badge if not already present
      const hasBadge = author.badges.some((b) => b.name === "Faculty Verified");
      if (!hasBadge) {
        author.badges.push({
          name: "Faculty Verified",
          icon: "✓",
        });
      }
      await author.save();
    }

    res.status(200).json({
      status: "success",
      data: { answer },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
