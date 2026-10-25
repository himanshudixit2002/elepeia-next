/**
 * Make Existing User Admin
 * Run this script to promote any user to admin by email
 * 
 * Usage: node scripts/make-admin.js user@example.com
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../firebase-admin-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

async function makeUserAdmin(email) {
  try {
    console.log('\n🔧 Looking up user:', email);

    // Get user by email
    const userRecord = await auth.getUserByEmail(email);
    console.log('✅ Found user:', userRecord.uid);

    // Update Firestore document with admin role
    await db.collection('users').doc(userRecord.uid).set({
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log('✅ User promoted to admin!');
    console.log('\n📧 Email:', email);
    console.log('🆔 UID:', userRecord.uid);
    console.log('👑 Role: admin\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n⚠️  User not found. Please create an account first at your app.\n');
    }
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('\n❌ Please provide an email address');
  console.log('Usage: node scripts/make-admin.js user@example.com\n');
  process.exit(1);
}

console.log('🚀 ELEPEIA - Make User Admin');
console.log('============================\n');

makeUserAdmin(email).then(() => {
  console.log('✨ Done!\n');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
