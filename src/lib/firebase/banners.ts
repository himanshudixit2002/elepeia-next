import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  link?: string;
  buttonText?: string;
  active: boolean;
  order: number;
  type: 'image' | 'video';
  createdAt: Date;
  updatedAt: Date;
}

const bannersCollection = collection(db, 'banners');

export const createBanner = async (
  bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const docRef = await addDoc(bannersCollection, {
    ...bannerData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getBanner = async (id: string): Promise<Banner | null> => {
  const docRef = doc(db, 'banners', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Banner;
};

export const getAllBanners = async (): Promise<Banner[]> => {
  const q = query(bannersCollection, orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Banner;
  });
};

export const getActiveBanners = async (): Promise<Banner[]> => {
  const q = query(
    bannersCollection,
    where('active', '==', true),
    orderBy('order', 'asc')
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Banner;
  });
};

export const updateBanner = async (
  id: string,
  bannerData: Partial<Banner>
): Promise<void> => {
  const docRef = doc(db, 'banners', id);
  await updateDoc(docRef, {
    ...bannerData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteBanner = async (id: string): Promise<void> => {
  const docRef = doc(db, 'banners', id);
  await deleteDoc(docRef);
};

export const uploadBannerImage = async (
  file: File,
  bannerId: string
): Promise<string> => {
  const storageRef = ref(storage, `banners/${bannerId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const deleteBannerImage = async (imageUrl: string): Promise<void> => {
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
};
