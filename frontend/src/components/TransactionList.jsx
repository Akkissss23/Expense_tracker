import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransaction } from '../store/slices/transactionSlice';

const TransactionList = ({ transactions }) => {
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({
        type: '',
        category: '',
        startDate: '',
        endDate: ''
    });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await dispatch(deleteTransaction(id)).unwrap();
            } catch (error) {
                console.error('Failed to delete transaction:', error);
            }
        }
    };

    // Apply filters
    const filteredTransactions = transactions.filter((transaction) => {
        if (filters.type && transaction.type !== filters.type) return false;
        if (filters.category && transaction.category !== filters.category) return false;
        if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) return false;
        if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) return false;
        return true;
    });

    // Get unique categories
    const categories = [...new Set(transactions.map(t => t.category))];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="card">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Transaction History</h2>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="input-field text-sm"
                >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="input-field text-sm"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="input-field text-sm"
                    placeholder="Start Date"
                />

                <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="input-field text-sm"
                    placeholder="End Date"
                />
            </div>

            {/* Transaction List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTransactions.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No transactions found</p>
                ) : (
                    filteredTransactions.map((transaction) => (
                        <div
                            key={transaction._id}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow"
                        >
                            <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-2 h-2 rounded-full ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'
                                        }`} />
                                    <div>
                                        <h3 className="font-medium text-slate-800">{transaction.title}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded">
                                                {transaction.category}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {formatDate(transaction.date)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-success' : 'text-danger'
                                    }`}>
                                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => handleDelete(transaction._id)}
                                    className="text-slate-400 hover:text-danger transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TransactionList;
