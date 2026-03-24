# NeuroCalm - Frontend/Backend API Gap Analysis

> Generated: 2026-03-20
> Updated: 2026-03-20 (backend gaps fixed)

---

## Critical Finding: Frontend Uses Mock Data Everywhere

The frontend has proper API service files (`authService.js`, `analysisService.js`, `adminService.js`) that define real HTTP calls to the backend, but **none of them are actually imported or used** by any page, hook, or component. All three hooks use hardcoded mock data instead:

| Hook | Service File (unused) | Current State |
|---|---|---|
| `useAuth.js` | `authService.js` | Hardcoded `MOCK_USERS` array, fake login/register |
| `useAnalysis.js` | `analysisService.js` | Hardcoded `MOCK_HISTORY`, fake upload with `setTimeout` |
| `useAdmin.js` | `adminService.js` | Hardcoded `MOCK_STATS`, `MOCK_USERS`, `MOCK_MODEL` |

---

## Backend Status: ALL ENDPOINTS IMPLEMENTED

All backend APIs are now in place. Below is the full endpoint list and what remains on the frontend side.

### New Backend Endpoints Added

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `POST` | `/api/v1/auth/forgot-password` | Generate password reset token | DONE |
| `POST` | `/api/v1/auth/reset-password` | Reset password with token | DONE |
| `GET` | `/api/v1/users/me/notifications` | Get notification preferences | DONE |
| `PUT` | `/api/v1/users/me/notifications` | Update notification preferences | DONE |
| `GET` | `/api/v1/admin/analyses` | List all analyses (paginated, searchable) | DONE |
| `GET` | `/api/v1/admin/analytics` | Daily counts, stress distribution, totals | DONE |
| `GET` | `/api/v1/admin/server` | Real CPU/mem/disk/network + services + logs | DONE |
| `GET` | `/api/v1/admin/settings` | Get system settings | DONE |
| `PUT` | `/api/v1/admin/settings` | Update system settings | DONE |

### Backend Fixes Applied

| Issue | Fix | Status |
|-------|-----|--------|
| PDF report returned `.txt` plain text | Replaced with `fpdf2` real PDF generation with colors, bars, styling | DONE |

### New Backend Models Added

| Model | Table | Description |
|-------|-------|-------------|
| `NotificationPreference` | `notification_preferences` | Per-user email/analysis/weekly toggle |
| `SystemSettings` | `system_settings` | Maintenance mode, registration, rate limits, storage, auto-delete |
| `PasswordResetToken` | `password_reset_tokens` | Hashed tokens with expiry for password reset flow |

### New Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `fpdf2` | 2.8.2 | PDF report generation |
| `psutil` | 6.1.1 | Real-time server resource monitoring |

---

## Remaining Frontend Deliverables

These are frontend-only tasks. The backend for all of them is now complete.

### 1. Wire Hooks to Real API Services (P0)

- [ ] **`useAuth.js`** - Replace mock login/register/session with calls to `authService.login()`, `authService.register()`, `authService.getMe()`, `authService.refreshToken()`
- [ ] **`useAnalysis.js`** - Replace mock upload/history/delete with calls to `analysisService.upload()`, `analysisService.getAnalysis()`, `analysisService.getHistory()`, `analysisService.deleteAnalysis()`
- [ ] **`useAdmin.js`** - Replace mock stats/users/model with calls to `adminService.getStats()`, `adminService.getUsers()`, `adminService.getModelInfo()`, `adminService.deleteUser()`

### 2. Settings Page Wiring (P1)

- [ ] Add `changePassword(currentPassword, newPassword)` to `authService.js`
- [ ] Wire Security tab form in `SettingsPage.jsx` to call the password change API
- [ ] Wire Profile tab "Save Changes" button in `SettingsPage.jsx` to call `authService.updateMe()`
- [ ] Add `getNotifications()` and `updateNotifications()` to `authService.js`
- [ ] Wire Notifications tab toggles in `SettingsPage.jsx` to call the notifications API

### 3. Admin Pages Wiring (P2)

- [ ] Add `getAnalyses(page, pageSize, search)` to `adminService.js`
- [ ] Wire `AdminAnalyses.jsx` to call `GET /api/v1/admin/analyses`
- [ ] Add `getAnalytics()` to `adminService.js`
- [ ] Wire `AdminAnalytics.jsx` to call `GET /api/v1/admin/analytics`
- [ ] Add `getServerStatus()` to `adminService.js`
- [ ] Wire `AdminServer.jsx` to call `GET /api/v1/admin/server`
- [ ] Add `getSettings()` and `updateSettings()` to `adminService.js`
- [ ] Wire `AdminSettings.jsx` to call `GET/PUT /api/v1/admin/settings`

### 4. Forgot Password Flow (P2)

- [ ] Create `ForgotPasswordPage.jsx` with email form calling `POST /api/v1/auth/forgot-password`
- [ ] Create `ResetPasswordPage.jsx` with new password form calling `POST /api/v1/auth/reset-password`
- [ ] Add routes in `App.jsx`
- [ ] Wire the "Forgot password?" link in `LoginForm.jsx`

---

## Summary

| Category | Backend | Frontend |
|---|---|---|
| Core API endpoints (auth, analysis, history, reports, admin) | DONE | Mock data - needs wiring |
| Notification preferences | DONE | Needs service + UI wiring |
| Admin analyses listing | DONE | Needs service + UI wiring |
| Admin analytics | DONE | Needs service + UI wiring |
| Admin server monitoring | DONE | Needs service + UI wiring |
| Admin system settings | DONE | Needs service + UI wiring |
| PDF report generation | DONE (real PDF) | Already calls the endpoint |
| Forgot/reset password | DONE | Needs pages + routing |
| File storage | DONE (local `uploads/` dir) | N/A |
