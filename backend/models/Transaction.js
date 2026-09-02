const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount'],
        min: [0, 'Amount cannot be negative']
    },
    type: {
        type: String,
        required: [true, 'Please specify transaction type'],
        enum: {
            values: ['income', 'expense'],
            message: 'Type must be either income or expense'
        }
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Please provide a date'],
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for better query performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
