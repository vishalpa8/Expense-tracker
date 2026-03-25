# Expense Tracker — User Guide

A personal finance app to track your income, expenses, and bank account balances all in one place.

---

## Getting Started

### How to Access the App

1. Open your browser and go to `http://localhost:5173` (frontend) — this is the main app you interact with.
2. The backend runs at `http://localhost:8080` — you don't need to open this directly.

### First-Time Login

A demo account is created automatically when the app starts for the first time:

- Username: `admin`
- Password: `admin123`

Enter these on the login screen and click "Sign In" to get started.

### Staying Logged In

Once you sign in, you stay logged in for 24 hours. After that, you'll be automatically signed out and taken back to the login screen. You can also sign out anytime by clicking the "Logout" button in the top-right corner.

---

## Features

### 1. Dashboard Overview

After logging in, you land on the dashboard. This is your main screen and shows everything at a glance:

- **Total Balance** — the combined balance across all your accounts.
- **Total Income** — how much money came in during the selected time period.
- **Total Expenses** — how much money went out during the selected time period.

These three cards update automatically whenever you change the time period or add new transactions.

---

### 2. Managing Accounts

Accounts represent your bank accounts, wallets, or any place you keep money. You need at least one account before you can start recording transactions.

#### Adding an Account

1. Scroll down to the "Accounts" section on the dashboard.
2. Click the "Add Account" button.
3. Fill in the details:
   - **Account Name** (required) — give it a name like "HDFC Savings", "Cash Wallet", or "Paytm".
   - **Account Number** (optional) — you can add your account number for reference.
   - **Opening Balance** (required) — the amount of money currently in this account.
4. Click "Add Account" to save.

#### Viewing Your Accounts

All your accounts appear as cards at the bottom of the dashboard. Each card shows:
- The account name
- The account number (if you added one)
- The current balance

The current balance updates automatically every time you add a transaction to that account.

---

### 3. Recording Transactions

Transactions are the core of the app — every time money comes in or goes out, you record it here.

#### Adding a Transaction

1. Click the "Add Transaction" button in the transactions section.
   - Note: This button is disabled if you haven't created any accounts yet.
2. Fill in the form:
   - **Account** (required) — pick which account this transaction belongs to.
   - **Type** (required) — choose "Income" if money came in, or "Expense" if money went out.
   - **Amount** (required) — the transaction amount in rupees (₹). Must be greater than zero.
   - **Date & Time** (required) — when the transaction happened. Defaults to right now.
   - **Category** (optional) — label it however you like: Food, Transport, Salary, Rent, Shopping, etc.
   - **Sender/Receiver** (optional) — who you paid or who paid you.
   - **Payment Method** (required) — how the payment was made. Options:
     - UPI
     - Card
     - Cash
     - Bank Transfer
     - Other
   - **Payment Details** (optional) — extra info like a UPI ID, card name, or reference number.
   - **Description** (optional) — any notes you want to add about this transaction.
3. Click "Add Transaction" to save.

#### What Happens When You Add a Transaction

- If you add an **Income** transaction, the account balance goes up by that amount.
- If you add an **Expense** transaction, the account balance goes down by that amount.
- The dashboard summary cards (Total Income, Total Expenses, Total Balance) all update immediately.

---

### 4. Viewing Transactions

The transactions table on the dashboard shows all your transactions for the selected time period.

#### Filtering by Time Period

Use the controls above the table to change what you see:

- **Period selector** — switch between "Daily" and "Monthly":
  - **Daily** — shows transactions for a single day. A date picker appears so you can pick the exact date.
  - **Monthly** — shows transactions for an entire month. A month picker appears so you can pick the month and year.

The table columns show:
- Date and time
- Type (Income or Expense, color-coded green and red)
- Amount in ₹
- Category
- Description
- Payment method

If there are no transactions for the selected period, you'll see a message saying "No transactions yet."

---

### 5. Exporting Reports (CSV Download)

You can download your transactions as a spreadsheet file to keep records offline or share with others.

#### How to Export

1. Select the time period you want (daily or monthly) using the filters.
2. Click the green "Export" button.
3. A CSV file downloads automatically to your computer.

#### What's in the File

The downloaded file is named `expense-report-YYYY-MM-DD.csv` and contains these columns:
- Date
- Type (Income or Expense)
- Amount
- Category
- Description
- Sender/Receiver
- Payment Method
- Account Name

You can open this file in Excel, Google Sheets, or any spreadsheet app.

---

### 6. User Account & Security

- **One user, private data** — each user can only see their own accounts and transactions. Nobody else can access your data.
- **Passwords are encrypted** — your password is never stored in plain text.
- **Automatic sign-out** — if your session expires (after 24 hours), you're safely logged out.
- **Logout** — click the "Logout" button in the top-right corner anytime to sign out manually.

---

## Quick Reference

| What you want to do | How to do it |
|---|---|
| Sign in | Go to the login page, enter username and password |
| See your overall finances | Check the three summary cards at the top of the dashboard |
| Add a bank account | Click "Add Account" in the Accounts section |
| Record money coming in | Add a transaction with type "Income" |
| Record money going out | Add a transaction with type "Expense" |
| See today's transactions | Set the period to "Daily" and pick today's date |
| See this month's transactions | Set the period to "Monthly" and pick the current month |
| Download a report | Click the green "Export" button after selecting your time period |
| Sign out | Click "Logout" in the top-right corner |

---

## Tips

- **Create accounts first** — you can't add transactions until you have at least one account.
- **Use categories consistently** — if you always label groceries as "Food", it's easier to track spending patterns in your exported reports.
- **Check your balances** — the account cards at the bottom always show the latest balance, so you can quickly see where your money is.
- **Export regularly** — download monthly reports to keep a backup of your financial records.
