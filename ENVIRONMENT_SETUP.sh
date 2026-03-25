#!/bin/bash

# Expense Tracker - Environment Setup Script
# This script helps you run the application in different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Expense Tracker Environment Setup   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to display menu
show_menu() {
    echo -e "${GREEN}Select Environment:${NC}"
    echo "1) Development (Local)"
    echo "2) Production (Live)"
    echo "3) Exit"
    echo ""
}

# Function to run development environment
run_dev() {
    echo -e "${GREEN}Starting Development Environment...${NC}"
    echo ""
    
    # Start PostgreSQL
    echo -e "${YELLOW}Starting PostgreSQL database...${NC}"
    docker run -d --name expense-tracker-db \
        -e POSTGRES_DB=expense_tracker \
        -e POSTGRES_USER=admin \
        -e POSTGRES_PASSWORD=admin123 \
        -p 5432:5432 \
        postgres:15 2>/dev/null || echo "Database already running"
    
    echo ""
    echo -e "${YELLOW}Starting Backend (Development)...${NC}"
    echo "Profile: dev"
    echo "Port: 8080"
    cd backend
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev &
    BACKEND_PID=$!
    cd ..
    
    echo ""
    echo -e "${YELLOW}Starting Frontend (Development)...${NC}"
    echo "Port: 5173"
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo -e "${GREEN}✓ Development environment started!${NC}"
    echo -e "${BLUE}Backend:${NC} http://localhost:8080"
    echo -e "${BLUE}Frontend:${NC} http://localhost:5173"
    echo -e "${BLUE}Database:${NC} localhost:5432"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
    
    # Wait for processes
    wait $BACKEND_PID $FRONTEND_PID
}

# Function to run production environment
run_prod() {
    echo -e "${RED}╔════════════════════════════════════════╗${NC}"
    echo -e "${RED}║          PRODUCTION WARNING            ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}You are about to start the PRODUCTION environment.${NC}"
    echo -e "${YELLOW}This should only be done on production servers.${NC}"
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo -e "${GREEN}Cancelled.${NC}"
        return
    fi
    
    echo ""
    echo -e "${GREEN}Starting Production Environment...${NC}"
    echo ""
    
    # Check for required environment variables
    if [ -z "$DB_URL" ] || [ -z "$DB_USERNAME" ] || [ -z "$DB_PASSWORD" ] || [ -z "$JWT_SECRET" ]; then
        echo -e "${RED}Error: Missing required environment variables!${NC}"
        echo ""
        echo "Please set the following environment variables:"
        echo "  export DB_URL=jdbc:postgresql://prod-db-host:5432/expense_tracker_prod"
        echo "  export DB_USERNAME=prod_user"
        echo "  export DB_PASSWORD=your_production_password"
        echo "  export JWT_SECRET=your_production_jwt_secret"
        echo "  export CORS_ORIGINS=https://expensetracker.com"
        echo ""
        exit 1
    fi
    
    echo -e "${YELLOW}Building Backend...${NC}"
    cd backend
    ./mvnw clean package -DskipTests
    
    echo ""
    echo -e "${YELLOW}Starting Backend (Production)...${NC}"
    java -jar target/expense-tracker-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod &
    BACKEND_PID=$!
    cd ..
    
    echo ""
    echo -e "${YELLOW}Building Frontend (Production)...${NC}"
    cd frontend
    npm run build
    
    echo ""
    echo -e "${GREEN}✓ Production build complete!${NC}"
    echo -e "${BLUE}Backend:${NC} Running with production profile"
    echo -e "${BLUE}Frontend:${NC} Built in dist/ folder (deploy to production server)"
    echo ""
    
    wait $BACKEND_PID
}

# Main menu loop
while true; do
    show_menu
    read -p "Enter your choice [1-3]: " choice
    echo ""
    
    case $choice in
        1)
            run_dev
            ;;
        2)
            run_prod
            ;;
        3)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please try again.${NC}"
            echo ""
            ;;
    esac
done
