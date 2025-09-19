const express = require('express');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  try {
    const { category, limitAmount, month, year } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, category, month, year },
      { $set: { limitAmount } },
      { upsert: true, new: true }
    );
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: 'Invalid budget data' });
  }
});

router.get('/', async (req, res) => {
  const { month, year } = req.query;
  const filter = { userId: req.user.id };
  if (month) filter.month = Number(month);
  if (year) filter.year = Number(year);
  const items = await Budget.find(filter);
  res.json(items);
});

router.put('/:id', async (req, res) => {
  try {
    const { limitAmount, category, month, year } = req.body;
    const updated = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...(limitAmount !== undefined ? { limitAmount } : {}), ...(category ? { category } : {}), ...(month ? { month } : {}), ...(year ? { year } : {}) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Invalid budget update' });
  }
});

router.delete('/:id', async (req, res) => {
  const deleted = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
});

module.exports = router;


