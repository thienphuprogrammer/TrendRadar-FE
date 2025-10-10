# Test Users & Quick Start Guide

## 🔑 Test User Credentials

Use these accounts to test different permission levels:

### Admin Account
```
Email: admin@trendradar.com
Password: admin123
Role: Admin
Permissions: Full system access - ALL features available
```

### Account Owner
```
Email: owner@company.com
Password: owner123
Role: Account Owner
Permissions: Full business access except system role management
```

### Analyst
```
Email: analyst@company.com
Password: analyst123
Role: Analyst
Permissions: Analysis, content creation, reporting (no user/billing management)
```

### Viewer
```
Email: viewer@company.com
Password: viewer123
Role: Viewer
Permissions: Read-only access to dashboards and reports
```

---

## 🚀 Quick Start

### 1. Access the Application
- **Landing Page**: http://localhost:3000/landing
- **Login**: http://localhost:3000/auth/login
- **Register**: http://localhost:3000/auth/register
- **Dashboard**: http://localhost:3000/

### 2. Test Different Roles

**As Admin:**
- Access all pages
- Manage users and roles
- View audit logs
- Configure system settings
- All export and automation features

**As Account Owner:**
- Access all business features
- Manage team members (cannot change system roles)
- View billing and usage
- Configure integrations
- Schedule reports

**As Analyst:**
- View and analyze trends
- Create and edit reports
- Generate content
- Upload data to Data Lab
- Export to PDF/Excel
- Configure personal alerts

**As Viewer:**
- View dashboards
- View trends and analytics
- View reports
- Receive notifications
- No export, edit, or admin features

### 3. Key Features to Test

**Dashboard Page** (`/`)
- View KPIs and metrics
- Click "Refresh" to update data
- Click "Save Layout" to save configuration
- Click "Share" to generate share link (Analyst+)

**Trend Explorer** (`/trends`)
- Browse trending hashtags
- Click "Analyze" for detailed insights
- Click "Target" to add to tracking
- Click "Compare" for side-by-side comparison (Analyst+)
- Click "Export CSV" to download data (Analyst+)
- Click "Forecast" for AI predictions (Analyst+)

**Data Lab** (`/data-lab`)
- Upload CSV/Excel files (Analyst+)
- View AI-suggested charts
- Create custom visualizations
- Export clean data

**Content Studio** (`/content`)
- Generate AI captions (Analyst+)
- Create A/B test variants (Analyst+)
- Schedule posts to social media (Analyst+)
- Save content templates

**Reports & Export** (`/reports`)
- Choose report template
- Customize sections
- Preview report
- Export to PDF/PowerPoint/Excel (Analyst+)
- Schedule automated delivery (Analyst+)

**Action Center** (`/actions`)
- View smart recommendations
- Apply actions (Analyst+)
- Import products (Analyst+)
- Configure automation (Owner+)

**Users & Roles** (`/users`) - Admin/Owner only
- View all team members
- Add new users
- Change roles and permissions
- View audit log
- Remove users

**Integrations** (`/integrations`) - Owner+ only
- Connect TikTok, Shopee, Instagram, etc.
- Configure sync settings
- Refresh data
- Manage API connections

**Billing & Plans** (`/billing`) - Owner+ only
- View current plan
- Usage metrics
- Upgrade/downgrade
- Payment history

---

## 🎯 Permission Matrix Quick Reference

| Feature | Admin | Owner | Analyst | Viewer |
|---------|-------|-------|---------|--------|
| View Dashboard | ✅ | ✅ | ✅ | ✅ |
| View Analytics | ✅ | ✅ | ✅ | ✅ |
| Export PDF | ✅ | ✅ | ✅ | ❌ |
| Export Excel | ✅ | ✅ | ✅ | ❌ |
| Export PowerPoint | ✅ | ✅ | ❌ | ❌ |
| Create Reports | ✅ | ✅ | ✅ | ❌ |
| Schedule Reports | ✅ | ✅ | ✅ | ❌ |
| Generate Content | ✅ | ✅ | ✅ | ❌ |
| Schedule Posts | ✅ | ✅ | ✅ | ❌ |
| Upload Data | ✅ | ✅ | ✅ | ❌ |
| Analyze Trends | ✅ | ✅ | ✅ | ❌ |
| Forecast Trends | ✅ | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ✅ | ❌ | ❌ |
| Manage Roles | ✅ | ❌ | ❌ | ❌ |
| View Audit Log | ✅ | ✅ | ❌ | ❌ |
| Manage Integrations | ✅ | ✅ | ❌ | ❌ |
| Manage Billing | ✅ | ✅ | ❌ | ❌ |
| Run Automation | ✅ | ✅ | ❌ | ❌ |
| Apply Actions | ✅ | ✅ | ✅ | ❌ |

---

## 🧪 Testing Scenarios

### Scenario 1: New User Registration
1. Go to `/auth/register`
2. Fill in details
3. Choose role (Account Owner, Analyst, or Viewer)
4. Register and verify you can login
5. Check that menu items match your role

### Scenario 2: Role-Based Access
1. Login as Viewer
2. Note which menu items are visible
3. Try accessing Admin pages - should be blocked
4. Logout and login as Analyst
5. Notice additional menu items and features
6. Repeat for Owner and Admin

### Scenario 3: Audit Logging
1. Login as Admin
2. Go to Users & Roles
3. Perform actions (edit user, change role)
4. View Audit Log tab
5. Verify your actions are logged

### Scenario 4: Export Features
1. Login as Analyst
2. Go to Trend Explorer
3. Click "Export CSV" - should work
4. Logout and login as Viewer
5. Export button should not be visible

### Scenario 5: Landing Page
1. Visit `/landing` (logged out)
2. Scroll through all sections
3. Test all animations and interactions
4. Click CTAs to go to auth pages
5. Verify responsive design on mobile

---

## 🐛 Troubleshooting

### Can't Login?
- Make sure you're using correct credentials
- Check console for errors
- Verify Supabase connection in .env

### Menu Items Missing?
- Check your user role
- Verify permissions in `lib/auth.ts`
- Some items only show for Admin/Owner

### Buttons Don't Work?
- Check browser console for errors
- Verify API routes are running
- Check network tab for failed requests

### Animations Not Working?
- Check if `prefers-reduced-motion` is enabled
- Verify Framer Motion is installed
- Clear browser cache

---

## 📞 Support

For issues or questions:
1. Check console for error messages
2. Review IMPLEMENTATION_SUMMARY.md
3. Check database schema in Supabase dashboard
4. Review code comments in source files

---

**Happy Testing! 🚀**
