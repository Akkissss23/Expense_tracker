/**
 * Transaction Controller
 * 
 * Handles all transaction-related operations including CRUD operations
 * and advanced analytics using MongoDB Aggregation Pipelines
 */

const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

/**
 * Get all transactions for the authenticated user
 * Supports filtering by date range and category
 */
const getTransactions = async (req, res) => {
    try {
        const { startDate, endDate, category, type } = req.query;

        // Build filter object
        const filter = { user: req.userId };

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        if (category) filter.category = category;
        if (type) filter.type = type;

        const transactions = await Transaction.find(filter)
            .sort({ date: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
};

/**
 * Create a new transaction
 */
const createTransaction = async (req, res) => {
    try {
        const { title, amount, type, category, date } = req.body;

        // Validation
        if (!title || !amount || !type || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate that date is not in the future
        const transactionDate = date ? new Date(date) : new Date();
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (transactionDate > today) {
            return res.status(400).json({
                success: false,
                message: 'Transaction date cannot be in the future'
            });
        }

        const transaction = await Transaction.create({
            user: req.userId,
            title,
            amount,
            type,
            category,
            date: transactionDate
        });

        res.status(201).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating transaction',
            error: error.message
        });
    }
};

/**
 * Update a transaction
 */
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedTransaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating transaction',
            error: error.message
        });
    }
};

/**
 * Delete a transaction
 */
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        await Transaction.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting transaction',
            error: error.message
        });
    }
};

/**
 * Get analytics data using MongoDB Aggregation Pipeline
 * Returns:
 * 1. Total expenses grouped by category
 * 2. Monthly income vs expense breakdown
 * 3. Overall statistics
 */
const getAnalytics = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        // Aggregation 1: Total expenses by category
        const categoryBreakdown = await Transaction.aggregate([
            {
                $match: {
                    user: userId,
                    type: 'expense'
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    category: '$_id',
                    total: 1,
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        // Aggregation 2: Monthly income vs expense
        const monthlyData = await Transaction.aggregate([
            {
                $match: {
                    user: userId
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        type: '$type'
                    },
                    total: { $sum: '$amount' }
                }
            },
            {
                $sort: {
                    '_id.year': -1,
                    '_id.month': -1
                }
            },
            {
                $project: {
                    year: '$_id.year',
                    month: '$_id.month',
                    type: '$_id.type',
                    total: 1,
                    _id: 0
                }
            }
        ]);

        // Aggregation 3: Overall statistics
        const overallStats = await Transaction.aggregate([
            {
                $match: {
                    user: userId
                }
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format overall stats
        const stats = {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            transactionCount: 0
        };

        overallStats.forEach(stat => {
            if (stat._id === 'income') {
                stats.totalIncome = stat.total;
            } else if (stat._id === 'expense') {
                stats.totalExpense = stat.total;
            }
            stats.transactionCount += stat.count;
        });

        stats.balance = stats.totalIncome - stats.totalExpense;

        res.status(200).json({
            success: true,
            data: {
                categoryBreakdown,
                monthlyData,
                stats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics',
            error: error.message
        });
    }
};

/**
 * Get income breakdown by category
 */
const getIncomeByCategory = async (req, res) => {
    try {
        const incomeBreakdown = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.userId),
                    type: 'income'
                }
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    category: '$_id',
                    total: 1,
                    count: 1,
                    _id: 0
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: incomeBreakdown
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching income breakdown',
            error: error.message
        });
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getAnalytics,
    getIncomeByCategory
};
