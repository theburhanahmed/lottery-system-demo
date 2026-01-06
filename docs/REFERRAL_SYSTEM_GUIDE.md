# 🎁 Referral Bonus System - Complete Guide

**Status**: ✅ Fully Implemented
**Version**: 1.0
**Date**: January 1, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Admin Features](#admin-features)
4. [User Features](#user-features)
5. [API Endpoints](#api-endpoints)
6. [Database Models](#database-models)
7. [Setup & Configuration](#setup--configuration)
8. [Usage Examples](#usage-examples)
9. [Admin Panel Guide](#admin-panel-guide)
10. [Withdrawal Process](#withdrawal-process)
11. [Troubleshooting](#troubleshooting)

---

## Overview

The Referral Bonus System allows users to:
- 🔗 Share unique referral links with others
- 💰 Earn bonuses when people register using their link
- 📊 Track referrals and bonuses in real-time
- 💳 Request withdrawals of earned bonuses
- 👁️ Monitor referral statistics and performance

Admins can:
- ⚙️ Configure bonus amounts
- 🎮 Control program activation
- ✅ Approve/reject referrals
- 💰 Manage withdrawal requests
- 📈 View comprehensive referral statistics

---

## System Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                   Referral System                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  ReferralProgram │◄────────┤ ReferralLink     │          │
│  │  (Settings)      │         │ (User Codes)     │          │
│  └──────────────────┘         └──────────────────┘          │
│          ▲                              ▲                     │
│          │                              │                     │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │   Referral       │◄────────┤  ReferralBonus   │          │
│  │   (Tracking)     │         │  (Credits)       │          │
│  └──────────────────┘         └──────────────────┘          │
│          ▲                                                     │
│          │                                                     │
│  ┌──────────────────────────────────────────┐               │
│  │    ReferralWithdrawal                    │               │
│  │    (Withdrawal Requests & Management)    │               │
│  └──────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. User Registers
   ↓
2. Referral Link Created Automatically
   ↓
3. User Shares Link (ref=CODE)
   ↓
4. New User Registers with Link
   ↓
5. Referral Created (PENDING)
   ↓
6. Admin Approves/Rejects
   ↓
7. If Approved → Bonuses Created
   ↓
8. Bonuses Available for Withdrawal
   ↓
9. User Requests Withdrawal
   ↓
10. Admin Approves/Rejects Withdrawal
    ↓
11. Funds Transferred
```

---

## Admin Features

### 1. Program Configuration

**Location**: Django Admin → Referral Program → Current

**Configurable Settings**:

| Setting | Default | Description |
|---------|---------|-------------|
| **Status** | ACTIVE | Enable/disable entire program |
| **Referrer Bonus** | $50.00 | Bonus for person who referred |
| **Referred Bonus** | $25.00 | Bonus for new user |
| **Min Deposit** | $0.00 | Required deposit to qualify |
| **Bonus Expiry** | 30 days | Days before unclaimed bonus expires |
| **Min Withdraw** | $100.00 | Minimum balance to withdraw |
| **Max Withdrawals/Month** | 12 | Monthly withdrawal limit |

**How to Configure**:

```bash
# Go to Admin Panel
http://localhost:8000/admin/

# Navigate to Referral Program
Referral Bonus System → Referral Program

# Edit the settings
# Example: Set referral bonus to $75
referral_bonus_amount = 75.00

# Save changes
```

### 2. Referral Management

**Location**: Django Admin → Referrals

**Features**:
- View all referrals with detailed info
- Filter by status (PENDING, QUALIFIED, BONUS_AWARDED, REJECTED)
- Approve/reject referrals in bulk
- View referral details and tracking
- Monitor expiry dates
- Add rejection notes

**Actions**:
```bash
# Approve referrals
Select referrals → "Approve selected referrals" → Go

# Reject referrals
Select referrals → "Reject selected referrals" → Go
```

### 3. Withdrawal Management

**Location**: Django Admin → Referral Withdrawals

**Features**:
- View pending withdrawal requests
- Approve/reject withdrawals
- Mark as processing/completed
- Add admin notes
- View user and amount info

**Withdrawal Statuses**:
- **PENDING**: Awaiting admin approval
- **APPROVED**: Approved, ready to process
- **PROCESSING**: Being processed
- **COMPLETED**: Successfully transferred
- **REJECTED**: Request rejected
- **CANCELLED**: User cancelled

**Process Withdrawal**:
```
1. View pending withdrawals
2. Select withdrawal request
3. Click "Approve withdrawals"
4. Click "Mark as processing"
5. Process payment (external)
6. Click "Mark as completed"
```

### 4. Bonus Tracking

**Location**: Django Admin → Referral Bonuses

**View**:
- Individual bonus records
- User who received bonus
- Bonus type (referrer/referred)
- Current status
- Amount

### 5. Referral Links

**Location**: Django Admin → Referral Links

**View**:
- All user referral codes
- Total referrals per user
- Total bonus earned
- Total link clicks
- Creation date

---

## User Features

### 1. Get Referral Link

**Endpoint**: `GET /api/referrals/links/my_link/`

**Response**:
```json
{
  "id": 1,
  "username": "john_doe",
  "referral_code": "20265A7B3C9D2E",
  "referral_url": "https://yourdomain.com/register?ref=20265A7B3C9D2E",
  "total_referred": 5,
  "total_bonus_earned": 250.00,
  "total_referrals_clicked": 12,
  "created_at": "2026-01-01T10:00:00Z",
  "updated_at": "2026-01-05T14:30:00Z"
}
```

### 2. View Referral Statistics

**Endpoint**: `GET /api/referrals/referrals/stats/`

**Response**:
```json
{
  "total_referred": 5,
  "total_bonus_earned": 250.00,
  "pending_referrals": 2,
  "qualified_referrals": 3,
  "available_balance": 150.00,
  "pending_withdrawals": 50.00,
  "total_withdrawn": 100.00,
  "referral_code": "20265A7B3C9D2E",
  "referral_url": "/register?ref=20265A7B3C9D2E"
}
```

### 3. View My Referrals

**Endpoint**: `GET /api/referrals/referrals/my_referrals/`

**Response**:
```json
[
  {
    "id": 1,
    "referrer_username": "john_doe",
    "referred_username": "jane_smith",
    "referred_email": "jane@example.com",
    "status": "BONUS_AWARDED",
    "referrer_bonus": 50.00,
    "referred_user_bonus": 25.00,
    "bonus_awarded_at": "2026-01-02T11:00:00Z",
    "referred_user_deposit": 100.00,
    "deposit_date": "2026-01-02T10:30:00Z",
    "days_until_expiry": null,
    "created_at": "2026-01-01T10:00:00Z",
    "updated_at": "2026-01-02T11:00:00Z"
  }
]
```

### 4. View Bonuses

**Endpoint**: `GET /api/referrals/bonuses/available/`

**Response**:
```json
{
  "available_balance": 150.00,
  "bonuses": [
    {
      "id": 1,
      "username": "john_doe",
      "referrer": "john_doe",
      "referred": "jane_smith",
      "bonus_type": "REFERRER",
      "amount": 50.00,
      "status": "CREDITED",
      "credited_at": "2026-01-02T11:00:00Z",
      "created_at": "2026-01-02T11:00:00Z"
    },
    {
      "id": 2,
      "username": "john_doe",
      "referrer": "john_doe",
      "referred": "bob_johnson",
      "bonus_type": "REFERRER",
      "amount": 100.00,
      "status": "CREDITED",
      "credited_at": "2026-01-03T09:00:00Z",
      "created_at": "2026-01-03T09:00:00Z"
    }
  ]
}
```

### 5. Request Withdrawal

**Endpoint**: `POST /api/referrals/withdrawals/`

**Request**:
```json
{
  "amount": 100.00,
  "payment_method": "bank_transfer"
}
```

**Response**:
```json
{
  "id": 1,
  "amount": 100.00,
  "status": "PENDING",
  "payment_method": "bank_transfer",
  "available_balance": 150.00,
  "created_at": "2026-01-05T15:00:00Z"
}
```

### 6. View Withdrawal History

**Endpoint**: `GET /api/referrals/withdrawals/my_withdrawals/`

**Response**:
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "amount": 100.00,
    "status": "COMPLETED",
    "payment_method": "bank_transfer",
    "processed_by_username": "admin",
    "processed_at": "2026-01-05T16:00:00Z",
    "created_at": "2026-01-05T15:00:00Z"
  }
]
```

---

## API Endpoints

### Referral Program (Admin Only)

```
GET    /api/referrals/programs/              # List all
POST   /api/referrals/programs/              # Create
GET    /api/referrals/programs/{id}/         # Get details
PUT    /api/referrals/programs/{id}/         # Update
DELETE /api/referrals/programs/{id}/         # Delete
GET    /api/referrals/programs/current/      # Get current settings
```

### Referral Links

```
GET    /api/referrals/links/                 # List my links
GET    /api/referrals/links/{id}/            # Get link details
GET    /api/referrals/links/my_link/         # Get my referral link
```

### Referrals

```
GET    /api/referrals/referrals/             # List referrals
GET    /api/referrals/referrals/{id}/        # Get referral details
GET    /api/referrals/referrals/my_referrals/ # Get my referrals
GET    /api/referrals/referrals/stats/       # Get referral stats
POST   /api/referrals/referrals/{id}/approve/ # Approve (admin)
POST   /api/referrals/referrals/{id}/reject/  # Reject (admin)
```

### Referral Bonuses

```
GET    /api/referrals/bonuses/               # List bonuses
GET    /api/referrals/bonuses/{id}/          # Get bonus details
GET    /api/referrals/bonuses/my_bonuses/    # Get my bonuses
GET    /api/referrals/bonuses/available/     # Get available balance
```

### Referral Withdrawals

```
GET    /api/referrals/withdrawals/           # List withdrawals (admin or own)
POST   /api/referrals/withdrawals/           # Create withdrawal request
GET    /api/referrals/withdrawals/{id}/      # Get withdrawal details
PUT    /api/referrals/withdrawals/{id}/      # Update withdrawal
POST   /api/referrals/withdrawals/{id}/approve/  # Approve (admin)
POST   /api/referrals/withdrawals/{id}/reject/   # Reject (admin)
POST   /api/referrals/withdrawals/{id}/complete/ # Mark completed (admin)
GET    /api/referrals/withdrawals/pending/   # Get pending (admin)
GET    /api/referrals/withdrawals/my_withdrawals/ # Get my withdrawals
```

---

## Database Models

### ReferralProgram
Global configuration for the referral system.
- `status`: ACTIVE, INACTIVE, PAUSED
- `referral_bonus_amount`: Amount for referrer
- `referred_user_bonus`: Amount for new user
- `minimum_referral_deposit`: Deposit requirement
- `bonus_expiry_days`: Expiration period
- `min_referral_balance_to_withdraw`: Minimum balance
- `max_withdrawals_per_month`: Withdrawal limit

### ReferralLink
Unique referral code for each user.
- `user`: ForeignKey to User
- `referral_code`: Unique code (e.g., "20265A7B3C9D2E")
- `total_referred`: Count of successful referrals
- `total_bonus_earned`: Total bonus amount
- `total_referrals_clicked`: Link click count

### Referral
Individual referral record.
- `referrer`: User who made the referral
- `referred_user`: User who was referred
- `status`: PENDING, QUALIFIED, BONUS_AWARDED, REJECTED, CANCELLED
- `referrer_bonus`: Bonus for referrer
- `referred_user_bonus`: Bonus for referred user
- `bonus_awarded_at`: When bonus was given
- `referred_user_deposit`: Deposit amount (if required)
- `deposit_date`: When requirement was met
- `expires_at`: Bonus expiration date

### ReferralBonus
Individual bonus credit.
- `user`: User who received bonus
- `referral`: ForeignKey to Referral
- `bonus_type`: REFERRER or REFERRED
- `amount`: Bonus amount
- `status`: PENDING, CREDITED, EXPIRED, WITHDRAWN
- `credited_at`: When credited

### ReferralWithdrawal
Withdrawal request tracking.
- `user`: User requesting withdrawal
- `amount`: Withdrawal amount
- `status`: PENDING, APPROVED, PROCESSING, COMPLETED, REJECTED, CANCELLED
- `payment_method`: How to pay (bank, wallet, etc.)
- `processed_by`: Admin who processed
- `processed_at`: When processed
- `admin_notes`: Admin comments
- `rejection_reason`: Why rejected (if applicable)

---

## Setup & Configuration

### 1. Install the App

**Add to settings.py**:
```python
INSTALLED_APPS = [
    # ...
    'apps.referrals',
]
```

### 2. Run Migrations

```bash
python manage.py makemigrations referrals
python manage.py migrate referrals
```

### 3. Update Main URLs

**In lotteryproject/urls.py**:
```python
from django.urls import path, include

urlpatterns = [
    # ... other patterns
    path('api/referrals/', include('apps.referrals.urls')),
]
```

### 4. Configure Program (Admin)

```
1. Go to http://localhost:8000/admin/
2. Navigate to "Referral Program"
3. Edit settings:
   - Set bonus amounts
   - Set withdrawal limits
   - Configure expiry dates
4. Save
```

### 5. Create Superuser (if needed)

```bash
python manage.py createsuperuser
```

---

## Usage Examples

### Example 1: User Gets Referral Link

```bash
# User logs in and gets their link
GET /api/referrals/links/my_link/
Header: Authorization: Bearer <token>

Response:
{
  "referral_code": "20265A7B3C9D2E",
  "referral_url": "https://yourdomain.com/register?ref=20265A7B3C9D2E",
  "total_referred": 0
}

# User shares link on social media:
# "Join our lottery system and get a $25 bonus!
#  https://yourdomain.com/register?ref=20265A7B3C9D2E"
```

### Example 2: New User Registers with Link

```bash
# New user registers using link
POST /api/users/register/
Body: {
  "username": "jane_smith",
  "email": "jane@example.com",
  "password": "securepass123",
  "referral_code": "20265A7B3C9D2E"  # From link
}

# System automatically:
# 1. Creates user
# 2. Creates referral record (PENDING)
# 3. Waits for admin approval
```

### Example 3: Admin Approves Referral

```bash
# Admin approves the referral
POST /api/referrals/referrals/1/approve/
Header: Authorization: Bearer <admin_token>

# System:
# 1. Changes status to BONUS_AWARDED
# 2. Creates bonus for referrer ($50)
# 3. Creates bonus for referred user ($25)
# 4. Updates referral link stats
```

### Example 4: User Requests Withdrawal

```bash
# User checks available balance
GET /api/referrals/bonuses/available/
Header: Authorization: Bearer <token>

Response:
{
  "available_balance": 250.00,
  "bonuses": [...]
}

# User requests withdrawal
POST /api/referrals/withdrawals/
Header: Authorization: Bearer <token>
Body: {
  "amount": 200.00,
  "payment_method": "bank_transfer"
}

Response:
{
  "id": 1,
  "status": "PENDING",
  "amount": 200.00,
  "created_at": "2026-01-05T15:00:00Z"
}
```

### Example 5: Admin Processes Withdrawal

```bash
# Admin approves
POST /api/referrals/withdrawals/1/approve/
Header: Authorization: Bearer <admin_token>

# Admin marks as processing
POST /api/referrals/withdrawals/1/processing/
Header: Authorization: Bearer <admin_token>

# (Payment processed externally)

# Admin marks as completed
POST /api/referrals/withdrawals/1/complete/
Header: Authorization: Bearer <admin_token>

# Funds are now transferred to user
```

---

## Admin Panel Guide

### Access Admin Panel

```
URL: http://localhost:8000/admin/
Login: Use superuser credentials
```

### Referral Program Settings

1. Click "Referral Program" under Referral Bonus System
2. Click "Current" to edit settings
3. Adjust values:
   ```
   Referrer Bonus: How much existing user gets (e.g., $50)
   Referred User Bonus: How much new user gets (e.g., $25)
   Min Deposit: Required to qualify (e.g., $0)
   Bonus Expiry: Days before expires (e.g., 30)
   Min Withdraw: Minimum to withdraw (e.g., $100)
   Max Withdrawals/Month: Limit per user (e.g., 12)
   ```
4. Save changes

### Manage Referrals

1. Click "Referrals" under Referral Bonus System
2. View all referrals with status
3. Filter by status:
   - **PENDING**: Not yet approved
   - **BONUS_AWARDED**: Bonus given
   - **REJECTED**: Admin rejected
4. Select referrals
5. Use bulk actions:
   - "Approve selected referrals"
   - "Reject selected referrals"
6. Click "Go"

### Manage Withdrawals

1. Click "Referral Withdrawals" under Referral Bonus System
2. Filter by status:
   - **PENDING**: Awaiting approval
   - **APPROVED**: Approved, ready to process
   - **PROCESSING**: Being processed
   - **COMPLETED**: Done
   - **REJECTED**: Rejected
3. Select withdrawal
4. Choose action:
   - "Approve withdrawals"
   - "Reject withdrawals"
   - "Mark as processing"
   - "Mark as completed"
5. Add notes if needed
6. Save

---

## Withdrawal Process

### User Perspective

```
1. Check Available Balance
   ↓
2. Request Withdrawal (Amount + Payment Method)
   ↓
3. Wait for Admin Approval
   ↓
4. Status Changes to APPROVED
   ↓
5. Check Status (PROCESSING)
   ↓
6. Funds Received (COMPLETED)
```

### Admin Perspective

```
1. View Pending Withdrawals
   ↓
2. Review Request (Amount, User, Method)
   ↓
3. Approve or Reject
   ↓
4. If Approved:
   a. Mark as PROCESSING
   b. Process payment externally
   c. Mark as COMPLETED
   ↓
5. User receives funds
```

### Validation Rules

- Amount must be > 0
- Amount must meet minimum withdrawal
- User must have available balance
- Cannot exceed monthly withdrawal limit
- Only PENDING/APPROVED can be rejected
- Only APPROVED/PROCESSING can be completed

---

## Troubleshooting

### "Insufficient balance" Error

**Problem**: User trying to withdraw more than available

**Solution**:
1. Check available balance: `GET /api/referrals/bonuses/available/`
2. Request only available amount
3. Wait for more bonuses if needed

### Referral Stays PENDING

**Problem**: Referral not approved by admin

**Solution**:
1. Admin must review and approve
2. Check minimum deposit requirement met
3. Check if program is ACTIVE
4. Referral expires after 30 days (configurable)

### Withdrawal Not Completing

**Problem**: Withdrawal stuck in PROCESSING

**Solution**:
1. Admin must mark as COMPLETED
2. Verify payment method is correct
3. Check if limit reached (max per month)
4. Contact admin for status

### No Referral Link Created

**Problem**: User doesn't have referral link

**Solution**:
1. New users get link automatically on registration
2. If missing, admin can:
   ```python
   from apps.referrals.models import ReferralLink
   from apps.referrals.signals import generate_referral_code
   
   code = generate_referral_code()
   ReferralLink.objects.create(
       user=user,
       referral_code=code
   )
   ```

### "Program not active" Error

**Problem**: Referrals can't be approved

**Solution**:
1. Admin → Referral Program → Current
2. Change status from INACTIVE to ACTIVE
3. Save
4. Try again

---

## Key Features

✅ **Fully Configurable**
- Admin controls all bonus amounts
- Configurable expiry dates
- Withdrawal limits
- Deposit requirements

✅ **Secure**
- JWT authentication required
- Admin-only operations protected
- User data isolation
- Withdrawal validation

✅ **Tracking & Analytics**
- Track all referrals
- Monitor bonuses
- View withdrawal history
- Statistics per user

✅ **Flexible Withdrawals**
- Multiple payment methods
- Admin approval workflow
- Detailed status tracking
- Notes and reasons

✅ **Automatic Setup**
- Referral links auto-created for users
- Bonuses auto-credited
- Expiry auto-managed
- Link tracking automatic

---

## Summary

The Referral Bonus System provides a complete, production-ready solution for:
- User referral tracking
- Bonus management
- Withdrawal processing
- Admin control and configuration

With comprehensive API endpoints, admin interface, and user features, it's ready to deploy and use immediately.

---

**For API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
**For Setup Guide**: See [SETUP.md](./SETUP.md)
**For Integration Guide**: See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
