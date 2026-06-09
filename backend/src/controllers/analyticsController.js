const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// @desc    Dashboard stats
// @route   GET /api/analytics/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [total, completed, inProgress, todo, overdue, recentActivity] = await Promise.all([
      Task.countDocuments({ userId, isArchived: false }),
      Task.countDocuments({ userId, status: 'completed', isArchived: false }),
      Task.countDocuments({ userId, status: 'in-progress', isArchived: false }),
      Task.countDocuments({ userId, status: 'todo', isArchived: false }),
      Task.countDocuments({
        userId,
        status: { $ne: 'completed' },
        dueDate: { $lt: new Date() },
        isArchived: false,
      }),
      ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Priority breakdown
    const priorityStats = await Task.aggregate([
      { $match: { userId, isArchived: false } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Category breakdown
    const categoryStats = await Task.aggregate([
      { $match: { userId, isArchived: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Upcoming tasks (next 7 days)
    const upcomingTasks = await Task.find({
      userId,
      status: { $ne: 'completed' },
      dueDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      isArchived: false,
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        stats: { total, completed, inProgress, todo, overdue, completionRate },
        priorityStats,
        categoryStats,
        recentActivity,
        upcomingTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Weekly productivity data
// @route   GET /api/analytics/weekly
const getWeeklyData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const data = await Task.aggregate([
      {
        $match: {
          userId,
          completedAt: { $gte: weekAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const found = data.find((d) => d._id === dateStr);
      days.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: found ? found.count : 0,
      });
    }

    // Created per day
    const createdData = await Task.aggregate([
      { $match: { userId, createdAt: { $gte: weekAgo, $lte: now } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = days.map((d) => {
      const created = createdData.find((c) => c._id === d.date);
      return { ...d, created: created ? created.count : 0 };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Monthly summary
// @route   GET /api/analytics/monthly
const getMonthlyData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const data = await Task.aggregate([
      { $match: { userId, createdAt: { $gte: monthAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          created: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Activity logs
// @route   GET /api/analytics/activity
const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      ActivityLog.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ActivityLog.countDocuments({ userId: req.user._id }),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getWeeklyData, getMonthlyData, getActivityLogs };
