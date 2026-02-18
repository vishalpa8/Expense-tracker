# Expense Tracker API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

All endpoints except `/auth/login` require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

**Error:** `401 Unauthorized`
```json
{
  "message": "Invalid credentials"
}
```

---

## Account Endpoints

### Get All Accounts
**GET** `/accounts`

Retrieve all accounts for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "accountName": "Main Bank Account",
    "accountNumber": "1234567890",
    "openingBalance": 10000.00,
    "currentBalance": 15000.00,
    "createdAt": "2026-02-18T08:00:00Z",
    "user": {
      "id": 1,
      "username": "admin"
    }
  }
]
```

### Create Account
**POST** `/accounts`

Create a new account for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "accountName": "Savings Account",
  "accountNumber": "9876543210",
  "openingBalance": 5000.00
}
```

**Response:** `200 OK`
```json
{
  "id": 2,
  "accountName": "Savings Account",
  "accountNumber": "9876543210",
  "openingBalance": 5000.00,
  "currentBalance": 5000.00,
  "createdAt": "2026-02-18T08:30:00Z",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

---

## Transaction Endpoints

### Get Transactions by Date Range
**GET** `/transactions`

Retrieve transactions for authenticated user within date range.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `start` (required): ISO 8601 datetime (e.g., `2026-02-01T00:00:00Z`)
- `end` (required): ISO 8601 datetime (e.g., `2026-02-28T23:59:59Z`)

**Example:**
```
GET /transactions?start=2026-02-01T00:00:00Z&end=2026-02-28T23:59:59Z
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "type": "INCOME",
    "amount": 5000.00,
    "transactionDate": "2026-02-15T10:30:00Z",
    "category": "Salary",
    "description": "Monthly salary",
    "senderReceiver": "Company XYZ",
    "paymentMethod": "BANK_TRANSFER",
    "paymentDetails": "Direct deposit",
    "createdAt": "2026-02-15T10:30:00Z",
    "account": {
      "id": 1,
      "accountName": "Main Bank Account",
      "currentBalance": 15000.00
    }
  },
  {
    "id": 2,
    "type": "EXPENSE",
    "amount": 500.00,
    "transactionDate": "2026-02-16T14:20:00Z",
    "category": "Food",
    "description": "Grocery shopping",
    "senderReceiver": "Supermarket ABC",
    "paymentMethod": "UPI",
    "paymentDetails": "user@upi",
    "createdAt": "2026-02-16T14:20:00Z",
    "account": {
      "id": 1,
      "accountName": "Main Bank Account",
      "currentBalance": 14500.00
    }
  }
]
```

### Create Transaction
**POST** `/transactions`

Create a new transaction and update account balance.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "accountId": 1,
  "type": "EXPENSE",
  "amount": 1200.50,
  "transactionDate": "2026-02-18T15:30:00Z",
  "category": "Shopping",
  "description": "Electronics purchase",
  "senderReceiver": "Tech Store",
  "paymentMethod": "CARD",
  "paymentDetails": "Visa ending 1234"
}
```

**Field Descriptions:**
- `accountId` (required): ID of the account
- `type` (required): `INCOME` or `EXPENSE`
- `amount` (required): Transaction amount (positive number)
- `transactionDate` (required): ISO 8601 datetime
- `category` (optional): Transaction category
- `description` (optional): Additional details
- `senderReceiver` (optional): Name of sender (for income) or receiver (for expense)
- `paymentMethod` (required): `UPI`, `CARD`, `CASH`, `BANK_TRANSFER`, or `OTHER`
- `paymentDetails` (optional): UPI ID, card name, etc.

**Response:** `200 OK`
```json
{
  "id": 3,
  "type": "EXPENSE",
  "amount": 1200.50,
  "transactionDate": "2026-02-18T15:30:00Z",
  "category": "Shopping",
  "description": "Electronics purchase",
  "senderReceiver": "Tech Store",
  "paymentMethod": "CARD",
  "paymentDetails": "Visa ending 1234",
  "createdAt": "2026-02-18T15:30:00Z",
  "account": {
    "id": 1,
    "accountName": "Main Bank Account",
    "currentBalance": 13299.50
  }
}
```

---

## Data Models

### User
```typescript
{
  id: number;
  username: string;
  fullName: string;
  createdAt: string; // ISO 8601
}
```

### Account
```typescript
{
  id: number;
  accountName: string;
  accountNumber?: string;
  openingBalance: number;
  currentBalance: number;
  createdAt: string; // ISO 8601
  user: User;
}
```

### Transaction
```typescript
{
  id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  transactionDate: string; // ISO 8601
  category?: string;
  description?: string;
  senderReceiver?: string;
  paymentMethod: 'UPI' | 'CARD' | 'CASH' | 'BANK_TRANSFER' | 'OTHER';
  paymentDetails?: string;
  createdAt: string; // ISO 8601
  account: Account;
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "timestamp": "2026-02-18T08:00:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 400 Bad Request
```json
{
  "timestamp": "2026-02-18T08:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be positive"
    }
  ]
}
```

### 404 Not Found
```json
{
  "timestamp": "2026-02-18T08:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Account not found"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2026-02-18T08:00:00Z",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Example Usage with cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Accounts
```bash
curl -X GET http://localhost:8080/api/accounts \
  -H "Authorization: Bearer <your-token>"
```

### Create Account
```bash
curl -X POST http://localhost:8080/api/accounts \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "accountName": "Cash Wallet",
    "openingBalance": 1000.00
  }'
```

### Get Transactions
```bash
curl -X GET "http://localhost:8080/api/transactions?start=2026-02-01T00:00:00Z&end=2026-02-28T23:59:59Z" \
  -H "Authorization: Bearer <your-token>"
```

### Create Transaction
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": 1,
    "type": "EXPENSE",
    "amount": 250.00,
    "transactionDate": "2026-02-18T12:00:00Z",
    "category": "Food",
    "description": "Lunch",
    "paymentMethod": "UPI",
    "paymentDetails": "user@paytm"
  }'
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production deployment, consider:
- 100 requests per minute per user
- 1000 requests per hour per user
- Implement using Spring Security or API Gateway

## Security Notes

1. **JWT Expiration**: Tokens expire after 24 hours (configurable in `application.properties`)
2. **Password Storage**: Passwords are hashed using BCrypt
3. **CORS**: Configured to allow requests from `http://localhost:5173`
4. **HTTPS**: Use HTTPS in production environments
5. **Secret Key**: Change JWT secret in production (`jwt.secret` property)

## Testing

Use tools like:
- **Postman**: Import API collection
- **cURL**: Command-line testing
- **HTTPie**: User-friendly HTTP client
- **Insomnia**: REST client with GraphQL support
