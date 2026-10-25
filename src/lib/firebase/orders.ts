import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Order, OrderStatus, PaymentStatus } from '@/types';

const ordersCollection = collection(db, 'orders');

export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<string> => {
  const docRef = await addDoc(ordersCollection, {
    ...orderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getOrder = async (id: string): Promise<Order | null> => {
  const docRef = doc(db, 'orders', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    estimatedDelivery: data.estimatedDelivery?.toDate(),
  } as Order;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(
    ordersCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      estimatedDelivery: data.estimatedDelivery?.toDate(),
    } as Order;
  });
};

export const getAllOrders = async (): Promise<Order[]> => {
  const q = query(ordersCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      estimatedDelivery: data.estimatedDelivery?.toDate(),
    } as Order;
  });
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<void> => {
  const docRef = doc(db, 'orders', orderId);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: PaymentStatus
): Promise<void> => {
  const docRef = doc(db, 'orders', orderId);
  await updateDoc(docRef, {
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
};

export const updateTrackingNumber = async (
  orderId: string,
  trackingNumber: string
): Promise<void> => {
  const docRef = doc(db, 'orders', orderId);
  await updateDoc(docRef, {
    trackingNumber,
    updatedAt: serverTimestamp(),
  });
};
