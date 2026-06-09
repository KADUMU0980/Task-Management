const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all tasks for current user
// @route   GET /api/tasks
const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 50,
    } = req.query;

    const query = { userId: req.user._id, isArchived: false };

    if (search) {
      query.$text = { $search: search };
    }
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      Task.find(query).sort(sortOptions).skip(skip).limit(Number(limit)).lean(),
      Task.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, dueDate, tags, subtasks } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      category: category || 'other',
      dueDate: dueDate || null,
      tags: tags || [],
      subtasks: subtasks || [],
      userId: req.user._id,
    });

    await ActivityLog.create({
      userId: req.user._id,
      taskId: task._id,
      taskTitle: task.title,
      action: 'task_created',
      metadata: { priority, status },
    });

    res.status(201).json({ success: true, message: 'Task created successfully!', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const oldStatus = task.status;
    const oldPriority = task.priority;

    const allowedFields = ['title', 'description', 'status', 'priority', 'category', 'dueDate', 'tags', 'subtasks'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    // Log specific changes
    if (oldStatus !== task.status) {
      await ActivityLog.create({
        userId: req.user._id,
        taskId: task._id,
        taskTitle: task.title,
        action: task.status === 'completed' ? 'task_completed' : 'task_status_changed',
        metadata: { from: oldStatus, to: task.status },
      });
    } else if (oldPriority !== task.priority) {
      await ActivityLog.create({
        userId: req.user._id,
        taskId: task._id,
        taskTitle: task.title,
        action: 'task_priority_changed',
        metadata: { from: oldPriority, to: task.priority },
      });
    } else {
      await ActivityLog.create({
        userId: req.user._id,
        taskId: task._id,
        taskTitle: task.title,
        action: 'task_updated',
      });
    }

    res.json({ success: true, message: 'Task updated successfully!', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status only
// @route   PATCH /api/tasks/:id/status
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const oldStatus = task.status;
    task.status = status;
    await task.save();

    await ActivityLog.create({
      userId: req.user._id,
      taskId: task._id,
      taskTitle: task.title,
      action: status === 'completed' ? 'task_completed' : 'task_status_changed',
      metadata: { from: oldStatus, to: status },
    });

    res.json({ success: true, message: 'Task status updated!', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const taskTitle = task.title;
    await Task.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      userId: req.user._id,
      taskId: req.params.id,
      taskTitle,
      action: 'task_deleted',
    });

    res.json({ success: true, message: 'Task deleted successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.comments.push({
      userId: req.user._id,
      userName: req.user.name,
      text: text.trim(),
    });

    await task.save();

    await ActivityLog.create({
      userId: req.user._id,
      taskId: task._id,
      taskTitle: task.title,
      action: 'comment_added',
    });

    res.json({ success: true, message: 'Comment added!', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update task order (for Kanban drag-drop)
// @route   POST /api/tasks/reorder
const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body; // [{ id, status, order }]

    if (!Array.isArray(tasks)) {
      return res.status(400).json({ success: false, message: 'Tasks array required.' });
    }

    const ops = tasks.map(({ id, status, order }) => ({
      updateOne: {
        filter: { _id: id, userId: req.user._id },
        update: { $set: { status, order } },
      },
    }));

    await Task.bulkWrite(ops);
    res.json({ success: true, message: 'Tasks reordered!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle subtask completion
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId/toggle
const toggleSubtask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ success: false, message: 'Subtask not found.' });
    }

    subtask.completed = !subtask.completed;
    await task.save();

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Add subtask
// @route   POST /api/tasks/:id/subtasks
const addSubtask = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Subtask text is required.' });
    }

    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.subtasks.push({ text: text.trim() });
    await task.save();

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subtask
// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
const deleteSubtask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    task.subtasks = task.subtasks.filter(s => s._id.toString() !== req.params.subtaskId);
    await task.save();

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update tasks (status, priority, delete)
// @route   POST /api/tasks/bulk
const bulkUpdateTasks = async (req, res, next) => {
  try {
    const { taskIds, action, value } = req.body;
    if (!Array.isArray(taskIds) || !taskIds.length || !action) {
      return res.status(400).json({ success: false, message: 'taskIds array and action required.' });
    }

    const filter = { _id: { $in: taskIds }, userId: req.user._id };

    if (action === 'delete') {
      await Task.deleteMany(filter);
      await ActivityLog.create({
        userId: req.user._id,
        action: 'task_deleted',
        taskTitle: `${taskIds.length} tasks`,
        metadata: { count: taskIds.length },
      });
    } else if (action === 'status' && value) {
      await Task.updateMany(filter, { $set: { status: value } });
      // If completing, set completedAt
      if (value === 'completed') {
        await Task.updateMany(filter, { $set: { completedAt: new Date() } });
      }
    } else if (action === 'priority' && value) {
      await Task.updateMany(filter, { $set: { priority: value } });
    } else if (action === 'category' && value) {
      await Task.updateMany(filter, { $set: { category: value } });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action.' });
    }

    res.json({ success: true, message: `Bulk ${action} completed for ${taskIds.length} tasks.` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addComment,
  reorderTasks,
  toggleSubtask,
  addSubtask,
  deleteSubtask,
  bulkUpdateTasks,
};
