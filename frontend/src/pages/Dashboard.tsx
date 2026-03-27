import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountApi, transactionApi, authApi } from '../api/client';
import type { Account, Transaction } from '../types/index';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isSameMonth, isBefore } from 'date-fns';
import { LogOut, TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { AddAccountModal, EditAccountModal } from '../components/AccountModals';
import { AddTransactionModal, EditTransactionModal } from '../components/TransactionModals';
import TransactionsSection from '../components/TransactionsSection';
import AccountsSection from '../components/AccountsSection';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/errorMessages';

const Dashboard: React.FC = () => {
  const { username, fullName, logout } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthBalances, setMonthBalances] = useState<Record<number, number>>({});
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = sessionStorage.getItem('selectedMonth');
    return saved ? new Date(saved) : new Date();
  });
  const updateSelectedDate = (date: Date) => {
    sessionStorage.setItem('selectedMonth', date.toISOString());
    setSelectedDate(date);
  };
  const [loading, setLoading] = useState(true);

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [accountFilterId, setAccountFilterId] = useState<number | null>(null);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const { showToast } = useToast();

  const loadAccounts = useCallback(async () => {
    try { setAccounts((await accountApi.getAll()).data); } catch (e) { showToast(getErrorMessage(e), 'error'); }
  }, [showToast]);

  const loadTransactions = useCallback(async () => {
    try {
      const start = format(startOfMonth(selectedDate), "yyyy-MM-dd'T'HH:mm:ss");
      const end = format(endOfMonth(selectedDate), "yyyy-MM-dd'T'HH:mm:ss");
      const [txnRes, balRes] = await Promise.all([
        transactionApi.getByDateRange(start, end),
        accountApi.getBalancesAt(end),
      ]);
      setTransactions(txnRes.data);
      const balMap: Record<number, number> = {};
      for (const [id, val] of Object.entries(balRes.data)) {
        balMap[Number(id)] = val.balance;
      }
      setMonthBalances(balMap);
    } catch (e) { showToast(getErrorMessage(e), 'error'); }
  }, [selectedDate, showToast]);

  const refresh = useCallback(async () => {
    await Promise.all([loadAccounts(), loadTransactions()]);
  }, [loadAccounts, loadTransactions]);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const now = new Date();
  const isCurrentMonth = isSameMonth(selectedDate, now);
  const isPastMonth = isBefore(startOfMonth(selectedDate), startOfMonth(now));
  const canGoNext = !isCurrentMonth && isBefore(startOfMonth(selectedDate), startOfMonth(now));

  const handleDeleteAccount = async () => {
    if (!deletingAccount) return;
    try {
      await accountApi.delete(deletingAccount.id);
      if (accountFilterId === deletingAccount.id) setAccountFilterId(null);
      setDeletingAccount(null);
      showToast(`"${deletingAccount.accountName}" deleted successfully`, 'success');
      await refresh();
    } catch (e) { showToast(getErrorMessage(e), 'error'); setDeletingAccount(null); }
  };
  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return;
    try {
      await transactionApi.delete(deletingTransaction.id);
      setDeletingTransaction(null);
      showToast('Transaction deleted successfully', 'success');
      await refresh();
    } catch (e) { showToast(getErrorMessage(e), 'error'); setDeletingTransaction(null); }
  };
  const handleDeleteUser = async () => {
    try {
      await authApi.deleteAccount();
      logout();
    } catch (e) { showToast(getErrorMessage(e), 'error'); setShowDeleteUser(false); }
  };

  const filteredTransactions = accountFilterId
    ? transactions.filter((t) => t.account.id === accountFilterId)
    : transactions;
  const accountFilterName = accountFilterId ? accounts.find((a) => a.id === accountFilterId)?.accountName || null : null;

  // Only show accounts that existed by the end of the selected month
  const monthEnd = endOfMonth(selectedDate);
  const visibleAccounts = accounts.filter(a => new Date(a.createdAt) <= monthEnd);

  const totalIncome = filteredTransactions.filter((t) => t.type === 'INCOME').reduce((s, t) => s + Math.round(t.amount * 100), 0) / 100;
  const totalExpense = filteredTransactions.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + Math.round(t.amount * 100), 0) / 100;
  const monthlyNet = Math.round((totalIncome - totalExpense) * 100) / 100;
  const totalBalance = visibleAccounts.reduce((s, a) => s + Math.round((monthBalances[a.id] ?? a.currentBalance) * 100), 0) / 100;

  const accountsWithMonthBalance = visibleAccounts.map(a => ({
    ...a,
    currentBalance: monthBalances[a.id] ?? a.currentBalance,
  }));

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
    const suffix = accountFilterName ? `-${accountFilterName.replace(/\s+/g, '_')}` : '';
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url;
    a.download = `expense-report-${format(selectedDate, 'yyyy-MM')}${suffix}.csv`; a.click();
    URL.revokeObjectURL(url);
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
                <p className="text-xs text-gray-500">{isCurrentMonth ? 'Total Balance (All Accounts)' : `Balance as of ${format(endOfMonth(selectedDate), 'MMM yyyy')}`}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{totalBalance.toFixed(2)}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                  {fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700">{fullName?.split(' ')[0] || username}</span>
              </div>
              <button onClick={logout} className="cursor-pointer flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm">
                <LogOut size={16} /><span className="hidden sm:inline">Logout</span>
              </button>
              <button onClick={() => setShowDeleteUser(true)} className="cursor-pointer flex items-center gap-1 px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm" title="Delete Account">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => { updateSelectedDate(subMonths(selectedDate, 1)); setAccountFilterId(null); }} className="cursor-pointer flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm text-gray-700">
            <ChevronLeft size={18} /> Prev
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{isCurrentMonth ? format(now, 'dd MMMM yyyy') : format(selectedDate, 'MMMM yyyy')}</h2>
            <p className="text-sm text-gray-500">{isCurrentMonth ? 'Current Month' : <button onClick={() => { updateSelectedDate(new Date()); setAccountFilterId(null); }} className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">↩ Go to Current Month</button>}</p>
          </div>
          {canGoNext ? (
            <button onClick={() => { updateSelectedDate(addMonths(selectedDate, 1)); setAccountFilterId(null); }} className="cursor-pointer flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-sm text-gray-700">
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-300 select-none">Latest</div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <span className="ml-3 text-gray-500 font-medium">Loading...</span>
          </div>
        ) : (
          <>
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

            <AccountsSection accounts={accountsWithMonthBalance} totalBalance={totalBalance} activeAccountId={accountFilterId} onAdd={() => setShowAddAccount(true)} onEdit={setEditingAccount} onDelete={setDeletingAccount} onFilter={setAccountFilterId} />

            <TransactionsSection transactions={filteredTransactions} selectedDate={selectedDate} totalIncome={totalIncome} totalExpense={totalExpense} monthlyNet={monthlyNet}
              hasAccounts={visibleAccounts.length > 0} isPastMonth={isPastMonth}
              accountFilter={accountFilterName} onClearAccountFilter={() => setAccountFilterId(null)}
              onAdd={() => setShowAddTransaction(true)} onEdit={setEditingTransaction} onDelete={setDeletingTransaction} onDownload={downloadReport} />
          </>
        )}
      </div>

      {showAddAccount && <AddAccountModal onClose={() => setShowAddAccount(false)} onSuccess={refresh} selectedDate={selectedDate} />}
      {editingAccount && <EditAccountModal account={editingAccount} onClose={() => setEditingAccount(null)} onSuccess={refresh} selectedDate={selectedDate} />}
      {deletingAccount && <ConfirmModal title="Delete Account" message={`Delete "${deletingAccount.accountName}"? This cannot be undone. Accounts with transactions cannot be deleted.`} onConfirm={handleDeleteAccount} onCancel={() => setDeletingAccount(null)} />}
      {showAddTransaction && <AddTransactionModal accounts={accountsWithMonthBalance} selectedDate={selectedDate} onClose={() => setShowAddTransaction(false)} onSuccess={refresh} />}
      {editingTransaction && <EditTransactionModal accounts={accountsWithMonthBalance} transaction={editingTransaction} onClose={() => setEditingTransaction(null)} onSuccess={refresh} selectedDate={selectedDate} />}
      {deletingTransaction && <ConfirmModal title="Delete Transaction" message={`Delete this ₹${deletingTransaction.amount.toFixed(2)} ${deletingTransaction.type.toLowerCase()} transaction? The account balance will be reversed.`} onConfirm={handleDeleteTransaction} onCancel={() => setDeletingTransaction(null)} />}
      {showDeleteUser && <ConfirmModal title="Delete Your Account" message="This will permanently delete your user account, all bank accounts, and all transactions. This cannot be undone." confirmText={username || ''} onConfirm={handleDeleteUser} onCancel={() => setShowDeleteUser(false)} />}
    </div>
  );
};

export default Dashboard;
