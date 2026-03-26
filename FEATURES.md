# Expense Tracker — User Guide

A personal finance app to track your income, expenses, and bank account balances.

---

## Getting Started

### Creating Your Account

1. Open `http://localhost:5173` in your browser.
2. Click "Sign Up" at the bottom of the login screen.
3. Enter your full name, choose a username (letters, numbers, underscores, 3-30 chars), and set a password (min 6 characters).
4. Click "Sign Up" — you're logged in and taken to the dashboard.

### Logging In

Enter your username and password on the login screen and click "Sign In".

### Session & Logging Out

- You stay logged in for 24 hours. After that, you're automatically signed out.
- To log out manually, click "Logout" in the top-right corner.

---

## The Dashboard

### Header

- Shows your total balance across all accounts (or historical balance when viewing past months).
- Displays today's full date (e.g., "26 March 2026") for the current month, or just "February 2026" for past months.

### Summary Cards

Three cards showing the selected month's totals:
- **Month Income** — total credits
- **Month Expenses** — total debits
- **Month Net** — income minus expenses (green if positive, red if negative)

All financial calculations use integer-cent math to avoid floating-point rounding errors.

### Month Navigator

Use Prev/Next buttons to browse months. You cannot go past the current month.

---

## Managing Accounts

### Adding an Account

1. Click "Add Account" in the Accounts section.
2. Fill in:
   - **Account Name** (required) — e.g., "HDFC Savings", "Cash Wallet"
   - **Account Number** (optional) — for your reference
   - **Opening Balance** (required) — starting amount (≥ 0, max ₹99,999,999.99, max 2 decimal places)
3. Click "Add Account".

You can't have two accounts with the same name. HTML tags in names are automatically stripped.

### Editing an Account

Hover over (or tap on mobile) an account card — pencil icon appears. Click it to edit the name or account number. The balance is shown read-only — it's calculated from transactions. Renaming to an existing account name is blocked.

### Deleting an Account

Hover over an account card — trash icon appears. Click it and confirm. You cannot delete an account that has transactions.

### Filtering by Account

Click any account card to filter transactions to just that account. Click again to clear the filter.

### Historical Balances

When viewing a past month, account cards show the balance as of that month's end — not the current live balance. Accounts that didn't exist yet in a past month are hidden.

---

## Recording Transactions

### Adding a Transaction

1. Click "Add" in the transactions section (disabled if you have no accounts).
2. Fill in:
   - **Account** — which account this belongs to
   - **Type** — Credit (Income) or Debit (Expense)
   - **Amount** — must be > 0, max ₹99,999,999.99, max 2 decimal places. For expenses, cannot exceed account balance.
   - **Date & Time** — defaults to now (current month) or 1st of the month (past months). Cannot be in the future.
   - **Category / Tag** — optional. Previously used categories are suggested.
   - **Sender / Receiver** — optional
   - **Payment Method** — UPI, Card, Cash, Bank Transfer, or Other
   - **Payment Details** — optional (UPI ID, card name, etc.)
   - **Description** — optional notes
3. Click "Add Transaction".

All text fields are sanitized — HTML tags are automatically stripped.

### Overdraft Protection

- You cannot create an expense that exceeds the account's current balance.
- Deleting an income transaction is blocked if it would make the balance go negative.
- The app shows the exact available balance in the error message.

### Editing a Transaction

Hover over a transaction row — pencil icon appears. You can change any field, including moving it to a different account. Both account balances are recalculated. If two people edit the same transaction simultaneously, the second save gets a conflict error (optimistic locking).

### Deleting a Transaction

Hover over a transaction row — trash icon appears. Confirm in the dialog.

---

## Viewing Transactions

### Sorting

Click column headers to sort: Date, Amount, Category, Account. Click again to reverse. Arrow shows direction.

### View Modes

- **All** — full table with all columns
- **By Category** — grouped by category with income/expense totals per group. Click a category to expand.

### Account Filtering

Click an account card to filter. A blue chip shows the active filter. Click X to clear.

---

## Exporting Reports

1. Navigate to the desired month.
2. Click the green "Export" button.
3. CSV downloads with columns: Date, Type, Amount, Category, Description, From/To, Method, Details, Account.
4. Filename includes the account name when filtered (e.g., `expense-report-2026-02-HDFC_Savings.csv`).

---

## Notifications

Toast messages appear in the bottom-right:
- **Green** — success
- **Red** — error
- **Blue** — info

Auto-dismiss after 4 seconds, or click X.

---

## Error Messages

| Situation | Message |
|-----------|---------|
| Wrong password | "Wrong username or password. Please try again." |
| Username taken | "This username is already taken. Try a different one." |
| Delete account with transactions | "This account has transactions. Delete or move them first." |
| Duplicate account name | "You already have an account with this name." |
| Overspending | "Insufficient balance. Available: ₹X" |
| Delete income causing negative balance | "Cannot delete this income. Account balance would go negative" |
| Future date | "Transaction date cannot be in the future" |
| Amount too large | "Amount cannot exceed ₹99,999,999.99" |
| Too many decimals | "Amount must have at most 2 decimal places" |
| Concurrent edit conflict | "This record was modified by another request. Please refresh and try again." |
| Missing query parameter | "Missing required parameter: start" |
| Session expired | "Your session has expired. Please sign in again." |
| Server down | "Unable to connect to the server. Please check your internet connection." |

---

## Keyboard Shortcuts

| Key | Where | Action |
|-----|-------|--------|
| Escape | Any modal | Close |
| Enter/Space | Account card | Toggle filter |
| Tab | Modals | Navigate between fields |

---

## Tips

- **Create accounts first** — you can't add transactions without one.
- **Use categories consistently** — the app suggests previously used categories.
- **Check net savings** — the Net figure tells you if you saved or overspent.
- **Use category view** — quickly see where most money goes.
- **Export monthly** — download CSV at month end for backup.
- **Move transactions** — edit a transaction to change its account if you picked the wrong one.
- **Run as JAR** — `java -jar target/expense-tracker-1.0.0.jar` uses half the memory of `mvnw spring-boot:run`.
