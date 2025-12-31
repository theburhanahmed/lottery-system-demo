# Lottery System - Complete API Documentation

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Users API](#users-api)
3. [Lotteries API](#lotteries-api)
4. [Tickets API](#tickets-api)
5. [Transactions API](#transactions-api)
6. [Payment Methods API](#payment-methods-api)
7. [Withdrawals API](#withdrawals-api)
8. [Error Handling](#error-handling)

## Base URL
```
http://localhost:8000/api/
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer {your_jwt_token}
```

### Get JWT Token (Login)

**POST** `/users/login/`

```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "wallet_balance": "1000.00",
    "is_admin": false
  }
}
```

---

## Users API

### Register New User

**POST** `/users/register/`

**Permissions:** Public (No auth required)

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "password_confirm": "password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully"
}
```

### Get User Profile

**GET** `/users/profile/`

**Permissions:** Authenticated

**Response:**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "first_name": "Test",
  "last_name": "User",
  "is_admin": false,
  "wallet_balance": "1000.00",
  "phone_number": "+1234567890",
  "date_of_birth": "1990-01-01",
  "address": "123 Main St",
  "city": "City",
  "country": "Country",
  "is_verified": false,
  "profile": {
    "total_spent": "150.00",
    "total_won": "500.00",
    "total_tickets_bought": 10,
    "total_lotteries_participated": 3,
    "total_wins": 1
  },
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```

### Update User Profile

**PUT** `/users/update_profile/`

**Permissions:** Authenticated

```json
{
  "first_name": "Updated",
  "phone_number": "+9876543210",
  "address": "456 New St"
}
```

### Get Wallet Balance

**GET** `/users/wallet/`

**Permissions:** Authenticated

**Response:**
```json
{
  "wallet_balance": "1000.00",
  "user_id": "1"
}
```

### Add Funds to Wallet

**POST** `/users/add_funds/`

**Permissions:** Authenticated

```json
{
  "amount": "100.00"
}
```

**Response:**
```json
{
  "message": "Funds added successfully",
  "wallet_balance": "1100.00"
}
```

### Get User Transactions

**GET** `/users/transactions/`

**Permissions:** Authenticated

**Query Parameters:**
- `type` - Filter by transaction type (TICKET_PURCHASE, DEPOSIT, WITHDRAWAL, PRIZE_CLAIM)
- `status` - Filter by status (PENDING, COMPLETED, FAILED)

**Response:**
```json
[
  {
    "id": 1,
    "type": "DEPOSIT",
    "amount": "100.00",
    "status": "COMPLETED",
    "description": "Deposited $100",
    "created_at": "2025-01-01T10:00:00Z"
  }
]
```

### Logout

**POST** `/users/logout/`

**Permissions:** Authenticated

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Lotteries API

### List All Lotteries

**GET** `/lotteries/`

**Permissions:** Public

**Query Parameters:**
- `status` - Filter by status (ACTIVE, CLOSED, DRAWN, COMPLETED)
- `ordering` - Sort by field (created_at, draw_date)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Weekly Lottery",
    "description": "Weekly lottery drawing",
    "ticket_price": "10.00",
    "total_tickets": 1000,
    "available_tickets": 850,
    "prize_amount": "5000.00",
    "status": "ACTIVE",
    "draw_date": "2025-01-08T00:00:00Z",
    "created_by": {
      "id": 1,
      "username": "admin"
    },
    "total_participants": 150,
    "total_tickets_sold": 150,
    "revenue": "1500.00",
    "created_at": "2025-01-01T10:00:00Z",
    "updated_at": "2025-01-01T10:00:00Z"
  }
]
```

### Get Lottery Details

**GET** `/lotteries/{id}/`

**Permissions:** Public

### Create Lottery (Admin Only)

**POST** `/lotteries/`

**Permissions:** Admin

```json
{
  "name": "New Lottery",
  "description": "Description of lottery",
  "ticket_price": "10.00",
  "total_tickets": 1000,
  "prize_amount": "5000.00",
  "status": "ACTIVE",
  "draw_date": "2025-01-08T00:00:00Z"
}
```

### Update Lottery (Admin Only)

**PUT** `/lotteries/{id}/`

**Permissions:** Admin

### Delete Lottery (Admin Only)

**DELETE** `/lotteries/{id}/`

**Permissions:** Admin

### Buy Lottery Ticket

**POST** `/lotteries/{id}/buy_ticket/`

**Permissions:** Authenticated

**Response (201 Created):**
```json
{
  "message": "Ticket purchased successfully",
  "ticket": {
    "id": 1,
    "ticket_number": 1,
    "is_winner": false,
    "purchased_at": "2025-01-01T10:00:00Z"
  }
}
```

### Get Lottery Results

**GET** `/lotteries/{id}/results/`

**Permissions:** Public

**Response:**
```json
{
  "lottery": { /* lottery object */ },
  "winners": [
    {
      "id": 1,
      "user": { /* user object */ },
      "prize_amount": "5000.00",
      "is_claimed": false,
      "announced_at": "2025-01-08T10:00:00Z"
    }
  ],
  "total_winners": 1
}
```

### Get Lottery Winner

**GET** `/lotteries/{id}/winner/`

**Permissions:** Public

### Conduct Lottery Draw (Admin Only)

**POST** `/lotteries/{id}/draw/`

**Permissions:** Admin

**Note:** Lottery must be CLOSED and draw_date must have passed

**Response:**
```json
{
  "message": "Draw conducted successfully",
  "winner": { /* winner object */ }
}
```

### Get My Tickets for Lottery

**GET** `/lotteries/{id}/my_tickets/`

**Permissions:** Authenticated

### Get Lottery Participants (Admin Only)

**GET** `/lotteries/{id}/participants/`

**Permissions:** Admin

**Response:**
```json
{
  "lottery": { /* lottery object */ },
  "total_participants": 150,
  "total_tickets": 150
}
```

### Get Lottery Stats (Admin Only)

**GET** `/lotteries/{id}/stats/`

**Permissions:** Admin

**Response:**
```json
{
  "lottery": { /* lottery object */ },
  "total_participants": 150,
  "total_tickets_sold": 150,
  "total_tickets_remaining": 850,
  "revenue": "1500.00",
  "revenue_percentage": "15.00%"
}
```

---

## Tickets API

### Get My Tickets

**GET** `/tickets/`

**Permissions:** Authenticated

**Query Parameters:**
- `ordering` - Sort by field (purchased_at)

**Response:**
```json
[
  {
    "id": 1,
    "user": { /* user object */ },
    "lottery": { /* lottery object */ },
    "ticket_number": 1,
    "is_winner": false,
    "purchased_at": "2025-01-01T10:00:00Z"
  }
]
```

### Get Ticket Details

**GET** `/tickets/{id}/`

**Permissions:** Authenticated

---

## Transactions API

### Get User Transactions

**GET** `/transactions/`

**Permissions:** Authenticated

**Query Parameters:**
- `type` - TICKET_PURCHASE, DEPOSIT, WITHDRAWAL, PRIZE_CLAIM
- `status` - PENDING, COMPLETED, FAILED
- `ordering` - created_at, amount

**Response:**
```json
[
  {
    "id": 1,
    "user": { /* user object */ },
    "type": "TICKET_PURCHASE",
    "amount": "10.00",
    "status": "COMPLETED",
    "description": "Bought ticket #1 for Weekly Lottery",
    "lottery": { /* lottery object */ },
    "created_at": "2025-01-01T10:00:00Z"
  }
]
```

### Get Transaction Summary

**GET** `/transactions/summary/`

**Permissions:** Authenticated

**Response:**
```json
{
  "total_transactions": 10,
  "total_spent": "100.00",
  "total_earned": "500.00",
  "total_deposits": "1000.00",
  "net_balance": "1400.00"
}
```

---

## Payment Methods API

### List Payment Methods

**GET** `/payment-methods/`

**Permissions:** Authenticated

**Response:**
```json
[
  {
    "id": 1,
    "name": "My Bank Account",
    "type": "BANK_TRANSFER",
    "account_number": "****1234",
    "is_primary": true,
    "is_verified": true,
    "created_at": "2025-01-01T10:00:00Z"
  }
]
```

### Add Payment Method

**POST** `/payment-methods/`

**Permissions:** Authenticated

```json
{
  "name": "My Bank Account",
  "type": "BANK_TRANSFER",
  "account_number": "1234567890"
}
```

### Update Payment Method

**PUT** `/payment-methods/{id}/`

**Permissions:** Authenticated

### Delete Payment Method

**DELETE** `/payment-methods/{id}/`

**Permissions:** Authenticated

### Set Primary Payment Method

**POST** `/payment-methods/{id}/set_primary/`

**Permissions:** Authenticated

**Response:**
```json
{
  "message": "Payment method set as primary"
}
```

---

## Withdrawals API

### Request Withdrawal

**POST** `/withdrawals/`

**Permissions:** Authenticated

```json
{
  "amount": "100.00",
  "payment_method": 1
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user": { /* user object */ },
  "amount": "100.00",
  "status": "PENDING",
  "payment_method": { /* payment method object */ },
  "requested_at": "2025-01-01T10:00:00Z",
  "processed_at": null
}
```

### Get Withdrawals

**GET** `/withdrawals/`

**Permissions:** Authenticated

### Get Withdrawal Details

**GET** `/withdrawals/{id}/`

**Permissions:** Authenticated

### Approve Withdrawal (Admin Only)

**POST** `/withdrawals/{id}/approve/`

**Permissions:** Admin

**Response:**
```json
{
  "message": "Withdrawal approved",
  "withdrawal": { /* withdrawal object */ }
}
```

### Reject Withdrawal (Admin Only)

**POST** `/withdrawals/{id}/reject/`

**Permissions:** Admin

**Response:**
```json
{
  "message": "Withdrawal rejected",
  "withdrawal": { /* withdrawal object */ }
}
```

---

## Error Handling

All errors follow a standard format:

### Authentication Error (401)
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Permission Error (403)
```json
{
  "error": "Only admins can create lotteries"
}
```

### Not Found Error (404)
```json
{
  "detail": "Not found."
}
```

### Validation Error (400)
```json
{
  "username": ["This field may not be blank."],
  "password": ["This field may not be blank."]
}
```

### Server Error (500)
```json
{
  "detail": "Internal server error"
}
```

---

## Status Codes

| Code | Meaning |
|------|----------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## Example cURL Commands

### Register
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "password_confirm": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Get Lotteries
```bash
curl http://localhost:8000/api/lotteries/ \
  -H "Authorization: Bearer {token}"
```

### Buy Ticket
```bash
curl -X POST http://localhost:8000/api/lotteries/1/buy_ticket/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

### Request Withdrawal
```bash
curl -X POST http://localhost:8000/api/withdrawals/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "100.00",
    "payment_method": 1
  }'
```

---

**Last Updated:** January 1, 2026
**API Version:** 1.0.0
