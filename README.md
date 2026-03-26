# 💰 Expense Tracker

A personal finance application for tracking income, expenses, and bank account balances with monthly reporting.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

## Features

- **JWT Authentication** — register/login with secure token-based sessions (24h expiry)
- **Multiple Accounts** — track bank accounts, wallets, UPI apps with individual balances
- **Transaction Management** — record income/expenses with category, description, payment method
- **Overdraft Protection** — prevents spending more than available balance
- **Monthly Navigation** — browse past months with accurate historical balances per account
- **Account Filtering** — click any account card to filter transactions
- **Two View Modes** — flat table or grouped by category
- **Sortable Columns** — sort by date, amount, category, or account
- **CSV Export** — download monthly reports as spreadsheets
- **Input Sanitization** — HTML tags stripped from all user input (XSS prevention)
- **Financial Precision** — amounts capped at ₹99,999,999.99 with max 2 decimal places
- **Security Headers** — X-Content-Type-Options, X-Frame-Options, HSTS enabled
- **Responsive Design** — works on desktop and mobile
- **Accessible** — ARIA attributes, keyboard navigation, screen reader support

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.2, Spring Security, Spring Data JPA |
| Frontend | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4 |
| Database | PostgreSQL 15 |
| Auth | JWT (jjwt 0.12) |
| Icons | Lucide React |
| Dates | date-fns |

## Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL 15+

### Database Setup
```bash
createdb expense_tracker
```

### Backend
```bash
cd backend

# Set required environment variables
export DB_USERNAME=your_db_user
export DB_PASSWORD=your_db_password
export JWT_SECRET=$(openssl rand -base64 32)

# Build and run JAR (recommended — single JVM, less memory)
./mvnw clean package -DskipTests
java -jar target/expense-tracker-1.0.0.jar

# Or run with Maven (dev mode — spawns two JVMs)
./mvnw spring-boot:run
```
Backend starts on `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend starts on `http://localhost:5173`

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_URL` | No | JDBC URL (default: `jdbc:postgresql://localhost:5432/expense_tracker`) |
| `DB_USERNAME` | Yes | Database username |
| `DB_PASSWORD` | Yes | Database password |
| `JWT_SECRET` | Yes | 256-bit secret for JWT signing (use `openssl rand -base64 32`) |

## Project Structure

```
├── backend/
│   └── src/main/java/com/expensetracker/
│       ├── config/          # Security, CORS, security headers, global exception handler
│       ├── controller/      # REST endpoints (Auth, Account, Transaction)
│       ├── dto/             # Request DTOs with validation (@Digits, @DecimalMax, @Size)
│       ├── entity/          # JPA entities with indexes, constraints, optimistic locking
│       ├── exception/       # Typed exceptions (5 classes, not generic RuntimeException)
│       ├── repository/      # Spring Data JPA with custom JPQL queries
│       ├── security/        # JWT utility and stateless auth filter
│       └── service/         # Business logic with sanitization and balance validation
├── frontend/
│   └── src/
│       ├── api/             # Axios client with auth interceptors
│       ├── components/      # Reusable UI (modals, sections, wrappers)
│       ├── context/         # Auth (JWT expiry check) and Toast providers
│       ├── pages/           # Login, Register, Dashboard
│       ├── types/           # TypeScript interfaces
│       └── utils/           # Error messages, shared styles
└── docs/                    # API docs, progress tracker
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/accounts` | List user's accounts |
| GET | `/api/accounts/balances?asOf=` | Account balances at a point in time |
| POST | `/api/accounts` | Create account |
| PUT | `/api/accounts/:id` | Update account name/number |
| DELETE | `/api/accounts/:id` | Delete account (no transactions) |
| GET | `/api/transactions?start=&end=` | Transactions in date range |
| GET | `/api/transactions/categories` | User's distinct categories |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

See [API Documentation](docs/API_DOCUMENTATION.md) for full request/response details.

## Business Rules

- Expenses cannot exceed account balance (overdraft protection)
- Deleting income is blocked if it would make balance negative
- Transaction dates cannot be in the future
- Amounts limited to ₹99,999,999.99 with max 2 decimal places
- Account names must be unique per user (checked on both create and rename)
- Accounts with transactions cannot be deleted
- Balances recalculated via SQL SUM (not iterating all transactions)
- Past months show historical balances, not current balance
- Accounts only appear in months after their creation date
- All text inputs sanitized (HTML tags stripped)

## Security

- BCrypt password hashing
- JWT with HMAC-SHA256 (256-bit key, no hardcoded defaults)
- Stateless sessions (no server-side session storage)
- Security headers: X-Content-Type-Options, X-Frame-Options (DENY), HSTS
- CORS restricted to configured origins (OPTIONS method supported)
- Ownership checks on all resource access
- Input sanitization on all text fields (XSS prevention)
- No internal IDs or version fields exposed in API responses
- Credentials and secrets require environment variables (no defaults in config)

## Database Schema

```
users (id, username, password, full_name, created_at)
  └── accounts (id, user_id, account_name, account_number, opening_balance[14,2], current_balance[14,2], version, created_at)
        └── transactions (id, account_id, type, amount[12,2], transaction_date, category, description, sender_receiver, payment_method, payment_details, version, created_at)
```

- Indexes on `accounts.user_id`, `transactions.account_id`, `transactions.transaction_date`
- Unique constraint on `(user_id, account_name)`
- Optimistic locking via `@Version` on both Account and Transaction

## Error Handling

Backend uses typed exceptions mapped to HTTP status codes:

| Exception | Status | Example |
|-----------|--------|---------|
| `ResourceNotFoundException` | 404 | Account not found |
| `AccessDeniedException` | 403 | Accessing another user's resource |
| `InvalidCredentialsException` | 401 | Wrong password |
| `DuplicateResourceException` | 409 | Account name already exists |
| `BusinessRuleException` | 400 | Insufficient balance, future date |
| `OptimisticLockException` | 409 | Concurrent modification |
| `MissingServletRequestParameterException` | 400 | Missing required query param |
| `HttpRequestMethodNotSupportedException` | 405 | PATCH on a PUT-only endpoint |
| Unexpected errors | 500 | Logged server-side, generic message to client |

## Known Limitations

- No rate limiting on auth endpoints (brute force possible)
- No pagination on transaction listing (unbounded response)
- No token revocation (stolen JWTs valid until 24h expiry)
- No database migration tool (uses Hibernate ddl-auto in dev)
- No unit/integration tests

## Documentation

- [API Documentation](docs/API_DOCUMENTATION.md) — full REST API reference
- [User Guide](FEATURES.md) — how to use the application
- [Progress](docs/PROGRESS.md) — what's done and what's planned

## License

Personal project. Modify as needed.
