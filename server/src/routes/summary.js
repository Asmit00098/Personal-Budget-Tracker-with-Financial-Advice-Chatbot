const express = require('express');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// GET /api/summary/budget-vs-actual?month=&year=
router.get('/budget-vs-actual', async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  // Aggregate actual spend per category
  const userObjectId = new mongoose.Types.ObjectId(req.user.id);

  const actualAgg = await Expense.aggregate([
    { $match: { userId: userObjectId, date: { $gte: start, $lte: end } } },
    { $group: { _id: '$category', actual: { $sum: '$amount' } } },
  ]);

  // Fetch budgets for the month
  const budgets = await Budget.find({ userId: userObjectId, month, year });

  // Combine categories from both actuals and budgets
  const categorySet = new Set([
    ...actualAgg.map(a => a._id),
    ...budgets.map(b => b.category),
  ]);

  const budgetMap = budgets.reduce((acc, b) => {
    acc[b.category] = b.limitAmount;
    return acc;
  }, {});

  const actualMap = actualAgg.reduce((acc, a) => {
    acc[a._id] = a.actual;
    return acc;
  }, {});

  const combined = Array.from(categorySet).map(category => ({
    category,
    budget: budgetMap[category] || 0,
    actual: actualMap[category] || 0,
  }));

  res.json({ month, year, items: combined });
});

module.exports = router;


