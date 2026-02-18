import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountApi, transactionApi } from '../api/client';
import { Account, Transaction } from '../types';
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import { LogOut, Plus, Download, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'monthly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, [selectedDate, selectedPeriod]);

  const loadAccounts = async () => {
    try {
      const response = await accountApi.getAll();
      setAccounts(response.data);
    } catch (error) {
      console.error('Failed to load accounts', error);
    }
  };

  const loadTransactions = async () => {
    try {
      let start, end;
      if (selectedPeriod === 'monthly') {
        start = startOfMonth(selectedDate);
        end = endOfMonth(selectedDate);
      } else {
        start = startOfDay(selectedDate);
        end = endOfDay(selectedDate);
      }
      const response = await transactionApi.getByDateRange(
        start.toISOString(),
        end.toISOString()
      );
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to load transactions', error);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

  const downloadReport = () => {
    const csv = [
      ['Date', 'Type', 'Amount', 'Category', 'Description', 'Sender/Receiver', 'Payment Method', 'Account'],
      ...transactions.map((t) => [
        format(new Date(t.transactionDate), 'dd/MM/yyyy HH:mm'),
        t.type,
        t.amount,
        t.category || '',
        t.description || '',
        t.senderReceiver || '',
        t.paymentMethod,
        t.account.accountName,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${format(selectedDate, 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Expense Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {username}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-800">₹{totalBalance.toFixed(2)}</p>
              </div>
              <Wallet className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Income</p>
                <p className="text-2xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expenses</p>
                <p className="text-2xl font-bold text-red-600">₹{totalExpense.toFixed(2)}</p>
              </div>
              <TrendingDown className="text-red-600" size={32} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Transactions</h2>
            <div className="flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'daily' | 'monthly')}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
              <input
                type={selectedPeriod === 'monthly' ? 'month' : 'date'}
                value={format(selectedDate, selectedPeriod === 'monthly' ? 'yyyy-MM' : 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download size={18} />
                Download
              </button>
              <button
                onClick={() => setShowAddTransaction(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Transaction
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-3 text-sm">{format(new Date(t.transactionDate), 'dd/MM/yyyy HH:mm')}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          t.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">₹{t.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">{t.category || '-'}</td>
                    <td className="px-4 py-3 text-sm">{t.description || '-'}</td>
                    <td className="px-4 py-3 text-sm">{t.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Accounts</h2>
            <button
              onClick={() => setShowAddAccount(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Account
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accounts.map((acc) => (
              <div key={acc.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">{acc.accountName}</h3>
                <p className="text-sm text-gray-600">{acc.accountNumber || 'No account number'}</p>
                <p className="text-lg font-bold text-blue-600 mt-2">₹{acc.currentBalance.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddAccount && (
        <AddAccountModal onClose={() => { setShowAddAccount(false); loadAccounts(); }} />
      )}
      {showAddTransaction && (
        <AddTransactionModal accounts={accounts} onClose={() => { setShowAddTransaction(false); loadTransactions(); }} />
      )}
    </div>
  );
};

const AddAccountModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    openingBalance: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await accountApi.create(formData);
      onClose();
    } catch (error) {
      console.error('Failed to create account', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Account Name</label>
            <input
              type="text"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Number (Optional)</label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Opening Balance</label>
            <input
              type="number"
              step="0.01"
              value={formData.openingBalance}
              onChange={(e) => setFormData({ ...formData, openingBalance: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Add Account
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddTransactionModal: React.FC<{ accounts: Account[]; onClose: () => void }> = ({ accounts, onClose }) => {
  const [formData, setFormData] = useState({
    accountId: accounts[0]?.id || 0,
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    amount: 0,
    transactionDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    category: '',
    description: '',
    senderReceiver: '',
    paymentMethod: 'UPI' as 'UPI' | 'CARD' | 'CASH' | 'BANK_TRANSFER' | 'OTHER',
    paymentDetails: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transactionApi.create({
        ...formData,
        transactionDate: new Date(formData.transactionDate).toISOString(),
      });
      onClose();
    } catch (error) {
      console.error('Failed to create transaction', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl m-4">
        <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Account</label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'INCOME' | 'EXPENSE' })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date & Time</label>
              <input
                type="datetime-local"
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Food, Transport, Salary, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sender/Receiver</label>
              <input
                type="text"
                value={formData.senderReceiver}
                onChange={(e) => setFormData({ ...formData, senderReceiver: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Details</label>
              <input
                type="text"
                value={formData.paymentDetails}
                onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="UPI ID, Card name, etc."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Add Transaction
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
