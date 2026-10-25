/**
 * Setup Initial Admin User
 * Run this script once to create the first admin user
 * 
 * Usage: node scripts/setup-admin.js
 */

const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin
const serviceAccount = require('../firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdminUser(email, password, displayName) {
  try {
    console.log('\n🔧 Creating admin user...\n');

    // Create authentication user
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: true,
    });

    console.log('✅ Auth user created:', userRecord.uid);

    // Create Firestore user document with admin role
    await db.collection('users').doc(userRecord.uid).set({
      email: email,
      displayName: displayName,
      role: 'admin',
      photoURL: null,
      phoneNumber: null,
      addresses: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('✅ Firestore document created with admin role');
    console.log('\n🎉 Admin user setup complete!\n');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('👤 Display Name:', displayName);
    console.log('🆔 UID:', userRecord.uid);
    console.log('\n✨ You can now sign in at your app!\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      console.log('\n⚠️  User already exists. Updating role to admin...');
      
      try {
        const existingUser = await auth.getUserByEmail(email);
        await db.collection('users').doc(existingUser.uid).update({
          role: 'admin',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log('✅ Role updated to admin for:', email);
      } catch (updateError) {
        console.error('❌ Error updating role:', updateError.message);
      }
    }
  }
}

// Predefined admin credentials
const ADMIN_EMAIL = 'himanshu@gmail.com';
const ADMIN_PASSWORD = 'himanshu@123';
const ADMIN_NAME = 'Himanshu Dixit';

console.log('🚀 ELEPEIA Admin Setup');
console.log('=====================\n');
console.log('Creating admin user with:');
console.log('Email:', ADMIN_EMAIL);
console.log('Password:', ADMIN_PASSWORD);
console.log('Name:', ADMIN_NAME);
console.log('\n');

rl.question('Proceed? (yes/no): ', async (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    await createAdminUser(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME);
  } else {
    console.log('❌ Setup cancelled');
  }
  
  rl.close();
  process.exit(0);
});
