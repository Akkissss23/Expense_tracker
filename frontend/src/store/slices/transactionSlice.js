import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

const initialState = {
    transactions: [],
    analytics: {
        categoryBreakdown: [],
        monthlyData: [],
        stats: {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            transactionCount: 0
        }
    },
    loading: false,
    error: null
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
    'transactions/fetchAll',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await axios.get(`/transactions?${params}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }
);

export const createTransaction = createAsyncThunk(
    'transactions/create',
    async (transactionData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/transactions', transactionData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create transaction');
        }
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/transactions/${id}`, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update transaction');
        }
    }
);

export const deleteTransaction = createAsyncThunk(
    'transactions/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/transactions/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
        }
    }
);

export const fetchAnalytics = createAsyncThunk(
    'transactions/fetchAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/transactions/analytics/overview');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
        }
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch transactions
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create transaction
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.transactions.unshift(action.payload);
            })
            // Update transaction
            .addCase(updateTransaction.fulfilled, (state, action) => {
                const index = state.transactions.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.transactions[index] = action.payload;
                }
            })
            // Delete transaction
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.transactions = state.transactions.filter(t => t._id !== action.payload);
            })
            // Fetch analytics
            .addCase(fetchAnalytics.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.analytics = action.payload;
            })
            .addCase(fetchAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = transactionSlice.actions;
export default transactionSlice.reducer;
