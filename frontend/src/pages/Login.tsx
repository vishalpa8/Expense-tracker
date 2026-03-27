import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { getErrorMessage } from '../utils/errorMessages';
import { INPUT_CLASS } from '../utils/styles';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(() => {
    const msg = localStorage.getItem('session_message');
    if (msg) { localStorage.removeItem('session_message'); return msg; }
    return '';
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const response = await authApi.login(username, password);
      login(response.data.token, response.data.username, response.data.fullName);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Wallet className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
          <p className="text-gray-500 text-sm">Manage your finances with ease</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className={INPUT_CLASS} placeholder="Enter your username" required disabled={loading} autoFocus />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className={INPUT_CLASS} placeholder="Enter your password" required disabled={loading} />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Don't have an account? <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
