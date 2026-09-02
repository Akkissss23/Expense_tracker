import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyBarChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-500">
                No monthly data available
            </div>
        );
    }

    // Transform data for chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Group by month
    const monthlyMap = {};
    data.forEach((item) => {
        const key = `${item.year}-${item.month}`;
        if (!monthlyMap[key]) {
            monthlyMap[key] = {
                month: `${monthNames[item.month - 1]} ${item.year}`,
                income: 0,
                expense: 0
            };
        }
        if (item.type === 'income') {
            monthlyMap[key].income = item.total;
        } else {
            monthlyMap[key].expense = item.total;
        }
    });

    const chartData = Object.values(monthlyMap).slice(0, 6).reverse();

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyBarChart;
