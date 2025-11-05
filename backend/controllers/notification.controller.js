import Notification from "../models/Notification.model.js";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;

    // Build query
    const query = { recipient: req.user.id };
    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    const notifications = await Notification.find(query)
      .populate("sender", "name profilePhoto")
      .populate("doubt", "title")
      .populate("answer", "content")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      status: "success",
      data: {
        notifications,
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

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true, readAt: Date.now() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { notification },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );

    res.status(200).json({
      status: "success",
      message: `Marked ${result.modifiedCount} notifications as read`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Utility function to send real-time notification
export const sendNotification = (io, connectedUsers, notificationData) => {
  const { recipient, sender, type, doubt, answer, message } = notificationData;

  // Don't notify the sender
  if (recipient.toString() === sender.toString()) {
    return;
  }

  // Create notification in database
  Notification.create({
    recipient,
    sender,
    type,
    doubt,
    answer,
    message,
  })
    .then((notification) => {
      // Send real-time notification if recipient is online
      const recipientSocketId = connectedUsers.get(recipient.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("notification", {
          ...notification.toObject(),
          sender: {
            _id: sender._id,
            name: sender.name,
            profilePhoto: sender.profilePhoto,
          },
          doubt: doubt ? { _id: doubt._id, title: doubt.title } : null,
          answer: answer ? { _id: answer._id } : null,
        });
      }
    })
    .catch((error) => {
      console.error("Error creating notification:", error);
    });
};
