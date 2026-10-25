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
  limit,
  startAfter,
  Timestamp,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { Product } from '@/types';

const productsCollection = collection(db, 'products');

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<string> => {
  const docRef = await addDoc(productsCollection, {
    ...productData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getProduct = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Product;
};

export const updateProduct = async (
  id: string,
  productData: Partial<Product>
): Promise<void> => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...productData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
};

export const getProducts = async (filters?: {
  category?: string;
  subcategory?: string;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sortBy?: string;
  limitCount?: number;
}): Promise<Product[]> => {
  const constraints: QueryConstraint[] = [];

  if (filters?.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters?.subcategory) {
    constraints.push(where('subcategory', '==', filters.subcategory));
  }
  if (filters?.featured) {
    constraints.push(where('featured', '==', true));
  }
  if (filters?.trending) {
    constraints.push(where('trending', '==', true));
  }
  if (filters?.newArrival) {
    constraints.push(where('newArrival', '==', true));
  }

  switch (filters?.sortBy) {
    case 'price-asc':
      constraints.push(orderBy('price', 'asc'));
      break;
    case 'price-desc':
      constraints.push(orderBy('price', 'desc'));
      break;
    case 'newest':
      constraints.push(orderBy('createdAt', 'desc'));
      break;
    case 'rating':
      constraints.push(orderBy('rating', 'desc'));
      break;
    default:
      constraints.push(orderBy('createdAt', 'desc'));
  }

  if (filters?.limitCount) {
    constraints.push(limit(filters.limitCount));
  }

  const q = query(productsCollection, ...constraints);
  const querySnapshot = await getDocs(q);

  let products = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Product;
  });

  if (filters?.minPrice !== undefined) {
    products = products.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters?.sizes && filters.sizes.length > 0) {
    products = products.filter((p) =>
      p.sizes.some((s) => filters.sizes!.includes(s.name) && s.inStock)
    );
  }
  if (filters?.colors && filters.colors.length > 0) {
    products = products.filter((p) =>
      p.colors.some((c) => filters.colors!.includes(c.name))
    );
  }

  return products;
};

export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  const q = query(productsCollection);
  const querySnapshot = await getDocs(q);

  const products = querySnapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Product;
    })
    .filter((product) => {
      const search = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    });

  return products;
};
