const express = require('express');
const router = express.Router();
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getAnalytics,
    getIncomeByCategory
} = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Analytics routes - MUST come before /:id to avoid conflicts
router.get('/analytics/overview', getAnalytics);
router.get('/analytics/income', getIncomeByCategory);

// Transaction CRUD routes
router.route('/')
    .get(getTransactions)
    .post(createTransaction);

router.route('/:id')
    .put(updateTransaction)
    .delete(deleteTransaction);

module.exports = router;
