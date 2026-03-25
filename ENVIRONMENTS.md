# Environment Configuration Guide

This document explains how to configure and run the Expense Tracker application in different environments.

## Quick Start

### Option 1: Using the Setup Script (Recommended)
```bash
./ENVIRONMENT_SETUP.sh
```
Select your environment from the menu.

### Option 2: Manual Setup

#### Development
```bash
# Terminal 1 - Start Database
docker run -d --name expense-tracker-db \
  -e POSTGRES_DB=expense_tracker \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin123 \
  -p 5432:5432 \
  postgres:15

# Terminal 2 - Start Backend
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Terminal 3 - Start Frontend
cd frontend
npm run dev
```

#### Staging
```bash
# Set environment variables
export DB_URL=jdbc:postgresql://staging-db:5432/expense_tracker_staging
export DB_USERNAME=staging_user
export DB_PASSWORD=your_staging_password
export JWT_SECRET=your_staging_jwt_secret_min_256_bits
export CORS_ORIGINS=https://staging.expensetracker.com

# Build and run backend
cd backend
./mvnw clean package -DskipTests
java -jar target/expense-tracker-0.0.1-SNAPSHOT.jar --spring.profiles.active=staging

# Build frontend
cd frontend
npm run build -- --mode staging
# Deploy dist/ folder to staging server
```

#### Production
```bash
# Set environment variables (use secure secret management in production!)
export DB_URL=jdbc:postgresql://prod-db:5432/expense_tracker_prod
export DB_USERNAME=prod_user
export DB_PASSWORD=your_production_password
export JWT_SECRET=your_production_jwt_secret_min_256_bits
export CORS_ORIGINS=https://expensetracker.com

# Build and run backend
cd backend
./mvnw clean package -DskipTests
java -jar target/expense-tracker-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# Build frontend
cd frontend
npm run build -- --mode production
# Deploy dist/ folder to production server
```

---

## Environment Files

### Backend Configuration Files

| File | Environment | Purpose |
|------|-------------|---------|
| `application.properties` | All | Base configuration |
| `application-dev.properties` | Development | Local development settings |
| `application-staging.properties` | Staging | Testing environment settings |
| `application-prod.properties` | Production | Production settings |

### Frontend Environment Files

| File | Environment | Purpose |
|------|-------------|---------|
| `.env.development` | Development | Local development variables |
| `.env.staging` | Staging | Testing environment variables |
| `.env.production` | Production | Production variables |

---

## Environment Variables

### Backend Required Variables

#### Development (Optional - has defaults)
- None required, uses hardcoded values

#### Staging (Required)
```bash
DB_URL=jdbc:postgresql://staging-host:5432/expense_tracker_staging
DB_USERNAME=staging_user
DB_PASSWORD=staging_password
JWT_SECRET=staging_jwt_secret_minimum_256_bits
CORS_ORIGINS=https://staging.expensetracker.com
```

#### Production (Required)
```bash
DB_URL=jdbc:postgresql://prod-host:5432/expense_tracker_prod
DB_USERNAME=prod_user
DB_PASSWORD=prod_password
JWT_SECRET=prod_jwt_secret_minimum_256_bits
CORS_ORIGINS=https://expensetracker.com
SSL_ENABLED=true  # Optional, if using HTTPS
```

### Frontend Environment Variables

Variables are embedded at build time via Vite.

#### Development
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_ENV=development
VITE_APP_NAME=Expense Tracker (Dev)
VITE_ENABLE_DEBUG=true
```

#### Staging
```env
VITE_API_BASE_URL=https://api-staging.expensetracker.com/api
VITE_APP_ENV=staging
VITE_APP_NAME=Expense Tracker (Staging)
VITE_ENABLE_DEBUG=false
```

#### Production
```env
VITE_API_BASE_URL=https://api.expensetracker.com/api
VITE_APP_ENV=production
VITE_APP_NAME=Expense Tracker
VITE_ENABLE_DEBUG=false
```

---

## Key Differences Between Environments

| Feature | Development | Staging | Production |
|---------|-------------|---------|------------|
| Database | Local Docker | Staging DB | Production DB |
| SQL Logging | Enabled | Disabled | Disabled |
| Debug Logging | DEBUG | INFO | WARN |
| DDL Auto | update | validate | validate |
| CORS | Localhost | Staging domain | Production domain |
| JWT Secret | Weak (dev only) | Strong | Strong |
| SSL/TLS | No | Yes | Yes |
| Error Details | Full stack trace | Limited | None |
| Actuator | All endpoints | Health + metrics | Health only |

---

## Security Best Practices

### Development
- ✅ Use weak credentials (it's local)
- ✅ Enable debug logging
- ✅ Allow all CORS origins

### Staging
- ✅ Use environment variables for secrets
- ✅ Restrict CORS to staging domain
- ✅ Use strong JWT secret
- ✅ Enable SSL/TLS
- ❌ Never use production credentials

### Production
- ✅ Use secret management service (AWS Secrets Manager, etc.)
- ✅ Restrict CORS to production domain only
- ✅ Use very strong JWT secret (256+ bits)
- ✅ Enable SSL/TLS
- ✅ Disable debug logging
- ✅ Hide error details
- ✅ Enable database backups
- ✅ Set up monitoring and alerts
- ❌ Never commit secrets to Git
- ❌ Never use `ddl-auto=update`

---

## Switching Environments

### Backend
The Spring profile determines which `application-{profile}.properties` file is loaded:

```bash
# Development
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Staging
java -jar app.jar --spring.profiles.active=staging

# Production
java -jar app.jar --spring.profiles.active=prod
```

### Frontend
The build mode determines which `.env.{mode}` file is used:

```bash
# Development (default)
npm run dev

# Staging
npm run build -- --mode staging

# Production
npm run build -- --mode production
```

---

## Troubleshooting

### "Profile not found" error
- Ensure the `application-{profile}.properties` file exists
- Check the profile name matches exactly (case-sensitive)

### "Environment variable not set" error
- Export all required environment variables before starting
- Check variable names match exactly

### CORS errors
- Verify `CORS_ORIGINS` matches your frontend URL
- Check protocol (http vs https)
- Ensure no trailing slashes

### Database connection failed
- Verify database is running
- Check host, port, username, password
- Ensure firewall allows connection

### Frontend can't reach backend
- Check `VITE_API_BASE_URL` in environment file
- Verify backend is running
- Check CORS configuration

---

## Next Steps

1. **Development**: Start coding with `./ENVIRONMENT_SETUP.sh` → Option 1
2. **Staging**: Set up staging server and configure environment variables
3. **Production**: Follow the [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for production deployment

---

## Additional Resources

- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [API Documentation](docs/API_DOCUMENTATION.md) - API endpoints reference
- [Setup Guide](docs/SETUP_GUIDE.md) - Initial setup instructions
