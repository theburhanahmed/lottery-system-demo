# API Examples

This document provides cURL examples for all API endpoints in the Lottery System.

## Authentication

### Register User

```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123",
    "password_confirm": "TestPassword123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPassword123"
  }'
```

Response:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "uuid",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### Get Profile

```bash
curl -X GET http://localhost:8000/api/users/users/profile/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Payments

### Get Stripe Configuration

```bash
curl -X GET http://localhost:8000/api/payments/config/
```

### Create Payment Intent

```bash
curl -X POST http://localhost:8000/api/payments/create-intent/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "save_payment_method": true
  }'
```

Response:
```json
{
  "id": "uuid",
  "stripe_payment_intent_id": "pi_xxx",
  "amount": "100.00",
  "currency": "usd",
  "status": "requires_payment_method",
  "client_secret": "pi_xxx_secret_xxx"
}
```

### Confirm Payment Intent

```bash
curl -X POST http://localhost:8000/api/payments/confirm-intent/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_intent_id": "pi_xxx",
    "payment_method_id": "pm_xxx"
  }'
```

### Save Payment Method

```bash
curl -X POST http://localhost:8000/api/payments/save-method/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method_id": "pm_xxx",
    "set_as_primary": true
  }'
```

### List Payment Methods

```bash
curl -X GET http://localhost:8000/api/payments/methods/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Delete Payment Method

```bash
curl -X DELETE http://localhost:8000/api/payments/methods/pm_xxx/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Stripe Webhook (Server-to-Server)

```bash
curl -X POST http://localhost:8000/api/payments/webhook/ \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: t=timestamp,v1=signature" \
  -d '{
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_xxx",
        "amount": 10000,
        "status": "succeeded"
      }
    }
  }'
```

## Lotteries

### List Lotteries

```bash
curl -X GET "http://localhost:8000/api/lotteries/?status=ACTIVE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Lottery Details

```bash
curl -X GET http://localhost:8000/api/lotteries/LOTTERY_ID/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Buy Ticket

```bash
curl -X POST http://localhost:8000/api/lotteries/LOTTERY_ID/buy_ticket/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Lottery (Admin Only)

```bash
curl -X POST http://localhost:8000/api/lotteries/ \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekly Draw",
    "description": "Weekly lottery draw",
    "ticket_price": "10.00",
    "total_tickets": 100,
    "prize_amount": "500.00",
    "status": "ACTIVE",
    "draw_date": "2024-12-31T23:59:59Z"
  }'
```

## Transactions

### List Transactions

```bash
curl -X GET "http://localhost:8000/api/transactions/?type=DEPOSIT&start_date=2024-01-01&end_date=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Transaction Summary

```bash
curl -X GET http://localhost:8000/api/transactions/summary/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Transaction Receipt

```bash
curl -X GET http://localhost:8000/api/transactions/TRANSACTION_ID/receipt/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Withdrawals

### Create Withdrawal Request

```bash
curl -X POST http://localhost:8000/api/withdrawals/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "50.00",
    "bank_details": {
      "account_number": "123456789",
      "routing_number": "987654321",
      "account_name": "John Doe"
    }
  }'
```

### Approve Withdrawal (Admin Only)

```bash
curl -X POST http://localhost:8000/api/withdrawals/WITHDRAWAL_ID/approve/ \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "admin_notes": "Approved and processed"
  }'
```

## Referrals

### Get Referral Link

```bash
curl -X GET http://localhost:8000/api/referrals/link/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Referral Stats

```bash
curl -X GET http://localhost:8000/api/referrals/stats/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get My Referrals

```bash
curl -X GET http://localhost:8000/api/referrals/my_referrals/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Analytics (Admin Only)

### Get Dashboard Analytics

```bash
curl -X GET "http://localhost:8000/api/analytics/dashboard/?days=30" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### Get Financial Metrics

```bash
curl -X GET "http://localhost:8000/api/analytics/financial/?start_date=2024-01-01&end_date=2024-12-31" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

## Notifications

### List Notifications

```bash
curl -X GET http://localhost:8000/api/notifications/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Mark Notification as Read

```bash
curl -X POST http://localhost:8000/api/notifications/NOTIFICATION_ID/mark_read/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "detail": {
    "field_name": ["Error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "error": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "An error occurred processing your request"
}
```

## Authentication Flow Example

1. Register a new user
2. Login to get JWT token
3. Use token in Authorization header for all authenticated requests

```bash
# Step 1: Register
TOKEN=$(curl -s -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"Test123","password_confirm":"Test123"}' \
  | jq -r '.token')

# Step 2: Use token
curl -X GET http://localhost:8000/api/users/users/profile/ \
  -H "Authorization: Bearer $TOKEN"
```

## Pagination

Many list endpoints support pagination:

```bash
curl -X GET "http://localhost:8000/api/lotteries/?page=1&page_size=20" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response:
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/lotteries/?page=2",
  "previous": null,
  "results": [...]
}
```

## Filtering and Search

### Filter Lotteries by Status

```bash
curl -X GET "http://localhost:8000/api/lotteries/?status=ACTIVE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Search Transactions

```bash
curl -X GET "http://localhost:8000/api/transactions/?search=deposit" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Date Range Filtering

```bash
curl -X GET "http://localhost:8000/api/transactions/?start_date=2024-01-01&end_date=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

