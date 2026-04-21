const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/tasks?project=<id>&status=<status>&priority=<priority>
router.get('/', protect, async (req, res) => {
  try {
    const { project, status, priority, assignee } = req.query;
    const filter = {};

    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'title color')
      .populate('comments.author', 'name email')
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// POST /api/tasks
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, status, priority, project, assignee, dueDate, tags } = req.body;

    if (!title) return res.status(400).json({ message: 'Task title is required' });
    if (!project) return res.status(400).json({ message: 'Project is required' });

    const projectDoc = await Project.findById(project);
    if (!projectDoc) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      project,
      assignee: assignee || null,
      createdBy: req.user._id,
      dueDate: dueDate || null,
      tags: tags || []
    });

    await task.populate('assignee', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('project', 'title color');

    res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error creating task' });
  }
});

// GET /api/tasks/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'title color')
      .populate('comments.author', 'name email');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
});

// PUT /api/tasks/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, status, priority, assignee, dueDate, tags } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (assignee !== undefined) task.assignee = assignee || null;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (tags !== undefined) task.tags = tags;

    await task.save();
    await task.populate('assignee', 'name email');
    await task.populate('createdBy', 'name email');
    await task.populate('project', 'title color');

    res.json({ message: 'Task updated', task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only task creator can delete' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// POST /api/tasks/:id/comments
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.comments.push({ text, author: req.user._id });
    await task.save();
    await task.populate('comments.author', 'name email');

    res.status(201).json({ message: 'Comment added', comments: task.comments });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// DELETE /api/tasks/:id/comments/:commentId
router.delete('/:id/comments/:commentId', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const comment = task.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only comment author can delete' });
    }

    task.comments.pull(req.params.commentId);
    await task.save();

    res.json({ message: 'Comment deleted', comments: task.comments });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
});

module.exports = router;
