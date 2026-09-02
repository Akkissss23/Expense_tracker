import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <nav className="bg-white shadow-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">₹</span>
                        </div>
                        <span className="text-xl font-bold text-slate-800">ExpenseTracker</span>
                    </Link>

                    {isAuthenticated && (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-slate-600">
                                Welcome, <span className="font-medium text-slate-800">{user?.name}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
