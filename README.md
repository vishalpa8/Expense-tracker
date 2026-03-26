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
# Create the database
createdb expense_tracker

# Or via psql
psql -c "CREATE DATABASE expense_tracker;"
```

### Backend
```bash
cd backend

# Run with Maven (dev mode)
./mvnw spring-boot:run

# Or build and run JAR (recommended — uses less memory)
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

### Configuration

Backend config is in `backend/src/main/resources/`:
- `application.properties` — base config (active profile, JWT expiry, port)
- `application-dev.properties` — dev database, JWT secret, CORS origins
- `application-prod.properties` — production config using environment variables

DB credentials default to `admin/admin123` in dev. Override with env vars:
```bash
export DB_URL=jdbc:postgresql://localhost:5432/expense_tracker
export DB_USERNAME=your_user
export DB_PASSWORD=your_password
```

## Project Structure

```
├── backend/
│   └── src/main/java/com/expensetracker/
│       ├── config/          # Security, CORS, global exception handler
│       ├── controller/      # REST endpoints (Auth, Account, Transaction)
│       ├── dto/             # Request/response DTOs with validation
│       ├── entity/          # JPA entities (User, Account, Transaction)
│       ├── exception/       # Custom exceptions (typed, not generic RuntimeException)
│       ├── repository/      # Spring Data JPA repositories
│       ├── security/        # JWT utility and auth filter
│       └── service/         # Business logic with balance validation
├── frontend/
│   └── src/
│       ├── api/             # Axios client with interceptors
│       ├── components/      # Reusable UI (modals, sections, wrappers)
│       ├── context/         # Auth and Toast providers
│       ├── pages/           # Login, Register, Dashboard
│       ├── types/           # TypeScript interfaces
│       └── utils/           # Error messages, shared styles
└── docs/                    # API docs, setup guide, progress tracker
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

See [API Documentation](docs/API_DOCUMENTATION.md) for full details.

## Business Rules

- Expenses cannot exceed account balance (overdraft protection)
- Deleting income is blocked if it would make balance negative
- Transaction dates cannot be in the future
- Account names must be unique per user
- Accounts with transactions cannot be deleted
- Balances are recalculated via SQL SUM (not iterating all transactions)
- Past months show historical balances, not current balance
- Accounts only appear in months after their creation date

## Database Schema

```
users (id, username, password, full_name, created_at)
  └── accounts (id, user_id, account_name, account_number, opening_balance, current_balance, version, created_at)
        └── transactions (id, account_id, type, amount, transaction_date, category, description, sender_receiver, payment_method, payment_details, created_at)
```

Indexes on `accounts.user_id`, `transactions.account_id`, `transactions.transaction_date`.
Unique constraint on `(user_id, account_name)`.
Optimistic locking via `@Version` on accounts.

## Error Handling

Backend uses typed exceptions (not generic RuntimeException):
- `ResourceNotFoundException` → 404
- `AccessDeniedException` → 403
- `InvalidCredentialsException` → 401
- `DuplicateResourceException` → 409
- `BusinessRuleException` → 400
- `OptimisticLockException` → 409
- Unexpected errors → 500 (logged, no stack trace exposed)

Frontend maps all backend errors to user-friendly messages.

## Documentation

- [API Documentation](docs/API_DOCUMENTATION.md) — full REST API reference
- [User Guide](FEATURES.md) — how to use the application
- [Progress](docs/PROGRESS.md) — what's done and what's planned

## License

Personal project. Modify as needed.
