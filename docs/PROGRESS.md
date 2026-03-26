# Development Progress

## Completed

### Core
- [x] JWT authentication (register + login)
- [x] Multiple account management (CRUD)
- [x] Transaction management (CRUD)
- [x] Monthly navigation with historical balances
- [x] CSV export with account filter support
- [x] Two view modes (table + category grouped)
- [x] Sortable columns
- [x] Account filtering

### Quality & Reliability
- [x] Typed exceptions (not generic RuntimeException)
- [x] Global exception handler with catch-all
- [x] Optimistic locking on accounts
- [x] Balance recalculation via SQL SUM (not loading all rows)
- [x] DB indexes on foreign keys and query columns
- [x] Unique constraint on account name per user
- [x] Input validation with size limits on all fields
- [x] Username format validation
- [x] Separate create/update DTOs for accounts
- [x] Overdraft protection (expenses can't exceed balance)
- [x] Income deletion blocked if balance would go negative
- [x] Future date prevention
- [x] Duplicate name check on account rename
- [x] Double-submit prevention on all forms
- [x] Accounts hidden in months before they existed

### Frontend Quality
- [x] Token expiry check on mount
- [x] Event-based logout (no hard page reload)
- [x] Async refresh with Promise.all
- [x] Loading states with spinner
- [x] ARIA attributes on modals and toasts
- [x] Keyboard accessible account cards
- [x] Mobile-visible action buttons
- [x] Shared input class constant
- [x] No unused dependencies
- [x] No `any` types

### Infrastructure
- [x] Java 21 in Dockerfile (matches pom.xml)
- [x] Proper JWT secret (256-bit)
- [x] Auth filter verifies user existence
- [x] Dev config uses env vars with defaults
- [x] Hibernate @CreationTimestamp for consistent timestamps
- [x] @Getter/@Setter instead of @Data on entities
- [x] FetchType.LAZY with @JsonIgnoreProperties

## Not Yet Implemented

- [ ] Pagination on transaction list
- [ ] Database migrations (Flyway/Liquibase)
- [ ] Rate limiting on auth endpoints
- [ ] Refresh token mechanism
- [ ] Unit and integration tests
- [ ] Response DTOs (entities still exposed directly)
- [ ] Charts and visualizations
- [ ] Budget planning
- [ ] Recurring transactions
- [ ] Multi-currency support
