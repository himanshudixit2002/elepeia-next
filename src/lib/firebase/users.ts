import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './config';
import { User, Address } from '@/types';

export const getUserData = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    uid: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as User;
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<User>
): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const addAddress = async (uid: string, address: Address): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    addresses: arrayUnion(address),
    updatedAt: serverTimestamp(),
  });
};

export const updateAddress = async (
  uid: string,
  addressId: string,
  updatedAddress: Address
): Promise<void> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return;

  const userData = userDoc.data() as User;
  const addresses = userData.addresses || [];
  const updatedAddresses = addresses.map((addr) =>
    addr.id === addressId ? updatedAddress : addr
  );

  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    addresses: updatedAddresses,
    updatedAt: serverTimestamp(),
  });
};

export const deleteAddress = async (uid: string, addressId: string): Promise<void> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return;

  const userData = userDoc.data() as User;
  const addresses = userData.addresses || [];
  const filteredAddresses = addresses.filter((addr) => addr.id !== addressId);

  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    addresses: filteredAddresses,
    updatedAt: serverTimestamp(),
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  const usersCollection = collection(db, 'users');
  const querySnapshot = await getDocs(usersCollection);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as User;
  });
};
