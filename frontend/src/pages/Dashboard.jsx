import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, fetchAnalytics } from '../store/slices/transactionSlice';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import CategoryPieChart from '../components/Charts/CategoryPieChart';
import MonthlyBarChart from '../components/Charts/MonthlyBarChart';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { transactions, analytics, loading } = useSelector((state) => state.transactions);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        dispatch(fetchTransactions());
        dispatch(fetchAnalytics());
    };

    const handleTransactionSuccess = () => {
        loadData();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-success to-green-600 text-white">
                        <p className="text-sm opacity-90">Total Income</p>
                        <p className="text-3xl font-bold mt-2">
                            ₹{analytics.stats.totalIncome.toFixed(2)}
                        </p>
                    </div>

                    <div className="card bg-gradient-to-br from-danger to-red-600 text-white">
                        <p className="text-sm opacity-90">Total Expenses</p>
                        <p className="text-3xl font-bold mt-2">
                            ₹{analytics.stats.totalExpense.toFixed(2)}
                        </p>
                    </div>

                    <div className={`card bg-gradient-to-br ${analytics.stats.balance >= 0
                        ? 'from-primary-500 to-primary-700'
                        : 'from-orange-500 to-orange-700'
                        } text-white`}>
                        <p className="text-sm opacity-90">Balance</p>
                        <p className="text-3xl font-bold mt-2">
                            ₹{analytics.stats.balance.toFixed(2)}
                        </p>
                    </div>

                    <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                        <p className="text-sm opacity-90">Transactions</p>
                        <p className="text-3xl font-bold mt-2">
                            {analytics.stats.transactionCount}
                        </p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <CategoryPieChart data={analytics.categoryBreakdown} />
                    <MonthlyBarChart data={analytics.monthlyData} />
                </div>

                {/* Transaction Form and List */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <TransactionForm onSuccess={handleTransactionSuccess} />
                    </div>

                    <div className="lg:col-span-2">
                        <TransactionList transactions={transactions} />
                    </div>
                </div>

                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 shadow-xl">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-slate-600">Loading...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
