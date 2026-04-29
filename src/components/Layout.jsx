import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, User, PlusCircle, List } from 'lucide-react';

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/edit');
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                PaymentMgr
              </Link>
              <div className="flex space-x-4">
                <Link 
                  to="/" 
                  className={`px-3 py-2 text-sm font-medium flex items-center rounded-md ${
                    isActive('/') ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  Vouchers
                </Link>
                <Link 
                  to="/create" 
                  className={`px-3 py-2 text-sm font-medium flex items-center rounded-md ${
                    isActive('/create') ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Entry
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium">{user?.username}</span>
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded uppercase font-bold tracking-wider">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">{title}</h1>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-xs">
          Payment Manager &copy; 2026
        </div>
      </footer>
    </div>
  );
};

export default Layout;
