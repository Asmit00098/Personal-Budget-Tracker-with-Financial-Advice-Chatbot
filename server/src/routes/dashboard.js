const express = require('express');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month) || now.getMonth() + 1;
  const year = Number(req.query.year) || now.getFullYear();

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  const userObjectId = new mongoose.Types.ObjectId(req.user.id);

  const expenses = await Expense.aggregate([
    { $match: { userId: userObjectId, date: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
      },
    },
  ]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.total, 0);

  const budgets = await Budget.find({ userId: userObjectId, month, year });

  const budgetByCategory = budgets.reduce((acc, b) => {
    acc[b.category] = b.limitAmount;
    return acc;
  }, {});

  const breakdown = expenses.map((e) => ({
    category: e._id,
    spent: e.total,
    budget: budgetByCategory[e._id] || 0,
  }));

  res.json({ month, year, totalSpent, breakdown });
});

module.exports = router;


