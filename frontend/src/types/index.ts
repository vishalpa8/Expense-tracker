export interface User {
  username: string;
}

export interface Account {
  id: number;
  accountName: string;
  accountNumber?: string;
  openingBalance: number;
  currentBalance: number;
  createdAt: string;
}

export interface Transaction {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  transactionDate: string;
  category?: string;
  description?: string;
  senderReceiver?: string;
  paymentMethod: 'UPI' | 'CARD' | 'CASH' | 'BANK_TRANSFER' | 'OTHER';
  paymentDetails?: string;
  account: Account;
}

export interface TransactionRequest {
  accountId: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  transactionDate: string;
  category?: string;
  description?: string;
  senderReceiver?: string;
  paymentMethod: 'UPI' | 'CARD' | 'CASH' | 'BANK_TRANSFER' | 'OTHER';
  paymentDetails?: string;
}
