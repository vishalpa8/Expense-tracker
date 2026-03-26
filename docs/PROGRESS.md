# Development Progress

## Completed

### Core Features
- [x] JWT authentication (register + login)
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
- [x] Balance recalculation via SQL SUM (not loading all rows)
- [x] Optimistic locking on both Account and Transaction entities
- [x] Duplicate name check on account create and rename
- [x] Timezone-correct date handling (local datetimes, no UTC conversion)
- [x] Frontend financial math uses integer cents to avoid floating-point errors

### Security
- [x] Typed exceptions (5 classes, not generic RuntimeException)
- [x] Global exception handler with catch-all (no stack traces exposed)
- [x] Handlers for MissingServletRequestParameterException (400 not 500)
- [x] Handler for HttpRequestMethodNotSupportedException (405 not 500)
- [x] Security headers: X-Content-Type-Options, X-Frame-Options, HSTS
- [x] CORS with OPTIONS method support
- [x] Input sanitization — HTML tags stripped from all text fields
- [x] User entity not exposed in API responses (@JsonIgnore)
- [x] Version fields not exposed in API responses (@JsonIgnore)
- [x] JWT secret requires environment variable (no hardcoded default)
- [x] DB credentials require environment variables (no hardcoded defaults)
- [x] JWT filter trusts validated token (no per-request DB lookup)
- [x] JWT filter checks SecurityContext before re-authenticating
- [x] Username format validation (alphanumeric + underscores, 3-30 chars)
- [x] Size limits on all string fields in DTOs

### Frontend Quality
- [x] Token expiry check on mount (JWT exp claim decoded)
- [x] Event-based logout (no hard page reload)
- [x] Async refresh with Promise.all
- [x] Loading states with spinner
- [x] ARIA attributes on modals and toasts
- [x] Keyboard accessible account cards (tabIndex, role, onKeyDown)
- [x] Mobile-visible action buttons (sm:opacity-0 pattern)
- [x] Shared input class constant
- [x] No unused dependencies (removed react-query, recharts)
- [x] No `any` types
- [x] Double-submit prevention on all forms
- [x] Blob URL revoked after CSV download (no memory leak)
- [x] Confirm modal: no global Enter key handler (prevents accidental deletion)

### Infrastructure
- [x] Java 21 in Dockerfile (matches pom.xml)
- [x] @CreationTimestamp for consistent timestamps
- [x] @Getter/@Setter instead of @Data on entities (safe equals/hashCode)
- [x] FetchType.LAZY on all @ManyToOne relationships
- [x] DB indexes on user_id, account_id, transaction_date
- [x] Unique constraint on (user_id, account_name)
- [x] Separate create/update DTOs for accounts
- [x] @Transactional(readOnly = true) on all read operations
- [x] Page title set to "Expense Tracker" (not "frontend")

## Known Limitations (Not Yet Implemented)

| Item | Severity | Notes |
|------|----------|-------|
| Rate limiting on auth endpoints | HIGH | Brute force possible. Needs Bucket4j or similar. |
| Pagination on transaction list | MEDIUM | Unbounded response. Needs Spring Pageable + frontend pagination UI. |
| Token revocation / server-side logout | MEDIUM | Stolen JWTs valid for 24h. Needs Redis blacklist or short-lived tokens + refresh. |
| Database migrations | LOW | Uses Hibernate ddl-auto in dev. Needs Flyway/Liquibase for production. |
| Unit and integration tests | LOW | No test suite exists. |
| Response DTOs | LOW | Entities returned directly (user/version hidden via @JsonIgnore). Full DTOs would decouple API from schema. |
