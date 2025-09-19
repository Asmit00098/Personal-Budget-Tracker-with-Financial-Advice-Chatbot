const express = require('express');
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ reply: 'AI is not configured. Ask your admin to set GEMINI_API_KEY.' });
    }

    // Pull recent user context
    const userId = req.user.id;
    const recentExpenses = await Expense.find({ userId }).sort({ date: -1 }).limit(10);
    const budgets = await Budget.find({ userId });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are "Flow," a friendly and encouraging financial advisor chatbot for a personal expense tracker app.
    Your primary goal is to provide simple, actionable, and positive financial advice by analyzing the user's raw financial data but only analyse it if user asks you to.
    \n\n### RULES\n- All monetary values discussed are in Indian Rupees (INR). Your analysis and responses must reflect this if you show monetary values.
    \n- Keep your response to 2-3 short, easy-to-read paragraphs.\n- The entire response must be plain text. 
    Do not use any markdown like bold, italics, or lists.
    \n- Always be positive and supportive. 
    \n- Directly analyze the raw JSON data provided below to make your answer specific and personal.
    \n\n---\n\n### USER'S FINANCIAL CONTEXT (All values are in INR)
    \n* Recent Expenses (JSON): ${JSON.stringify(recentExpenses)}\n* Budgets (JSON): ${JSON.stringify(budgets)}\n\n---\n\n
    ### USER'S QUESTION\n"${message}"\n\n
    Based on the rules and the user's raw JSON data, provide a helpful and concise response .  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error('Error with AI chat:', error);
    res.status(500).json({ error: 'Failed to get a response from the AI.' });
  }
});

module.exports = router;


