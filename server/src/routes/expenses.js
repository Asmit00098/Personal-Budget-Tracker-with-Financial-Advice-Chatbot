const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const expense = await Expense.create({ userId: req.user.id, amount, category, description, date });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: 'Invalid expense data' });
  }
});

router.get('/', async (req, res) => {
  const { startDate, endDate, category } = req.query;
  const filter = { userId: req.user.id };
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  const items = await Expense.find(filter).sort({ date: -1 });
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.put('/:id', async (req, res) => {
  const updated = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
});

module.exports = router;


