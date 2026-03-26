import React, { useState, useEffect } from 'react';
import { transactionApi } from '../api/client';
import type { Account, Transaction } from '../types/index';
import { format } from 'date-fns';
import ModalWrapper from './ModalWrapper';
import { getErrorMessage } from '../utils/errorMessages';
import { INPUT_CLASS } from '../utils/styles';

type FormData = {
  accountId: number; type: 'INCOME' | 'EXPENSE'; amount: string; transactionDate: string;
  category: string; description: string; senderReceiver: string;
  paymentMethod: 'UPI' | 'CARD' | 'CASH' | 'BANK_TRANSFER' | 'OTHER'; paymentDetails: string;
};

const TransactionForm: React.FC<{ accounts: Account[]; formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>>; onSubmit: (e: React.FormEvent) => void; onClose: () => void; submitLabel: string; loading: boolean; error: string }> = ({ accounts, formData, setFormData, onSubmit, onClose, submitLabel, loading, error }) => {
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => { transactionApi.getCategories().then((r) => setCategories(r.data)).catch(() => {}); }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Account</label>
          <select value={formData.accountId} onChange={(e) => setFormData({ ...formData, accountId: parseInt(e.target.value) })} className={INPUT_CLASS} required disabled={loading}>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.accountName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'INCOME' | 'EXPENSE' })} className={INPUT_CLASS} required disabled={loading}>
            <option value="INCOME">Credit (Income)</option><option value="EXPENSE">Debit (Expense)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input type="number" step="0.01" min="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 hover:bg-white disabled:opacity-50" placeholder="0.00" required disabled={loading} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time</label>
          <input type="datetime-local" value={formData.transactionDate} onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })} className={INPUT_CLASS} required disabled={loading} max={format(new Date(), "yyyy-MM-dd'T'HH:mm")} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category / Tag</label>
          <input type="text" list="category-suggestions" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={INPUT_CLASS} placeholder="Food, Salary, Rent, etc." disabled={loading} maxLength={100} />
          <datalist id="category-suggestions">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sender / Receiver</label>
          <input type="text" value={formData.senderReceiver} onChange={(e) => setFormData({ ...formData, senderReceiver: e.target.value })} className={INPUT_CLASS} placeholder="Person or company" disabled={loading} maxLength={200} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`${INPUT_CLASS} resize-none`} rows={2} placeholder="Why was this spent?" disabled={loading} maxLength={500} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
          <select value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as FormData['paymentMethod'] })} className={INPUT_CLASS} required disabled={loading}>
            <option value="UPI">UPI</option><option value="CARD">Card</option><option value="CASH">Cash</option><option value="BANK_TRANSFER">Bank Transfer</option><option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Details</label>
          <input type="text" value={formData.paymentDetails} onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })} className={INPUT_CLASS} placeholder="UPI ID, Card name, etc." disabled={loading} maxLength={200} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button type="button" onClick={onClose} disabled={loading} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold">Cancel</button>
      </div>
    </form>
  );
};

export const AddTransactionModal: React.FC<{ accounts: Account[]; selectedDate: Date; onClose: () => void }> = ({ accounts, selectedDate, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const now = new Date();
  const defaultDate = selectedDate.getMonth() === now.getMonth() && selectedDate.getFullYear() === now.getFullYear()
    ? now
    : new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1, 12, 0);
  const [formData, setFormData] = useState<FormData>({
    accountId: accounts[0]?.id || 0, type: 'EXPENSE', amount: '',
    transactionDate: format(defaultDate, "yyyy-MM-dd'T'HH:mm"),
    category: '', description: '', senderReceiver: '', paymentMethod: 'UPI', paymentDetails: '',
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (loading) return; setLoading(true); setError('');
    try { await transactionApi.create({ ...formData, amount: parseFloat(formData.amount) || 0, transactionDate: new Date(formData.transactionDate).toISOString() }); onClose(); }
    catch (err) { setError(getErrorMessage(err)); setLoading(false); }
  };
  return (
    <ModalWrapper onClose={onClose} wide title="Add New Transaction">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Transaction</h2>
      <TransactionForm accounts={accounts} formData={formData} setFormData={setFormData} onSubmit={handleSubmit} onClose={onClose} submitLabel="Add Transaction" loading={loading} error={error} />
    </ModalWrapper>
  );
};

export const EditTransactionModal: React.FC<{ accounts: Account[]; transaction: Transaction; onClose: () => void }> = ({ accounts, transaction, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    accountId: transaction.account.id, type: transaction.type, amount: String(transaction.amount),
    transactionDate: format(new Date(transaction.transactionDate), "yyyy-MM-dd'T'HH:mm"),
    category: transaction.category || '', description: transaction.description || '',
    senderReceiver: transaction.senderReceiver || '', paymentMethod: transaction.paymentMethod, paymentDetails: transaction.paymentDetails || '',
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (loading) return; setLoading(true); setError('');
    try { await transactionApi.update(transaction.id, { ...formData, amount: parseFloat(formData.amount) || 0, transactionDate: new Date(formData.transactionDate).toISOString() }); onClose(); }
    catch (err) { setError(getErrorMessage(err)); setLoading(false); }
  };
  return (
    <ModalWrapper onClose={onClose} wide title="Edit Transaction">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Transaction</h2>
      <TransactionForm accounts={accounts} formData={formData} setFormData={setFormData} onSubmit={handleSubmit} onClose={onClose} submitLabel="Save Changes" loading={loading} error={error} />
    </ModalWrapper>
  );
};
