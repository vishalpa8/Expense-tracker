# 💰 Expense Tracker

A personal finance application for tracking income, expenses, and bank account balances with monthly reporting.

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

## Features

- **JWT Authentication** — register/login with secure token-based sessions (24h expiry)
- **Server-side Logout** — token blacklist invalidates sessions immediately
- **Rate Limiting** — 20 requests/minute per IP on auth endpoints (Bucket4j)
- **Paginated Transactions** — server-side pagination with configurable page size (max 500)
- **Delete Account** — permanently delete user profile with all data
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
| Auth | JWT (jjwt 0.12), in-memory token blacklist |
| Rate Limiting | Bucket4j |
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
│       ├── exception/       # Typed exceptions (5 classes)
│       ├── repository/      # Spring Data JPA with custom JPQL queries
│       ├── security/        # JWT, auth filter, token blacklist, rate limiter
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

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/auth/logout` | Yes | Blacklist current token |
| DELETE | `/api/auth/account` | Yes | Delete user and all data |
| GET | `/api/accounts` | Yes | List user's accounts |
| GET | `/api/accounts/balances?asOf=` | Yes | Historical balances |
| POST | `/api/accounts` | Yes | Create account |
| PUT | `/api/accounts/:id` | Yes | Update account |
| DELETE | `/api/accounts/:id` | Yes | Delete account |
| GET | `/api/transactions?start=&end=` | Yes | Transactions in date range (paginated) |
| GET | `/api/transactions/categories` | Yes | User's categories |
| POST | `/api/transactions` | Yes | Create transaction |
| PUT | `/api/transactions/:id` | Yes | Update transaction |
| DELETE | `/api/transactions/:id` | Yes | Delete transaction |

See [API Documentation](docs/API_DOCUMENTATION.md) for full details.

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
- Auth endpoints rate-limited to 20 requests/minute per IP

## Security

- BCrypt password hashing
- JWT with HMAC-SHA256 (256-bit key, no hardcoded defaults)
- Token blacklist for server-side logout
- Rate limiting on auth endpoints (Bucket4j, 20/min per IP)
- Security headers: X-Content-Type-Options, X-Frame-Options (DENY), HSTS
- CORS restricted to configured origins
- Ownership checks on all resource access
- Input sanitization on all text fields (XSS prevention)
- No internal IDs or version fields exposed in API responses
- Credentials and secrets require environment variables

## Error Handling

| Exception | Status | Example |
|-----------|--------|---------|
| `ResourceNotFoundException` | 404 | Account not found |
| `AccessDeniedException` | 403 | Accessing another user's resource |
| `InvalidCredentialsException` | 401 | Wrong password |
| `DuplicateResourceException` | 409 | Account name already exists |
| `BusinessRuleException` | 400 | Insufficient balance |
| `OptimisticLockException` | 409 | Concurrent modification |
| `MissingServletRequestParameterException` | 400 | Missing query param |
| `HttpRequestMethodNotSupportedException` | 405 | Wrong HTTP method |
| Rate limit exceeded | 429 | Too many requests |
| Unexpected errors | 500 | Logged, generic message to client |

## Known Limitations

- No database migration tool (uses Hibernate ddl-auto in dev)
- No unit/integration tests
- Token blacklist is in-memory (lost on restart; use Redis for production)
- Entities returned directly (user/version hidden via @JsonIgnore; full DTOs would decouple API from schema)

## Documentation

- [API Documentation](docs/API_DOCUMENTATION.md) — full REST API reference
- [User Guide](FEATURES.md) — how to use the application
- [Progress](docs/PROGRESS.md) — what's done and what's planned

## License

Personal project. Modify as needed.
