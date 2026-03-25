import React, { useState } from 'react';
import { accountApi } from '../api/client';
import type { Account } from '../types/index';
import ModalWrapper from './ModalWrapper';
import { getErrorMessage } from '../utils/errorMessages';

export const AddAccountModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await accountApi.create({ accountName, accountNumber, openingBalance: parseFloat(balance) || 0 });
      onClose();
    } catch (err: any) { setError(getErrorMessage(err)); setLoading(false); }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Account</h2>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
      <AccountForm accountName={accountName} setAccountName={setAccountName} accountNumber={accountNumber} setAccountNumber={setAccountNumber}
        balance={balance} setBalance={setBalance} onSubmit={handleSubmit} onClose={onClose} submitLabel="Add Account" loading={loading} balanceLabel="Opening Balance" />
    </ModalWrapper>
  );
};

export const EditAccountModal: React.FC<{ account: Account; onClose: () => void }> = ({ account, onClose }) => {
  const [accountName, setAccountName] = useState(account.accountName);
  const [accountNumber, setAccountNumber] = useState(account.accountNumber || '');
  const [balance, setBalance] = useState(String(account.currentBalance));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await accountApi.update(account.id, { accountName, accountNumber, openingBalance: parseFloat(balance) || 0 });
      onClose();
    } catch (err: any) { setError(getErrorMessage(err)); setLoading(false); }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Account</h2>
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
      <AccountForm accountName={accountName} setAccountName={setAccountName} accountNumber={accountNumber} setAccountNumber={setAccountNumber}
        balance={balance} setBalance={setBalance} onSubmit={handleSubmit} onClose={onClose} submitLabel="Save Changes" loading={loading} balanceLabel="Current Balance" />
    </ModalWrapper>
  );
};

const IC = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white disabled:opacity-50";

const AccountForm: React.FC<{
  accountName: string; setAccountName: (v: string) => void;
  accountNumber: string; setAccountNumber: (v: string) => void;
  balance: string; setBalance: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void; onClose: () => void;
  submitLabel: string; loading: boolean; balanceLabel: string;
}> = ({ accountName, setAccountName, accountNumber, setAccountNumber, balance, setBalance, onSubmit, onClose, submitLabel, loading, balanceLabel }) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
      <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)}
        className={IC} placeholder="e.g., HDFC Savings" required disabled={loading} />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number (Optional)</label>
      <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)}
        className={IC} placeholder="e.g., XXXX-XXXX-1234" disabled={loading} />
    </div>
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{balanceLabel}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
        <input type="number" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)}
          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white disabled:opacity-50"
          placeholder="0.00" required disabled={loading} />
      </div>
    </div>
    <div className="flex gap-3 pt-2">
      <button type="submit" disabled={loading}
        className="cursor-pointer flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Saving...' : submitLabel}
      </button>
      <button type="button" onClick={onClose} disabled={loading} className="cursor-pointer flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold">Cancel</button>
    </div>
  </form>
);
