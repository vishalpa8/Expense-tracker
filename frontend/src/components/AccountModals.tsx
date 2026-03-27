import React, { useState } from 'react';
import { accountApi } from '../api/client';
import type { Account } from '../types/index';
import ModalWrapper from './ModalWrapper';
import { getErrorMessage } from '../utils/errorMessages';
import { INPUT_CLASS } from '../utils/styles';

export const AddAccountModal: React.FC<{ onClose: () => void; onSuccess: () => void; selectedDate: Date }> = ({ onClose, onSuccess, selectedDate }) => {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const now = new Date();
  const isPastMonth = selectedDate.getMonth() !== now.getMonth() || selectedDate.getFullYear() !== now.getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (loading) return; setLoading(true); setError('');
    try {
      const data: { accountName: string; accountNumber?: string; openingBalance: number; createdAt?: string } = {
        accountName, accountNumber: accountNumber || undefined, openingBalance: parseFloat(balance) || 0,
      };
      if (isPastMonth) {
        data.createdAt = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-01T00:00:00`;
      }
      await accountApi.create(data);
      onClose();
      onSuccess();
    } catch (err) { setError(getErrorMessage(err)); setLoading(false); }
  };

  return (
    <ModalWrapper onClose={onClose} title="Add New Account">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Account</h2>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
          <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)}
            className={INPUT_CLASS} placeholder="e.g., HDFC Savings" required disabled={loading} maxLength={100} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number (Optional)</label>
          <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
            className={INPUT_CLASS} placeholder="e.g., XXXX-XXXX-1234" disabled={loading} maxLength={50} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Balance</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input type="number" step="0.01" min="0" value={balance} onChange={(e) => setBalance(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white disabled:opacity-50"
              placeholder="0.00" required disabled={loading} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="cursor-pointer flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Saving...' : 'Add Account'}
          </button>
          <button type="button" onClick={onClose} disabled={loading} className="cursor-pointer flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold">Cancel</button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export const EditAccountModal: React.FC<{ account: Account; onClose: () => void; onSuccess: () => void; selectedDate: Date }> = ({ account, onClose, onSuccess, selectedDate }) => {
  const [accountName, setAccountName] = useState(account.accountName);
  const [accountNumber, setAccountNumber] = useState(account.accountNumber || '');
  const [extendHistory, setExtendHistory] = useState(false);
  const [newOpeningBalance, setNewOpeningBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createdDate = new Date(account.createdAt);
  const prevMonth = new Date(createdDate.getFullYear(), createdDate.getMonth() - 1, 1);
  const prevMonthLabel = prevMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const prevMonthStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
  const canExtend = createdDate.getMonth() === selectedDate.getMonth() && createdDate.getFullYear() === selectedDate.getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (loading) return; setLoading(true); setError('');
    try {
      const data: { accountName: string; accountNumber?: string; createdAt?: string; openingBalance?: number } = {
        accountName, accountNumber: accountNumber || undefined,
      };
      if (extendHistory) {
        data.createdAt = `${prevMonthStr}-01T00:00:00`;
        data.openingBalance = parseFloat(newOpeningBalance) || 0;
      }
      await accountApi.update(account.id, data);
      onClose();
      onSuccess();
    } catch (err) { setError(getErrorMessage(err)); setLoading(false); }
  };

  return (
    <ModalWrapper onClose={onClose} title="Edit Account">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Account</h2>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
          <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)}
            className={INPUT_CLASS} placeholder="e.g., HDFC Savings" required disabled={loading} maxLength={100} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number (Optional)</label>
          <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
            className={INPUT_CLASS} placeholder="e.g., XXXX-XXXX-1234" disabled={loading} maxLength={50} />
        </div>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500">Current Balance</p>
          <p className="text-lg font-bold text-blue-600">₹{account.currentBalance.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Account since {createdDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
        </div>
        {canExtend && (
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={extendHistory} onChange={(e) => setExtendHistory(e.target.checked)} disabled={loading}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-semibold text-gray-700">Extend history to {prevMonthLabel}</span>
            </label>
          </div>
        )}
        {canExtend && extendHistory && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Opening Balance for {prevMonthLabel}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
              <input type="number" step="0.01" min="0" value={newOpeningBalance} onChange={(e) => setNewOpeningBalance(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white disabled:opacity-50"
                placeholder="0.00" required disabled={loading} />
            </div>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="cursor-pointer flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={onClose} disabled={loading} className="cursor-pointer flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold">Cancel</button>
        </div>
      </form>
    </ModalWrapper>
  );
};
