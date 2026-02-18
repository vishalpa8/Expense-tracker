# 💰 Expense Tracker

A comprehensive, production-ready expense tracking application with authentication, detailed transaction management, and customizable reporting.

![Tech Stack](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login system
- 💳 **Multiple Accounts** - Track multiple bank accounts and wallets
- 📊 **Detailed Transactions** - Record income/expenses with full details
- 📅 **Date & Time Tracking** - Precise transaction timestamps (dd/MM/yyyy HH:mm)
- 💸 **Payment Methods** - Support for UPI, Card, Cash, Bank Transfer
- 📈 **Reports** - Daily and monthly reports with CSV export
- 🎨 **Beautiful UI** - Clean, minimal, professional design
- 📱 **Responsive** - Works on desktop and mobile devices

## 🚀 Quick Start

### Access the Application

**Frontend**: [http://localhost:5173](http://localhost:5173)  
**Backend API**: [http://localhost:8080](http://localhost:8080)

**Default Login**:
- Username: `admin`
- Password: `admin123`

### Services Status

All services are currently running:
- ✅ PostgreSQL (port 5432)
- ✅ Backend API (port 8080)
- ✅ Frontend (port 5173)

## 📖 Documentation

- **[Setup Guide](docs/SETUP_GUIDE.md)** - Installation and configuration
- **[API Documentation](docs/API_DOCUMENTATION.md)** - REST API reference
- **[Progress Tracker](docs/PROGRESS.md)** - Development status and roadmap
- **[Project Overview](docs/PROJECT_OVERVIEW.md)** - Architecture and design

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   React     │─────▶│  Spring Boot │─────▶│  PostgreSQL  │
│  Frontend   │◀─────│   Backend    │◀─────│   Database   │
│  (Port 5173)│ JWT  │  (Port 8080) │ JPA  │  (Port 5432) │
└─────────────┘      └──────────────┘      └──────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **PostgreSQL 15** - Database
- **JWT** - Token-based authentication
- **Maven** - Build tool
- **Docker** - Containerization

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **TanStack Query** - Data fetching
- **date-fns** - Date utilities
- **Lucide React** - Icons

## 📱 Screenshots

### Login Page
Clean and secure authentication interface with default credentials displayed.

### Dashboard
- **Summary Cards**: Total balance, income, and expenses at a glance
- **Transaction Table**: Detailed view of all transactions with filters
- **Account Overview**: All accounts with current balances
- **Period Selection**: Switch between daily and monthly views
- **Export**: Download reports as CSV

### Add Transaction
Comprehensive form with:
- Account selection
- Income/Expense type
- Amount and date/time
- Category and description
- Sender/Receiver information
- Payment method and details

## 🔐 Security

- ✅ Password hashing with BCrypt
- ✅ JWT token authentication
- ✅ Protected API endpoints
- ✅ CORS configuration
- ✅ Secure session management
- ✅ Input validation

## 📊 Database Schema

### Tables
1. **users** - User authentication and profile
2. **accounts** - Bank accounts with balances
3. **transactions** - All financial transactions

### Relationships
- User → Accounts (One-to-Many)
- Account → Transactions (One-to-Many)

## 🎯 Use Cases

1. **Personal Finance Management**
   - Track daily expenses
   - Monitor income sources
   - Manage multiple accounts

2. **Budget Planning**
   - Review monthly spending
   - Identify expense categories
   - Download reports for analysis

3. **Financial Reporting**
   - Generate period-based reports
   - Export data for tax purposes
   - Track payment methods

## 🔄 Workflow

1. **Login** with your credentials
2. **Add Accounts** (e.g., "Main Bank", "Cash Wallet")
3. **Record Transactions**:
   - Select account
   - Choose income/expense
   - Enter amount, date, and details
   - Specify payment method
4. **View Reports**:
   - Select daily or monthly view
   - Choose date range
   - Review transaction history
   - Download CSV report

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Accounts
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts` - Create account

### Transactions
- `GET /api/transactions` - Get transactions by date range
- `POST /api/transactions` - Create transaction

See [API Documentation](docs/API_DOCUMENTATION.md) for details.

## 🧪 Testing

### Manual Testing
1. Login with default credentials
2. Create a new account
3. Add income transaction
4. Add expense transaction
5. View daily report
6. View monthly report
7. Download CSV report

### API Testing
Use cURL, Postman, or HTTPie to test endpoints. See [API Documentation](docs/API_DOCUMENTATION.md).

## 📝 Management

### View Logs
```bash
# Backend
tail -f /workspace/expense-tracker/backend/backend.log

# Frontend
tail -f /workspace/expense-tracker/frontend/frontend.log
```

### Restart Services
```bash
# Backend
docker restart expense-backend

# Frontend (if needed)
cd /workspace/expense-tracker/frontend
npm run dev
```

### Stop Services
```bash
docker stop expense-backend expense-tracker-db
```

## 🔮 Future Enhancements

- [ ] Charts and visualizations
- [ ] Budget planning module
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Mobile application
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Receipt attachments

## 🤝 Contributing

This is a personal project. For suggestions or improvements:
1. Review the codebase
2. Check [PROGRESS.md](docs/PROGRESS.md) for planned features
3. Implement changes following existing patterns
4. Test thoroughly before deployment

## 📄 License

This project is for personal use. Modify as needed for your requirements.

## 🙏 Acknowledgments

Built with modern best practices:
- Clean architecture
- RESTful API design
- Type-safe implementation
- Responsive design
- Comprehensive documentation

## 📞 Support

For issues or questions:
1. Check documentation in `/docs` folder
2. Review log files for errors
3. Verify all services are running
4. Check database connectivity

---

**Built with ❤️ using Java, Spring Boot, React, and TypeScript**
