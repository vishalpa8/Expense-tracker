import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountApi, transactionApi } from '../api/client';
import type { Account, Transaction } from '../types/index';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isSameMonth } from 'date-fns';
import { LogOut, TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { AddAccountModal, EditAccountModal } from '../components/AccountModals';
import { AddTransactionModal, EditTransactionModal } from '../components/TransactionModals';
import TransactionsSection from '../components/TransactionsSection';
import AccountsSection from '../components/AccountsSection';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/errorMessages';

const Dashboard: React.FC = () => {
  const { username, logout } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [accountFilterId, setAccountFilterId] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => { loadAccounts(); }, []);
  useEffect(() => { loadTransactions(); }, [selectedDate]);

  const loadAccounts = async () => {
    try { setAccounts((await accountApi.getAll()).data); } catch (e) { showToast(getErrorMessage(e), 'error'); }
  };
  const loadTransactions = async () => {
    try {
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);
      setTransactions((await transactionApi.getByDateRange(start.toISOString(), end.toISOString())).data);
    } catch (e) { showToast(getErrorMessage(e), 'error'); }
  };
  const refresh = () => { loadAccounts(); loadTransactions(); };

  const now = new Date();
  const isCurrentMonth = isSameMonth(selectedDate, now);
  const canGoNext = !isCurrentMonth && startOfMonth(selectedDate) < startOfMonth(now);

  const handleDeleteAccount = async () => {
    if (!deletingAccount) return;
    try {
      await accountApi.delete(deletingAccount.id);
      if (accountFilterId === deletingAccount.id) setAccountFilterId(null);
      setDeletingAccount(null);
      showToast(`"${deletingAccount.accountName}" deleted successfully`, 'success');
      refresh();
    } catch (e) { showToast(getErrorMessage(e), 'error'); setDeletingAccount(null); }
  };
  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return;
    try {
      await transactionApi.delete(deletingTransaction.id);
      setDeletingTransaction(null);
      showToast('Transaction deleted successfully', 'success');
      refresh();
    } catch (e) { showToast(getErrorMessage(e), 'error'); setDeletingTransaction(null); }
  };

  const filteredTransactions = accountFilterId
    ? transactions.filter((t) => t.account.id === accountFilterId)
    : transactions;
  const accountFilterName = accountFilterId ? accounts.find((a) => a.id === accountFilterId)?.accountName || null : null;

  const totalIncome = filteredTransactions.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredTransactions.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
  const monthlyNet = totalIncome - totalExpense;
  const totalBalance = accounts.reduce((s, a) => s + a.currentBalance, 0);

  const sanitizeCsvField = (v: string | number): string => {
    const s = String(v);
    if (/^[=+\-@\t\r]/.test(s)) return `"'${s.replace(/"/g, '""')}"`;
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const downloadReport = () => {
    const csv = [['Date','Type','Amount','Category','Description','From/To','Method','Details','Account'],
      ...filteredTransactions.map((t) => [format(new Date(t.transactionDate), 'dd/MM/yyyy HH:mm'), t.type, t.amount, t.category||'', t.description||'', t.senderReceiver||'', t.paymentMethod, t.paymentDetails||'', t.account.accountName]),
    ].map((r) => r.map(sanitizeCsvField).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `expense-report-${format(selectedDate, 'yyyy-MM')}.csv`; a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wallet className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Expense Tracker</h1>
                <p className="text-xs text-gray-500">Financial Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Balance (All Accounts)</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{totalBalance.toFixed(2)}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                  {username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700">{username}</span>
              </div>
              <button onClick={logout} className="cursor-pointer flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm">
                <LogOut size={16} /><span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Month Navigator — no future */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => { setSelectedDate(subMonths(selectedDate, 1)); setAccountFilterId(null); }} className="cursor-pointer flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm text-gray-700">
            <ChevronLeft size={18} /> Prev
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{format(selectedDate, 'MMMM yyyy')}</h2>
            <p className="text-sm text-gray-500">{isCurrentMonth ? 'Current Month' : 'Past Month'}</p>
          </div>
          {canGoNext ? (
            <button onClick={() => { setSelectedDate(addMonths(selectedDate, 1)); setAccountFilterId(null); }} className="cursor-pointer flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm text-gray-700">
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-300 select-none">Latest</div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium text-gray-500 mb-1">Month Income</p><p className="text-2xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</p></div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><TrendingUp className="text-green-600" size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium text-gray-500 mb-1">Month Expenses</p><p className="text-2xl font-bold text-red-600">₹{totalExpense.toFixed(2)}</p></div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"><TrendingDown className="text-red-600" size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-medium text-gray-500 mb-1">Month Net</p><p className={`text-2xl font-bold ${monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>{monthlyNet >= 0 ? '+' : ''}₹{monthlyNet.toFixed(2)}</p></div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${monthlyNet >= 0 ? 'bg-green-100' : 'bg-red-100'}`}><Wallet className={monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'} size={24} /></div>
            </div>
          </div>
        </div>

        <AccountsSection accounts={accounts} totalBalance={totalBalance} activeAccountId={accountFilterId} onAdd={() => setShowAddAccount(true)} onEdit={setEditingAccount} onDelete={setDeletingAccount} onFilter={setAccountFilterId} />

        <TransactionsSection transactions={filteredTransactions} selectedDate={selectedDate} totalIncome={totalIncome} totalExpense={totalExpense} monthlyNet={monthlyNet}
          hasAccounts={accounts.length > 0} isCurrentMonth={isCurrentMonth} isPastMonth={!isCurrentMonth}
          accountFilter={accountFilterName} onClearAccountFilter={() => setAccountFilterId(null)}
          onAdd={() => setShowAddTransaction(true)} onEdit={setEditingTransaction} onDelete={setDeletingTransaction} onDownload={downloadReport} />
      </div>

      {showAddAccount && <AddAccountModal onClose={() => { setShowAddAccount(false); refresh(); }} />}
      {editingAccount && <EditAccountModal account={editingAccount} onClose={() => { setEditingAccount(null); refresh(); }} />}
      {deletingAccount && <ConfirmModal title="Delete Account" message={`Delete "${deletingAccount.accountName}"? This cannot be undone. Accounts with transactions cannot be deleted.`} onConfirm={handleDeleteAccount} onCancel={() => setDeletingAccount(null)} />}
      {showAddTransaction && <AddTransactionModal accounts={accounts} onClose={() => { setShowAddTransaction(false); refresh(); }} />}
      {editingTransaction && <EditTransactionModal accounts={accounts} transaction={editingTransaction} onClose={() => { setEditingTransaction(null); refresh(); }} />}
      {deletingTransaction && <ConfirmModal title="Delete Transaction" message={`Delete this ₹${deletingTransaction.amount.toFixed(2)} ${deletingTransaction.type.toLowerCase()} transaction? The account balance will be reversed.`} onConfirm={handleDeleteTransaction} onCancel={() => setDeletingTransaction(null)} />}
    </div>
  );
};

export default Dashboard;
