# Admin Setup Guide

## Create Initial Admin User

You have 3 options to create the admin user with:
- **Email**: himanshu@gmail.com
- **Password**: himanshu@123

---

## Option 1: Using Setup Script (Recommended)

### Prerequisites
1. Install Firebase Admin SDK:
```bash
npm install firebase-admin --save-dev
```

2. Download Firebase Admin SDK private key:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `firebase-admin-key.json` in the project root
   - **IMPORTANT**: Add to `.gitignore` (already included)

### Run Setup Script
```bash
node scripts/setup-admin.js
```

This will create the user with admin role automatically.

---

## Option 2: Manual Setup via Firebase Console

### Step 1: Create User in Authentication
1. Go to Firebase Console
2. Navigate to **Authentication** → **Users**
3. Click **Add User**
4. Enter:
   - Email: `himanshu@gmail.com`
   - Password: `himanshu@123`
5. Copy the **User UID** that gets generated

### Step 2: Create Admin Document in Firestore
1. Go to **Firestore Database**
2. Navigate to or create the `users` collection
3. Click **Add Document**
4. Set **Document ID** to the User UID from Step 1
5. Add these fields:
   ```
   email: "himanshu@gmail.com"
   displayName: "Himanshu Dixit"
   role: "admin"
   photoURL: null
   phoneNumber: null
   addresses: []
   createdAt: (click "Add field" → timestamp → now)
   updatedAt: (click "Add field" → timestamp → now)
   ```
6. Click **Save**

---

## Option 3: Register Then Promote

### Step 1: Register via App
1. Run your app: `npm run dev`
2. Go to `/auth/register`
3. Sign up with:
   - Email: `himanshu@gmail.com`
   - Password: `himanshu@123`
   - Name: `Himanshu Dixit`

### Step 2: Promote to Admin (Choose A or B)

#### A. Using Script
```bash
node scripts/make-admin.js himanshu@gmail.com
```

#### B. Manually in Firestore
1. Go to Firestore Database
2. Find the `users` collection
3. Find the document with email `himanshu@gmail.com`
4. Edit the document
5. Change `role` field from `"user"` to `"admin"`
6. Save

---

## Verify Admin Access

1. Sign in at `/auth/login` with the credentials
2. You should see "Admin Dashboard" link in the user menu
3. Navigate to `/admin` to access the admin panel
4. You should have access to:
   - 📸 Banner Management
   - 📦 Product Management
   - 🛍️ Order Management
   - 👥 User Management

---

## Create Additional Admins

Use the make-admin script:
```bash
node scripts/make-admin.js another-admin@example.com
```

Or manually update the `role` field to `"admin"` in Firestore.

---

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `firebase-admin-key.json` to git
- Keep admin credentials secure
- Change default password after first login
- Use strong passwords for production

---

## Troubleshooting

### "Module not found: firebase-admin"
```bash
npm install firebase-admin --save-dev
```

### "Cannot find module '../firebase-admin-key.json'"
Download the service account key from Firebase Console as described above.

### "User already exists"
Use Option 2B or 3B to manually update the role in Firestore.

### "Permission denied"
Make sure Firestore rules are deployed:
```bash
npm run fb:deploy:rules
```

---

## Admin Features

Once logged in as admin, you can:

### Banner Management (`/admin/banners`)
- ✅ Upload image/video banners
- ✅ Set banner order and active status
- ✅ Add CTA buttons with links
- ✅ Preview before publishing

### Product Management (`/admin/products`)
- ✅ Add/Edit/Delete products
- ✅ Manage inventory and stock
- ✅ Upload product images
- ✅ Set sizes, colors, prices

### Order Management (`/admin/orders`)
- ✅ View all orders
- ✅ Update order status
- ✅ Add tracking numbers
- ✅ Process refunds

### User Management (`/admin/users`)
- ✅ View all users
- ✅ View user details
- ✅ Manage roles

---

Ready to launch! 🚀
