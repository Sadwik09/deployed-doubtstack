import User from '../models/User.model.js';
import Doubt from '../models/Doubt.model.js';
import Answer from '../models/Answer.model.js';

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    const { period = 'all', limit = 20 } = req.query;

    let dateFilter = {};
    
    if (period === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { createdAt: { $gte: monthAgo } };
    }

    // Get top users by reputation
    const topUsers = await User.find({ isActive: true })
      .select('name profilePhoto role department reputation stats badges')
      .sort('-reputation')
      .limit(parseInt(limit));

    // Get most active contributors (by answers)
    const topContributors = await User.aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          name: 1,
          profilePhoto: 1,
          role: 1,
          department: 1,
          reputation: 1,
          totalActivity: { 
            $add: ['$stats.questionsAsked', '$stats.answersGiven', '$stats.bestAnswers'] 
          }
        }
      },
      { $sort: { totalActivity: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Get top answers in period
    const topAnswerers = await Answer.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$author',
          answerCount: { $sum: 1 },
          upvotes: { $sum: { $size: '$upvotes' } }
        }
      },
      { $sort: { answerCount: -1, upvotes: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          profilePhoto: '$user.profilePhoto',
          role: '$user.role',
          department: '$user.department',
          reputation: '$user.reputation',
          answerCount: 1,
          upvotes: 1
        }
      }
    ]);

    // Get faculty verified contributors
    const facultyVerified = await User.find({
      isActive: true,
      'badges.name': 'Faculty Verified'
    })
      .select('name profilePhoto role department reputation badges')
      .sort('-stats.bestAnswers')
      .limit(10);

    res.status(200).json({
      status: 'success',
      data: {
        topUsers,
        topContributors,
        topAnswerers,
        facultyVerified
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get platform statistics
// @route   GET /api/leaderboard/stats
// @access  Public
export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalDoubts = await Doubt.countDocuments();
    const resolvedDoubts = await Doubt.countDocuments({ isResolved: true });
    const totalAnswers = await Answer.countDocuments();

    // Get most popular tags
    const popularTags = await Doubt.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get most active departments
    const activeDepartments = await Doubt.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Resolution rate
    const resolutionRate = totalDoubts > 0 
      ? ((resolvedDoubts / totalDoubts) * 100).toFixed(2) 
      : 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalDoubts,
        resolvedDoubts,
        totalAnswers,
        resolutionRate: `${resolutionRate}%`,
        popularTags,
        activeDepartments
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
