const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Other'] },
    description: { type: String, trim: true, default: '' },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);


