const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All task routes are protected
router.use(protect);

// GET /api/tasks — get all tasks for logged-in user (with optional status & priority filter)
router.get('/', async (req, res) => {
  try {
    const filter = { user: req.user._id };

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.priority && req.query.priority !== 'all') {
      filter.priority = req.query.priority;
    }

    const sortField = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });
    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks — create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description?.trim(),
      status: status || 'todo',
      priority: priority || 'medium',
    });

    res.status(201).json({ task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/tasks/:id — get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tasks/:id — update a task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: 'Task title cannot be empty' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(status && { status }),
        ...(priority && { priority }),
      },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
