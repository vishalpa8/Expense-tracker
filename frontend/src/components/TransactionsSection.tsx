import React, { useState } from 'react';
import type { Transaction } from '../types/index';
import { format } from 'date-fns';
import { TrendingUp, Plus, Download, ArrowUpRight, ArrowDownLeft, Pencil, Trash2, LayoutList, Tag, X, ChevronDown, ChevronRight } from 'lucide-react';

type ViewMode = 'all' | 'category';
type SortKey = 'date' | 'amount' | 'category' | 'account';

interface Props {
  transactions: Transaction[];
  selectedDate: Date;
  totalIncome: number;
  totalExpense: number;
  monthlyNet: number;
  hasAccounts: boolean;
  isCurrentMonth: boolean;
  isPastMonth: boolean;
  accountFilter: string | null;
  onClearAccountFilter: () => void;
  onAdd: () => void;
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
  onDownload: () => void;
}

function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const m: Record<string, T[]> = {};
  arr.forEach((item) => { const k = keyFn(item); (m[k] ||= []).push(item); });
  return m;
}

const TransactionsSection: React.FC<Props> = ({ transactions, selectedDate, totalIncome, totalExpense, monthlyNet, hasAccounts, isCurrentMonth, isPastMonth, accountFilter, onClearAccountFilter, onAdd, onEdit, onDelete, onDownload }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  const sorted = [...transactions].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'date') cmp = new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
    else if (sortKey === 'amount') cmp = a.amount - b.amount;
    else if (sortKey === 'category') cmp = (a.category || '').localeCompare(b.category || '');
    else if (sortKey === 'account') cmp = a.account.accountName.localeCompare(b.account.accountName);
    return sortAsc ? cmp : -cmp;
  });

  const byCategory = Object.entries(groupBy(sorted, (t) => t.category || 'Uncategorized'))
    .map(([cat, txns]) => {
      const inc = txns.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
      const exp = txns.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
      return { cat, txns, income: inc, expense: exp, total: inc + exp };
    })
    .sort((a, b) => b.total - a.total);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };
  const sortIcon = (key: SortKey) => sortKey === key ? (sortAsc ? ' ↑' : ' ↓') : '';

  const toggleCat = (cat: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const txnCount = transactions.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Transactions</h2>
          <p className="text-sm text-gray-500">
            {format(selectedDate, 'MMMM yyyy')} — {txnCount} transaction{txnCount !== 1 ? 's' : ''}
            {isPastMonth && <span className="ml-2 text-amber-500 font-medium">· Past (delete disabled)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {txnCount > 0 && (
            <button onClick={onDownload} className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium text-sm shadow-sm">
              <Download size={16} /> Export
            </button>
          )}
          <button onClick={onAdd} disabled={!hasAccounts}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <Plus size={16} /> Add
            </button>
        </div>
      </div>

      {/* Active filter chip + view tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {([['all', LayoutList, 'All'], ['category', Tag, 'By Category']] as const).map(([mode, Icon, label]) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
        {accountFilter && (
          <button onClick={onClearAccountFilter}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100">
            Account: {accountFilter} <X size={14} />
          </button>
        )}
      </div>

      {txnCount === 0 ? (
        <div className="text-center py-10">
          <TrendingUp className="text-gray-300 mx-auto mb-3" size={40} />
          <p className="text-gray-500 font-medium">
            {accountFilter ? `No transactions for ${accountFilter} in ${format(selectedDate, 'MMMM yyyy')}` :
             `No transactions in ${format(selectedDate, 'MMMM yyyy')}`}
          </p>
        </div>
      ) : (
        <>
          {/* Category View */}
          {viewMode === 'category' && (
            <div className="space-y-2">
              {byCategory.map(({ cat, txns, income, expense }) => {
                const isOpen = expandedCats.has(cat);
                return (
                  <div key={cat} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => toggleCat(cat)} className="w-full bg-gray-50 px-4 py-3 flex justify-between items-center hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">
                        {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                        <Tag size={14} className="text-indigo-600" />
                        <span className="font-bold text-gray-900 text-sm">{cat}</span>
                        <span className="text-xs text-gray-400">({txns.length})</span>
                      </div>
                      <div className="flex gap-4 text-xs">
                        {income > 0 && <span className="text-green-600 font-bold">+₹{income.toFixed(2)}</span>}
                        {expense > 0 && <span className="text-red-600 font-bold">-₹{expense.toFixed(2)}</span>}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="divide-y divide-gray-50">
                        {txns.map((t) => <TxnRow key={t.id} t={t} isCurrentMonth={isCurrentMonth} onEdit={onEdit} onDelete={onDelete} />)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* All View */}
          {viewMode === 'all' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700" onClick={() => handleSort('date')}>Date{sortIcon('date')}</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700" onClick={() => handleSort('amount')}>Amount{sortIcon('amount')}</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700" onClick={() => handleSort('category')}>Category{sortIcon('category')}</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">From/To</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:text-gray-700" onClick={() => handleSort('account')}>Account{sortIcon('account')}</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sorted.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 group">
                      <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{format(new Date(t.transactionDate), 'dd MMM, HH:mm')}</td>
                      <td className="px-3 py-3"><TypeBadge type={t.type} /></td>
                      <td className={`px-3 py-3 font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toFixed(2)}</td>
                      <td className="px-3 py-3 text-gray-600">{t.category ? <CatBadge cat={t.category} /> : '-'}</td>
                      <td className="px-3 py-3 text-gray-600 max-w-[180px] truncate">{t.description || '-'}</td>
                      <td className="px-3 py-3 text-gray-600">{t.senderReceiver || '-'}</td>
                      <td className="px-3 py-3"><span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">{t.paymentMethod.replace('_', ' ')}</span></td>
                      <td className="px-3 py-3 text-gray-600 font-medium">{t.account.accountName}</td>
                      <td className="px-3 py-3"><Actions t={t} isCurrentMonth={isCurrentMonth} onEdit={onEdit} onDelete={onDelete} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer totals */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-6 text-sm">
            <div>Total Credits: <span className="font-bold text-green-600">₹{totalIncome.toFixed(2)}</span></div>
            <div>Total Debits: <span className="font-bold text-red-600">₹{totalExpense.toFixed(2)}</span></div>
            <div>Net: <span className={`font-bold ${monthlyNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>{monthlyNet >= 0 ? '+' : ''}₹{monthlyNet.toFixed(2)}</span></div>
          </div>
        </>
      )}
    </div>
  );
};

const TypeBadge: React.FC<{ type: 'INCOME' | 'EXPENSE' }> = ({ type }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
    {type === 'INCOME' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
    {type === 'INCOME' ? 'Credit' : 'Debit'}
  </span>
);

const CatBadge: React.FC<{ cat: string }> = ({ cat }) => (
  <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">{cat}</span>
);

const Actions: React.FC<{ t: Transaction; isCurrentMonth: boolean; onEdit: (t: Transaction) => void; onDelete: (t: Transaction) => void }> = ({ t, isCurrentMonth, onEdit, onDelete }) => (
  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
    <button onClick={() => onEdit(t)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Pencil size={14} /></button>
    {isCurrentMonth && <button onClick={() => onDelete(t)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} /></button>}
  </div>
);

const TxnRow: React.FC<{ t: Transaction; isCurrentMonth: boolean; onEdit: (t: Transaction) => void; onDelete: (t: Transaction) => void }> = ({ t, isCurrentMonth, onEdit, onDelete }) => (
  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 group">
    <div className="w-16 text-xs text-gray-500 shrink-0">{format(new Date(t.transactionDate), 'dd MMM')}</div>
    <TypeBadge type={t.type} />
    <div className={`w-24 text-sm font-bold shrink-0 ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
      {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toFixed(2)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm text-gray-700 truncate">{t.description || t.senderReceiver || '-'}</div>
      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
        <span>{t.paymentMethod.replace('_', ' ')}</span>
        {t.senderReceiver && t.description && <span>· {t.senderReceiver}</span>}
        <span>· {t.account.accountName}</span>
      </div>
    </div>
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
      <button onClick={() => onEdit(t)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
      {isCurrentMonth && <button onClick={() => onDelete(t)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>}
    </div>
  </div>
);

export default TransactionsSection;
