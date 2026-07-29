# Auth Testing Playbook (PostgreSQL Adapted)

## Step 1: Create Test User & Session via SQL

```sql
-- Connect to database
psql -U panchtattwa_user -d panchtattwa_db

-- Insert test user
INSERT INTO users (user_id, email, name, picture, role, created_at)
VALUES ('test-user-001', 'test@example.com', 'Test User', '', 'client', NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert session
INSERT INTO user_sessions (user_id, session_token, expires_at, created_at)
VALUES ('test-user-001', 'test_session_token_001', NOW() + INTERVAL '7 days', NOW());
```

## Step 2: Test Backend API

```bash
# Test auth endpoint
curl -X GET "https://your-app.com/api/auth/me" \
  -H "Authorization: Bearer test_session_token_001"

# Test protected endpoints
curl -X GET "https://your-app.com/api/bookings" \
  -H "Authorization: Bearer test_session_token_001"
```

## Step 3: Browser Testing

```python
await page.context.add_cookies([{
    "name": "session_token",
    "value": "test_session_token_001",
    "domain": "your-app.com",
    "path": "/",
    "httpOnly": True,
    "secure": True,
    "sameSite": "None"
}])
await page.goto("https://your-app.com")
```

## Checklist
- [ ] User document has user_id field (UUID)
- [ ] Session user_id matches user's user_id
- [ ] Backend queries use user_id correctly
- [ ] /api/auth/me returns user data
- [ ] Dashboard loads without redirect
- [ ] CRUD operations work

## Success Indicators
- /api/auth/me returns user data
- Dashboard loads without redirect
- Booking form submission persists in DB

## Failure Indicators
- "User not found" errors
- 401 Unauthorized responses
- Redirect to login page
