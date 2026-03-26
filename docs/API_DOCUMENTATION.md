# Expense Tracker API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

All endpoints except `/auth/*` require a JWT token:
```
Authorization: Bearer <token>
```

Tokens expire after 24 hours. On 401 response, the frontend automatically logs out via event dispatch (no hard page reload).

---

## Auth Endpoints

### Register
**POST** `/auth/register`

```json
{
  "username": "john_doe",
  "password": "secret123",
  "fullName": "John Doe"
}
```

Validation:
- `username`: 3-30 chars, alphanumeric + underscores only, must be unique
- `password`: 6-100 chars
- `fullName`: max 100 chars

All text fields are sanitized (HTML tags stripped).

**Response:** `200 OK`
```json
{
  "token": "eyJhbGci...",
  "username": "john_doe"
}
```

**Errors:**
- `409` — "Username already taken"

### Login
**POST** `/auth/login`

```json
{
  "username": "john_doe",
  "password": "secret123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGci...",
  "username": "john_doe"
}
```

**Errors:**
- `401` — "Invalid credentials"

---

## Account Endpoints

### List Accounts
**GET** `/accounts`

Returns all accounts for the authenticated user. Internal fields (`user`, `version`) are not exposed.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "accountName": "HDFC Savings",
    "accountNumber": "XXXX-1234",
    "openingBalance": 10000.00,
    "currentBalance": 8500.00,
    "createdAt": "2026-02-18T08:00:00"
  }
]
```

### Get Balances at Date
**GET** `/accounts/balances?asOf=2026-02-28T23:59:59`

Returns each account's balance as of the given date (opening balance + net transactions up to that date). Used by the frontend to show historical balances when viewing past months.

**Response:** `200 OK`
```json
{
  "1": { "balance": 9200.00 },
  "2": { "balance": 3000.00 }
```

**Errors:**
- `400` — "Missing required parameter: asOf"

### Create Account
**POST** `/accounts`

```json
{
  "accountName": "HDFC Savings",
  "accountNumber": "XXXX-1234",
  "openingBalance": 10000.00
}
```

Validation:
- `accountName`: required, max 100 chars, unique per user, HTML sanitized
- `accountNumber`: optional, max 50 chars, HTML sanitized
- `openingBalance`: required, >= 0, max ₹99,999,999.99, max 2 decimal places

**Errors:**
- `409` — "Account with this name already exists"

### Update Account
**PUT** `/accounts/:id`

```json
{
  "accountName": "HDFC Savings Updated",
  "accountNumber": "XXXX-5678"
}
```

Note: `openingBalance` is not updatable. Only name and number can be changed. Duplicate name check is enforced on rename.

**Errors:**
- `404` — "Account not found"
- `403` — "Access denied"
- `409` — "Account with this name already exists"

### Delete Account
**DELETE** `/accounts/:id`

**Response:** `204 No Content`

**Errors:**
- `404` — "Account not found"
- `403` — "Access denied"
- `400` — "Cannot delete account with existing transactions"

---

## Transaction Endpoints

### List Transactions by Date Range
**GET** `/transactions?start=2026-02-01T00:00:00&end=2026-02-28T23:59:59`

Both `start` and `end` are required. Use local datetime format (no timezone suffix). Returns transactions ordered by date descending.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "type": "EXPENSE",
    "amount": 500.00,
    "transactionDate": "2026-02-15T10:30:00",
    "category": "Food",
    "description": "Grocery shopping",
    "senderReceiver": "BigBasket",
    "paymentMethod": "UPI",
    "paymentDetails": "user@upi",
    "createdAt": "2026-02-15T10:30:00",
    "account": {
      "id": 1,
      "accountName": "HDFC Savings",
      "accountNumber": "XXXX-1234",
      "openingBalance": 10000.00,
      "currentBalance": 8500.00,
      "createdAt": "2026-02-18T08:00:00"
    }
  }
]
```

**Errors:**
- `400` — "Missing required parameter: start" / "Missing required parameter: end"

### Get User Categories
**GET** `/transactions/categories`

Returns distinct non-null categories used by the user, sorted alphabetically.

**Response:** `200 OK`
```json
["Food", "Rent", "Salary", "Shopping"]
```

### Create Transaction
**POST** `/transactions`

```json
{
  "accountId": 1,
  "type": "EXPENSE",
  "amount": 500.00,
  "transactionDate": "2026-02-15T10:30:00",
  "category": "Food",
  "description": "Grocery shopping",
  "senderReceiver": "BigBasket",
  "paymentMethod": "UPI",
  "paymentDetails": "user@upi"
}
```

Validation:
- `accountId`: required
- `type`: required, `INCOME` or `EXPENSE`
- `amount`: required, positive, max ₹99,999,999.99, max 2 decimal places
- `transactionDate`: required, local datetime format, cannot be in the future
- `category`: optional, max 100 chars, HTML sanitized
- `description`: optional, max 500 chars, HTML sanitized
- `senderReceiver`: optional, max 200 chars, HTML sanitized
- `paymentMethod`: required, one of `UPI`, `CARD`, `CASH`, `BANK_TRANSFER`, `OTHER`
- `paymentDetails`: optional, max 200 chars, HTML sanitized

**Business rules:**
- Expenses cannot exceed account's current balance
- Account balance is recalculated after creation via SQL SUM

**Errors:**
- `400` — "Insufficient balance. Available: ₹X"
- `400` — "Transaction date cannot be in the future"
- `400` — "Amount cannot exceed ₹99,999,999.99"
- `400` — "Amount must have at most 2 decimal places"
- `404` — "Account not found"
- `403` — "Access denied"

### Update Transaction
**PUT** `/transactions/:id`

Same body as create. Can change account, type, amount, or any field.

**Business rules:**
- If changing to EXPENSE or increasing expense amount, balance is validated
- Both old and new account balances are recalculated
- Optimistic locking prevents concurrent update conflicts

### Delete Transaction
**DELETE** `/transactions/:id`

**Response:** `204 No Content`

**Business rules:**
- Deleting an income transaction is blocked if it would make the account balance negative

**Errors:**
- `400` — "Cannot delete this income. Account balance would go negative"
- `404` — "Transaction not found"
- `403` — "Access denied"

---

## Error Response Format

All errors return:
```json
{
  "error": "Human-readable error message"
}
```

| Status | When |
|--------|------|
| 400 | Validation failure, business rule violation, missing required params |
| 401 | Invalid credentials, expired token |
| 403 | Accessing another user's resource |
| 404 | Resource not found |
| 405 | Unsupported HTTP method |
| 409 | Duplicate resource, optimistic lock conflict |
| 500 | Unexpected server error (details logged, not exposed) |

## Security Headers

All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## Date/Time Handling

All datetime values use local datetime format without timezone suffix (e.g., `2026-02-15T10:30:00`). The frontend sends local datetimes directly — no UTC conversion. This ensures the stored time matches the user's intended time regardless of server timezone.
