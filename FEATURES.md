# Expense Tracker — User Guide

A personal finance app to track your income, expenses, and bank account balances all in one place.

---

## Getting Started

### How to Access the App

1. Open your browser and go to `http://localhost:5173` — this is the main app.
2. The backend runs at `http://localhost:8080` — you don't need to open this directly.

### Creating Your Account

1. On the login screen, click "Sign Up" at the bottom.
2. Enter your full name, choose a username, and set a password (minimum 6 characters).
3. Click "Sign Up" — you'll be logged in automatically and taken to the dashboard.

If the username you chose is already taken, you'll see a message asking you to pick a different one.

### Logging In

If you already have an account, enter your username and password on the login screen and click "Sign In".

A demo account is available out of the box:
- Username: `admin`
- Password: `admin123`

### Session & Logging Out

- You stay logged in for 24 hours. After that, you're automatically signed out with a message explaining why.
- To log out manually, click the "Logout" button in the top-right corner of the dashboard.

---

## The Dashboard

After logging in, you land on the dashboard. This is your home screen and has three main sections:

### Summary Cards (Top)

Three cards at the top give you a quick snapshot:

- **Total Balance** — the combined current balance across all your accounts.
- **Total Income** — total money received in the selected month.
- **Total Expenses** — total money spent in the selected month.
- **Net** — shown at the bottom of the transactions section. This is income minus expenses for the month, so you can see if you saved or overspent.

---

## Managing Accounts

Accounts represent your bank accounts, wallets, UPI apps, or any place you keep money. You need at least one account before you can record transactions.

### Adding an Account

1. In the "Accounts" section, click "Add Account".
2. Fill in:
   - **Account Name** (required) — e.g., "HDFC Savings", "Cash Wallet", "Paytm".
   - **Account Number** (optional) — for your own reference.
   - **Opening Balance** (required) — how much money is currently in this account.
3. Click "Add Account".

Note: You can't have two accounts with the same name.

### Editing an Account

1. Hover over an account card — a pencil icon appears in the top-right corner.
2. Click the pencil icon.
3. Update the name, account number, or balance.
4. Click "Save Changes".

### Deleting an Account

1. Hover over an account card — a trash icon appears in the top-right corner.
2. Click the trash icon.
3. A confirmation dialog appears — click "Delete" to confirm, or "Cancel" to go back.

Important: You cannot delete an account that has transactions. You must delete all its transactions first, or move them to another account by editing them.

### Filtering by Account

Click on any account card to filter the transactions table to show only that account's transactions. The card gets a blue border and a "Filtered" label when active. Click it again (or click the "X" on the filter chip above the table) to clear the filter.

---

## Recording Transactions

Every time money comes in or goes out, record it as a transaction.

### Adding a Transaction

1. Click the "Add" button in the transactions section.
   - This button is disabled if you have no accounts yet.
2. Fill in the form:
   - **Account** (required) — which account this transaction belongs to.
   - **Type** (required):
     - **Credit (Income)** — money coming in (salary, refund, gift, etc.)
     - **Debit (Expense)** — money going out (food, rent, shopping, etc.)
   - **Amount** (required) — the amount in ₹. Must be greater than zero.
   - **Date & Time** (required) — when it happened. Defaults to right now.
   - **Category / Tag** (optional) — label it: Food, Transport, Salary, Rent, Shopping, etc. As you type, previously used categories are suggested so you can stay consistent.
   - **Sender / Receiver** (optional) — who you paid or who paid you.
   - **Payment Method** (required) — how the payment was made:
     - UPI
     - Card
     - Cash
     - Bank Transfer
     - Other
   - **Payment Details** (optional) — extra info like a UPI ID, card name, or reference number.
   - **Description** (optional) — any notes about this transaction.
3. Click "Add Transaction".

When you add a transaction, the account balance is automatically recalculated based on all transactions for that account.

### Editing a Transaction

1. Hover over any transaction row — a pencil icon appears on the right.
2. Click it to open the edit form.
3. You can change any field, including moving the transaction to a different account.
4. Click "Save Changes".

Both the old and new account balances are recalculated automatically.

### Deleting a Transaction

1. Hover over a transaction row — a trash icon appears on the right.
2. Click it, then confirm in the dialog.

Note: You can only delete transactions from the current month. For past months, the delete button is hidden and you'll see a "Past (delete disabled)" label. You can still edit past transactions.

---

## Viewing Transactions

### Monthly Navigation

Use the month picker at the top of the transactions section to browse different months. The summary cards and transaction list update to show data for the selected month.

### Sorting

In the "All" view, click on any column header to sort:
- **Date** — newest first or oldest first
- **Amount** — highest first or lowest first
- **Category** — alphabetical
- **Account** — alphabetical

Click the same header again to reverse the sort order. An arrow (↑ or ↓) shows the current direction.

### View Modes

Switch between two views using the tabs above the transaction list:

- **All** — a full table showing every transaction with all details in columns. Best for reviewing individual entries.
- **By Category** — groups transactions by their category (Food, Salary, Rent, etc.). Each group shows the total income and expense for that category. Click a category to expand and see its individual transactions. Transactions without a category appear under "Uncategorized".

### Account Filtering

Click any account card to filter transactions to just that account. A blue chip appears above the table showing which account is filtered. Click the "X" on the chip to clear the filter.

---

## Exporting Reports

Download your transactions as a CSV spreadsheet file.

### How to Export

1. Navigate to the month you want.
2. Click the green "Export" button (only visible when there are transactions).
3. A file downloads automatically.

### What's in the File

- Filename: `expense-report-YYYY-MM-DD.csv`
- Columns: Date, Type, Amount, Category, Description, Sender/Receiver, Payment Method, Account
- Opens in Excel, Google Sheets, Numbers, or any spreadsheet app.

---

## Notifications

The app shows small popup messages (toasts) in the bottom-right corner to confirm actions or report errors:

- **Green** — success (e.g., "Account created", "Transaction saved")
- **Red** — error (e.g., "Cannot delete account with existing transactions")
- **Blue** — informational

These disappear automatically after a few seconds, or you can dismiss them by clicking the X.

---

## Error Messages

The app shows clear, human-readable error messages instead of technical jargon:

| What happened | What you'll see |
|---|---|
| Wrong username or password | "Wrong username or password. Please try again." |
| Username taken during registration | "This username is already taken. Try a different one." |
| Trying to delete an account with transactions | "This account has transactions. Delete or move them first." |
| Duplicate account name | "You already have an account with this name." |
| Session expired | "Your session has expired. Please sign in again." |
| Server unreachable | "Unable to connect to the server. Please check your internet connection." |
| Missing required fields | A specific message telling you which field needs attention |

---

## Keyboard Shortcuts

| Key | Where | What it does |
|---|---|---|
| Escape | Any popup/modal | Closes the popup |
| Enter | Delete confirmation dialog | Confirms the deletion |
| Escape | Delete confirmation dialog | Cancels the deletion |

All modals also close if you click outside them (on the dark background).

---

## Quick Reference

| What you want to do | How to do it |
|---|---|
| Create a new user account | Click "Sign Up" on the login page |
| Sign in | Enter username and password on the login page |
| See your financial overview | Check the summary cards at the top of the dashboard |
| Add a bank account or wallet | Click "Add Account" in the Accounts section |
| Edit an account | Hover over the account card, click the pencil icon |
| Delete an account | Hover over the account card, click the trash icon |
| Record money coming in | Add a transaction with type "Credit (Income)" |
| Record money going out | Add a transaction with type "Debit (Expense)" |
| Edit a transaction | Hover over the row, click the pencil icon |
| Delete a transaction | Hover over the row, click the trash icon (current month only) |
| View a specific month | Use the month picker above the transactions table |
| Sort transactions | Click a column header (Date, Amount, Category, Account) |
| Group by category | Switch to "By Category" view tab |
| Filter by account | Click an account card |
| Clear account filter | Click the "X" on the blue filter chip |
| Download a report | Click the green "Export" button |
| Sign out | Click "Logout" in the top-right corner |

---

## Tips

- **Create accounts first** — you can't add transactions until you have at least one account.
- **Use categories consistently** — the app auto-suggests categories you've used before, so pick a naming convention and stick with it (e.g., always "Food" not sometimes "Food" and sometimes "Groceries").
- **Categories are auto-capitalized** — if you type "food", it becomes "Food" automatically.
- **Check net savings** — the "Net" figure at the bottom of the transactions section tells you if you saved or overspent that month.
- **Use the category view** — switch to "By Category" to quickly see where most of your money is going.
- **Export monthly** — download a CSV at the end of each month to keep a backup of your financial records.
- **Move transactions between accounts** — if you recorded a transaction under the wrong account, just edit it and change the account. Both balances update automatically.
