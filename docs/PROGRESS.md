# Development Progress

## Completed

### Core Features
- [x] JWT authentication (register + login)
- [x] Server-side logout (token blacklist)
- [x] Delete user account (cascades to all data)
- [x] Rate limiting on auth endpoints (Bucket4j, 20/min per IP)
- [x] Multiple account management (CRUD)
- [x] Transaction management (CRUD)
- [x] Monthly navigation with historical balances
- [x] CSV export with account filter in filename
- [x] Two view modes (table + category grouped)
- [x] Sortable columns (date, amount, category, account)
- [x] Account filtering with visual indicator
- [x] Accounts hidden in months before they existed
- [x] Current date shown in month navigator for current month

### Data Integrity
- [x] Overdraft protection (expenses can't exceed balance)
- [x] Income deletion blocked if balance would go negative
- [x] Future date prevention (backend + frontend)
- [x] Amount capped at ₹99,999,999.99 with max 2 decimal places
- [x] BigDecimal column precision (14,2 for accounts, 12,2 for transactions)
- [x] Balance recalculation via SQL SUM
- [x] Optimistic locking on both Account and Transaction entities
- [x] Duplicate name check on account create and rename
- [x] Timezone-correct date handling (local datetimes, no UTC conversion)
- [x] Frontend financial math uses integer cents to avoid floating-point errors
- [x] Server-side pagination on transactions (page/size params, max 500 per page)

### Security
- [x] Typed exceptions (5 classes, not generic RuntimeException)
- [x] Global exception handler with catch-all (no stack traces exposed)
- [x] Handlers for missing params (400), wrong method (405), rate limit (429)
- [x] Security headers: X-Content-Type-Options, X-Frame-Options, HSTS
- [x] CORS with OPTIONS method support
- [x] Input sanitization — HTML tags stripped from all text fields
- [x] User entity not exposed in API responses (@JsonIgnore)
- [x] Version fields not exposed in API responses (@JsonIgnore)
- [x] JWT secret requires environment variable (no hardcoded default)
- [x] DB credentials require environment variables (no hardcoded defaults)
- [x] JWT filter checks token blacklist before authenticating
- [x] JWT filter checks SecurityContext before re-authenticating
- [x] Username format validation (alphanumeric + underscores, 3-30 chars)
- [x] Size limits on all string fields in DTOs
- [x] Rate limiting on login/register (Bucket4j, 20 req/min per IP)

### Frontend Quality
- [x] Token expiry check on mount (JWT exp claim decoded)
- [x] Event-based logout (no hard page reload)
- [x] Async refresh with Promise.all
- [x] Loading states with spinner
- [x] ARIA attributes on modals and toasts
- [x] Keyboard accessible account cards
- [x] Mobile-visible action buttons
- [x] Shared input class constant
- [x] No unused dependencies
- [x] No `any` types
- [x] Double-submit prevention on all forms
- [x] Blob URL revoked after CSV download
- [x] Confirm modal: no global Enter key handler
- [x] Delete user account with confirmation dialog

### Infrastructure
- [x] Java 21 in Dockerfile (matches pom.xml)
- [x] @CreationTimestamp for consistent timestamps
- [x] @Getter/@Setter instead of @Data on entities
- [x] FetchType.LAZY on all @ManyToOne relationships
- [x] DB indexes on user_id, account_id, transaction_date
- [x] Unique constraint on (user_id, account_name)
- [x] Separate create/update DTOs for accounts
- [x] @Transactional(readOnly = true) on all read operations
- [x] Page title set to "Expense Tracker"

## Known Limitations

| Item | Severity | Notes |
|------|----------|-------|
| Token blacklist is in-memory | MEDIUM | Lost on restart. Use Redis for production. |
| No database migrations | LOW | Uses Hibernate ddl-auto in dev. Needs Flyway for production. |
| No unit/integration tests | LOW | No test suite exists. |
| Entities returned directly | LOW | User/version hidden via @JsonIgnore. Full DTOs would decouple API from schema. |
