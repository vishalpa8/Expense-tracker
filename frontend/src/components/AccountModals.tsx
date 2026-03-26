import React, { useState } from 'react';
import { accountApi } from '../api/client';
import type { Account } from '../types/index';
import ModalWrapper from './ModalWrapper';
import { getErrorMessage } from '../utils/errorMessages';
import { INPUT_CLASS } from '../utils/styles';

export const AddAccountModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (loading) return; setLoading(true); setError('');
    try {
      await accountApi.create({ accountName, accountNumber: accountNumber || undefined, openingBalance: parseFloat(balance) || 0 });
      onClose();
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

export const EditAccountModal: React.FC<{ account: Account; onClose: () => void }> = ({ account, onClose }) => {
  const [accountName, setAccountName] = useState(account.accountName);
  const [accountNumber, setAccountNumber] = useState(account.accountNumber || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (loading) return; setLoading(true); setError('');
    try {
      await accountApi.update(account.id, { accountName, accountNumber: accountNumber || undefined });
      onClose();
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
        </div>
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
