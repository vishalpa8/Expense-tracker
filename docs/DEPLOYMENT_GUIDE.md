# Deployment Guide

This guide covers deploying the Expense Tracker application across different environments.

## Environments

### 1. Development (Local)
- **Purpose**: Local development and testing
- **Database**: Local PostgreSQL in Docker
- **Backend**: Runs on localhost:8080
- **Frontend**: Runs on localhost:5173
- **Profile**: `dev`

### 2. Production (Live)
- **Purpose**: Live application for end users
- **Database**: Production PostgreSQL instance
- **Backend**: Deployed to production server
- **Frontend**: Deployed to production domain
- **Profile**: `prod`

---

## Backend Deployment

### Development
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Production
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/expense-tracker-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

**Required Environment Variables:**
```bash
export DB_URL=jdbc:postgresql://prod-db-host:5432/expense_tracker_prod
export DB_USERNAME=prod_user
export DB_PASSWORD=your_production_password
export JWT_SECRET=your_production_jwt_secret_minimum_256_bits
export CORS_ORIGINS=https://expensetracker.com
```

---

## Frontend Deployment

### Development
```bash
cd frontend
npm run dev
```

### Production
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your production server
```

---

## Docker Deployment

### Build Docker Images

**Backend:**
```bash
cd backend
docker build -t expense-tracker-backend:latest .
docker build -t expense-tracker-backend:prod .
```

**Frontend:**
Create a `Dockerfile` in the frontend directory:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build:
```bash
cd frontend
docker build -t expense-tracker-frontend:prod .
```

### Docker Compose for Production

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: expense_tracker_prod
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - prod_db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: always

  backend:
    image: expense-tracker-backend:prod
    environment:
      SPRING_PROFILES_ACTIVE: prod
      DB_URL: jdbc:postgresql://db:5432/expense_tracker_prod
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGINS: ${CORS_ORIGINS}
    ports:
      - "8080:8080"
    depends_on:
      - db
    restart: always

  frontend:
    image: expense-tracker-frontend:prod
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: always

volumes:
  prod_db_data:
```

Run:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Database Migration

### Production
1. **ALWAYS backup first:**
```bash
pg_dump -h prod-db-host -U prod_user expense_tracker_prod > backup_prod_$(date +%Y%m%d_%H%M%S).sql
```

2. Test migrations locally first
3. Apply during maintenance window
4. Verify data integrity

---

## Environment Variables Security

### Never commit these to Git:
- Database passwords
- JWT secrets
- API keys
- Production URLs

### Use Secret Management:
- **AWS**: AWS Secrets Manager or Parameter Store
- **Azure**: Azure Key Vault
- **GCP**: Google Secret Manager
- **Kubernetes**: Kubernetes Secrets

---

## Health Checks

### Backend Health Endpoint
```bash
# Development
curl http://localhost:8080/actuator/health

# Production
curl https://api.expensetracker.com/actuator/health
```

### Frontend Health Check
```bash
# Development
curl http://localhost:5173

# Production
curl https://expensetracker.com
```

---

## Monitoring & Logging

### Recommended Tools:
- **Application Monitoring**: New Relic, Datadog, or AWS CloudWatch
- **Log Aggregation**: ELK Stack, Splunk, or CloudWatch Logs
- **Error Tracking**: Sentry or Rollbar
- **Uptime Monitoring**: Pingdom or UptimeRobot

### Log Locations:
- **Backend**: Check application logs in `/var/log/` or container logs
- **Frontend**: Browser console and server access logs
- **Database**: PostgreSQL logs

---

## Rollback Procedure

### Backend Rollback:
```bash
# Stop current version
systemctl stop expense-tracker-backend

# Deploy previous version
java -jar target/expense-tracker-0.0.1-SNAPSHOT-previous.jar --spring.profiles.active=prod

# Or use Docker
docker stop expense-tracker-backend
docker run -d expense-tracker-backend:previous-tag
```

### Frontend Rollback:
```bash
# Restore previous build
cp -r dist-backup/* dist/
# Or redeploy previous version
```

### Database Rollback:
```bash
# Restore from backup
psql -h prod-db-host -U prod_user expense_tracker_prod < backup_prod_YYYYMMDD_HHMMSS.sql
```

---

## SSL/TLS Configuration

### Use Let's Encrypt for free SSL certificates:
```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d expensetracker.com -d www.expensetracker.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Configure backend for HTTPS:
Add to `application-prod.properties`:
```properties
server.ssl.enabled=true
server.ssl.key-store=/path/to/keystore.p12
server.ssl.key-store-password=${SSL_KEYSTORE_PASSWORD}
server.ssl.key-store-type=PKCS12
```

---

## CI/CD Pipeline Example

### GitHub Actions Workflow:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Backend
        run: |
          cd backend
          ./mvnw clean package -DskipTests
      
      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build
      
      - name: Deploy to Production Server
        run: |
          # Your deployment script here
```

---

## Checklist Before Going Live

### Development:
- [ ] All tests passing locally
- [ ] Database migrations working
- [ ] Frontend connects to backend

### Production:
- [ ] Development thoroughly tested
- [ ] Production database backed up
- [ ] Environment variables secured
- [ ] Strong JWT secret configured
- [ ] CORS properly restricted
- [ ] SSL/TLS enabled
- [ ] Monitoring and alerts configured
- [ ] Rollback plan documented
- [ ] Team notified of deployment
- [ ] Maintenance window scheduled (if needed)

---

## Support & Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check database host and port
   - Verify credentials
   - Check firewall rules

2. **CORS Errors**
   - Verify CORS_ORIGINS environment variable
   - Check frontend API base URL

3. **JWT Token Invalid**
   - Ensure JWT_SECRET is consistent
   - Check token expiration time

4. **Build Failures**
   - Clear Maven cache: `./mvnw clean`
   - Clear npm cache: `npm cache clean --force`

### Getting Help:
- Check application logs
- Review error messages
- Consult documentation
- Contact development team
