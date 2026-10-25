import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Review } from '@/types';

const reviewsCollection = collection(db, 'reviews');

export const createReview = async (
  reviewData: Omit<Review, 'id' | 'createdAt'>
): Promise<string> => {
  const docRef = await addDoc(reviewsCollection, {
    ...reviewData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getProductReviews = async (productId: string): Promise<Review[]> => {
  const q = query(
    reviewsCollection,
    where('productId', '==', productId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Review;
  });
};

export const getUserReviews = async (userId: string): Promise<Review[]> => {
  const q = query(
    reviewsCollection,
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
    } as Review;
  });
};
