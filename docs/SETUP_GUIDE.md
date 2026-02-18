# Expense Tracker - Setup & Usage Guide

## 🚀 Quick Start

### Prerequisites
- Docker (for PostgreSQL and backend)
- Node.js 18+ (for frontend)
- Java 17+ (if building locally)

### Services Running
✅ **PostgreSQL**: localhost:5432 (Container: expense-tracker-db)
✅ **Backend API**: http://localhost:8080
✅ **Frontend**: http://localhost:5173

### Default Credentials
- **Username**: admin
- **Password**: admin123

## 📁 Project Structure

```
expense-tracker/
├── backend/                 # Spring Boot API
│   ├── src/main/java/
│   │   └── com/expensetracker/
│   │       ├── config/      # Security & initialization
│   │       ├── controller/  # REST endpoints
│   │       ├── dto/         # Data transfer objects
│   │       ├── entity/      # JPA entities
│   │       ├── repository/  # Data access
│   │       ├── security/    # JWT authentication
│   │       └── service/     # Business logic
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                # React TypeScript
│   ├── src/
│   │   ├── api/            # API client
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Login & Dashboard
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx
│   └── package.json
└── docs/                   # Documentation
```

## 🔧 Management Commands

### Start Services
```bash
# PostgreSQL (if not running)
docker start expense-tracker-db

# Backend
cd /workspace/expense-tracker/backend
docker run --rm --name expense-backend -p 8080:8080 --network host expense-tracker-backend

# Frontend
cd /workspace/expense-tracker/frontend
npm run dev
```

### Stop Services
```bash
docker stop expense-backend expense-tracker-db
# Frontend: Ctrl+C in terminal
```

### View Logs
```bash
# Backend
tail -f /workspace/expense-tracker/backend/backend.log

# Frontend
tail -f /workspace/expense-tracker/frontend/frontend.log
```

### Rebuild Backend
```bash
cd /workspace/expense-tracker/backend
docker build -t expense-tracker-backend .
```

## 🎯 Features

### 1. Authentication
- JWT-based secure authentication
- Protected routes
- Session persistence

### 2. Account Management
- Create multiple accounts
- Track opening and current balance
- Custom account names and numbers

### 3. Transaction Tracking
- **Income & Expense** recording
- **Date & Time** tracking (dd/MM/yyyy HH:mm format)
- **Categories**: Custom categorization
- **Payment Methods**: UPI, Card, Cash, Bank Transfer, Other
- **Payment Details**: UPI IDs, card names, etc.
- **Sender/Receiver** information
- **Descriptions** for context

### 4. Reporting
- **Daily Reports**: View transactions for specific day
- **Monthly Reports**: Comprehensive monthly overview
- **Download CSV**: Export reports with all transaction details
- **Visual Summary**: Income, Expense, and Balance cards

### 5. Dashboard
- Real-time balance tracking
- Transaction history table
- Account overview
- Period selection (daily/monthly)
- Date picker for custom ranges

## 🔐 Security Features

- Password hashing with BCrypt
- JWT token authentication
- Protected API endpoints
- CORS configuration
- Session management

## 📊 Database Schema

### Users Table
- id, username, password, fullName, createdAt

### Accounts Table
- id, userId, accountName, accountNumber, openingBalance, currentBalance, createdAt

### Transactions Table
- id, accountId, type, amount, transactionDate, category, description
- senderReceiver, paymentMethod, paymentDetails, createdAt

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Accounts
- `GET /api/accounts` - Get user accounts
- `POST /api/accounts` - Create new account

### Transactions
- `GET /api/transactions?start={ISO_DATE}&end={ISO_DATE}` - Get transactions by date range
- `POST /api/transactions` - Create new transaction

## 🎨 Design Principles

- **Clean & Minimal**: Professional interface with Tailwind CSS
- **Responsive**: Works on desktop and mobile
- **Intuitive**: Easy navigation and data entry
- **Accessible**: Clear labels and visual feedback
- **Modern**: Latest tech stack (React 18, Spring Boot 3.2)

## 📝 Usage Workflow

1. **Login** with credentials
2. **Add Accounts** (e.g., "Main Bank", "Cash Wallet")
3. **Record Transactions**:
   - Select account
   - Choose income/expense
   - Enter amount and date
   - Add category, description
   - Specify payment method and details
4. **View Reports**:
   - Switch between daily/monthly
   - Select date/month
   - Review transaction table
   - Download CSV report

## 🔄 Data Flow

```
User Input → Frontend (React)
    ↓
API Request (Axios)
    ↓
Backend (Spring Boot) → JWT Validation
    ↓
Service Layer → Business Logic
    ↓
Repository → JPA/Hibernate
    ↓
PostgreSQL Database
```

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check PostgreSQL
docker ps | grep expense-tracker-db

# Check port availability
lsof -i :8080
```

### Frontend errors
```bash
# Reinstall dependencies
cd /workspace/expense-tracker/frontend
rm -rf node_modules package-lock.json
npm install
```

### Database connection issues
```bash
# Restart PostgreSQL
docker restart expense-tracker-db

# Check connection
docker exec -it expense-tracker-db psql -U admin -d expense_tracker
```

## 🔮 Future Enhancements

- [ ] Budget planning and alerts
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Charts and visualizations
- [ ] Export to PDF
- [ ] Mobile app
- [ ] Email notifications
- [ ] Category management
- [ ] Transaction search and filters
- [ ] Backup and restore

## 📞 Support

For issues or questions, check:
- Backend logs: `/workspace/expense-tracker/backend/backend.log`
- Frontend logs: `/workspace/expense-tracker/frontend/frontend.log`
- Database: `docker logs expense-tracker-db`
