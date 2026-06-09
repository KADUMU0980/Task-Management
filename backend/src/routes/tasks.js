const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.post('/reorder', reorderTasks);
router.post('/bulk', bulkUpdateTasks);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);
router.post('/:id/comments', addComment);
router.post('/:id/subtasks', addSubtask);
router.patch('/:id/subtasks/:subtaskId/toggle', toggleSubtask);
router.delete('/:id/subtasks/:subtaskId', deleteSubtask);

module.exports = router;
