const express = require('express');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    }).populate('owner', 'name email').populate('members', 'name email').sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// POST /api/projects
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, color } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const project = await Project.create({
      title,
      description,
      color: color || '#4f46e5',
      owner: req.user._id,
      members: [req.user._id]
    });

    await project.populate('owner', 'name email');
    res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error creating project' });
  }
});

// GET /api/projects/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember = project.members.some(m => m._id.toString() === req.user._id.toString());
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    if (!isMember && !isOwner) return res.status(403).json({ message: 'Access denied' });

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// PUT /api/projects/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can update project' });
    }

    const { title, description, color, status } = req.body;
    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (color) project.color = color;
    if (status) project.status = status;

    await project.save();
    await project.populate('owner', 'name email');
    res.json({ message: 'Project updated', project });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can delete project' });
    }

    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

module.exports = router;
