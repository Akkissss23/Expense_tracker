import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTransaction } from '../store/slices/transactionSlice';

const TransactionForm = ({ onSuccess }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0]
    });

    const expenseCategories = [
        'Food & Dining',
        'Transportation',
        'Shopping',
        'Entertainment',
        'Bills & Utilities',
        'Healthcare',
        'Education',
        'Other'
    ];

    const incomeCategories = [
        'Salary',
        'Freelance',
        'Investment',
        'Business',
        'Gift',
        'Other'
    ];

    const categories = formData.type === 'expense' ? expenseCategories : incomeCategories;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset category when type changes
            ...(name === 'type' && { category: '' })
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const transactionData = {
            ...formData,
            amount: parseFloat(formData.amount)
        };

        try {
            await dispatch(createTransaction(transactionData)).unwrap();
            // Reset form
            setFormData({
                title: '',
                amount: '',
                type: 'expense',
                category: '',
                date: new Date().toISOString().split('T')[0]
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Failed to create transaction:', error);
        }
    };

    return (
        <div className="card">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g., Grocery shopping"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="input-field"
                            max={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="label">Type</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="expense"
                                checked={formData.type === 'expense'}
                                onChange={handleChange}
                                className="w-4 h-4 text-danger focus:ring-danger"
                            />
                            <span className="text-sm font-medium text-slate-700">Expense</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="type"
                                value="income"
                                checked={formData.type === 'income'}
                                onChange={handleChange}
                                className="w-4 h-4 text-success focus:ring-success"
                            />
                            <span className="text-sm font-medium text-slate-700">Income</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="label">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="input-field"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn-primary w-full">
                    Add Transaction
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;
