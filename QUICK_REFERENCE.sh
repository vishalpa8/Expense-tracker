#!/bin/bash
# Expense Tracker - Quick Reference Commands

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Expense Tracker - Quick Reference                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Access Information
echo "📱 ACCESS INFORMATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Frontend:  http://localhost:5173"
echo "Backend:   http://localhost:8080"
echo "Database:  localhost:5432"
echo ""
echo "Login: admin / admin123"
echo ""

# Service Status
echo "🔍 CHECK SERVICE STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "docker ps | grep expense"
echo ""

# View Logs
echo "📋 VIEW LOGS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Backend:   tail -f /workspace/expense-tracker/backend/backend.log"
echo "Frontend:  tail -f /workspace/expense-tracker/frontend/frontend.log"
echo "Database:  docker logs expense-tracker-db"
echo ""

# Restart Services
echo "🔄 RESTART SERVICES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Backend:   docker restart expense-backend"
echo "Database:  docker restart expense-tracker-db"
echo "Frontend:  cd /workspace/expense-tracker/frontend && npm run dev"
echo ""

# Stop Services
echo "⏹️  STOP SERVICES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "All:       docker stop expense-backend expense-tracker-db"
echo "Backend:   docker stop expense-backend"
echo "Database:  docker stop expense-tracker-db"
echo ""

# Start Services
echo "▶️  START SERVICES (if stopped)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Database:  docker start expense-tracker-db"
echo "Backend:   docker start expense-backend"
echo "Frontend:  cd /workspace/expense-tracker/frontend && npm run dev"
echo ""

# Rebuild
echo "🔨 REBUILD SERVICES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Backend:   cd /workspace/expense-tracker/backend && docker build -t expense-tracker-backend ."
echo "Frontend:  cd /workspace/expense-tracker/frontend && npm install"
echo ""

# Database Access
echo "🗄️  DATABASE ACCESS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "docker exec -it expense-tracker-db psql -U admin -d expense_tracker"
echo ""

# Documentation
echo "📚 DOCUMENTATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "README:           /workspace/expense-tracker/README.md"
echo "Setup Guide:      /workspace/expense-tracker/docs/SETUP_GUIDE.md"
echo "API Docs:         /workspace/expense-tracker/docs/API_DOCUMENTATION.md"
echo "Progress:         /workspace/expense-tracker/docs/PROGRESS.md"
echo "Complete Summary: /workspace/expense-tracker/PROJECT_COMPLETE.md"
echo ""

# Test API
echo "🧪 TEST API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Login:"
echo "curl -X POST http://localhost:8080/api/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"username\":\"admin\",\"password\":\"admin123\"}'"
echo ""

# Project Structure
echo "📂 PROJECT STRUCTURE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Backend:  /workspace/expense-tracker/backend/"
echo "Frontend: /workspace/expense-tracker/frontend/"
echo "Docs:     /workspace/expense-tracker/docs/"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  For detailed information, see README.md and docs/ folder  ║"
echo "╚════════════════════════════════════════════════════════════╝"
