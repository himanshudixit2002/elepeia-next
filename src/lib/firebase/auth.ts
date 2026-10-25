import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '@/types';

const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = userCredential;

  await updateProfile(user, { displayName });

  const userData: Omit<User, 'uid'> = {
    email: user.email!,
    displayName,
    photoURL: user.photoURL || undefined,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    addresses: [],
  };

  await setDoc(doc(db, 'users', user.uid), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { uid: user.uid, ...userData };
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const { user } = userCredential;

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    throw new Error('User data not found');
  }

  const userData = userDoc.data() as Omit<User, 'uid'>;
  return { uid: user.uid, ...userData };
};

export const signInWithGoogle = async (): Promise<User> => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const { user } = userCredential;

  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const userData: Omit<User, 'uid'> = {
      email: user.email!,
      displayName: user.displayName || 'Anonymous',
      photoURL: user.photoURL || undefined,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      addresses: [],
    };

    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { uid: user.uid, ...userData };
  }

  const userData = userDoc.data() as Omit<User, 'uid'>;
  return { uid: user.uid, ...userData };
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) return null;

  const userData = userDoc.data() as Omit<User, 'uid'>;
  return { uid: user.uid, ...userData };
};
