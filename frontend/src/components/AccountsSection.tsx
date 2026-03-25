import React from 'react';
import type { Account } from '../types/index';
import { Wallet, Pencil, Trash2, Plus } from 'lucide-react';

interface Props {
  accounts: Account[];
  totalBalance: number;
  activeAccountId: number | null;
  onAdd: () => void;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onFilter: (accountId: number | null) => void;
}

const AccountsSection: React.FC<Props> = ({ accounts, totalBalance, activeAccountId, onAdd, onEdit, onDelete, onFilter }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
    <div className="flex justify-between items-center mb-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Accounts</h2>
        <p className="text-sm text-gray-500">{accounts.length} account{accounts.length !== 1 ? 's' : ''} — Total: ₹{totalBalance.toFixed(2)}</p>
      </div>
      <button onClick={onAdd} className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium text-sm shadow-sm">
        <Plus size={16} /> Add Account
      </button>
    </div>
    {accounts.length === 0 ? (
      <div className="text-center py-10">
        <Wallet className="text-gray-300 mx-auto mb-3" size={40} />
        <p className="text-gray-500 font-medium">No accounts yet</p>
        <p className="text-sm text-gray-400 mt-1">Add your first account to start tracking</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const isActive = activeAccountId === acc.id;
          return (
            <div key={acc.id}
              onClick={() => onFilter(isActive ? null : acc.id)}
              className={`border rounded-2xl p-5 bg-gradient-to-br from-white to-gray-50 group cursor-pointer transition-all ${
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                  : 'border-gray-200 hover:shadow-md hover:border-blue-200'
              }`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-lg">{acc.accountName}</h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onEdit(acc)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => onDelete(acc)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">{acc.accountNumber || 'No account number'}</p>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                  <p className="text-2xl font-bold text-blue-600">₹{acc.currentBalance.toFixed(2)}</p>
                </div>
                {isActive && <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Filtered</span>}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default AccountsSection;
