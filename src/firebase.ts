import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database, ref, set, get, onValue, push, remove, update } from 'firebase/database';
import { FirebaseConfig } from './types';

let app: FirebaseApp | null = null;
let db: Database | null = null;

export function initializeFirebase(config: FirebaseConfig): boolean {
  try {
    app = initializeApp(config);
    db = getDatabase(app);
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
}

export function getDb(): Database | null {
  return db;
}

export function isFirebaseConnected(): boolean {
  return db !== null;
}

// CRUD Operations
export async function saveAccount(account: any): Promise<void> {
  if (!db) throw new Error('Database not connected');
  await set(ref(db, `accounts/${account.id}`), account);
}

export async function saveSavings(savings: any): Promise<void> {
  if (!db) throw new Error('Database not connected');
  await set(ref(db, `savings/${savings.id}`), savings);
}

export async function saveTransaction(transaction: any): Promise<void> {
  if (!db) throw new Error('Database not connected');
  await set(ref(db, `transactions/${transaction.id}`), transaction);
}

export async function deleteAccount(id: string): Promise<void> {
  if (!db) throw new Error('Database not connected');
  await remove(ref(db, `accounts/${id}`));
}

export async function deleteSavings(id: string): Promise<void> {
  if (!db) throw new Error('Database not connected');
  await remove(ref(db, `savings/${id}`));
}

export async function deleteTransaction(id: string): Promise<void> {
  if (!db) throw new Error('Database not connected');
  await remove(ref(db, `transactions/${id}`));
}

export async function updateSavingsAmount(id: string, amount: number): Promise<void> {
  if (!db) throw new Error('Database not connected');
  await update(ref(db, `savings/${id}`), { currentAmount: amount });
}

export function subscribeToData(path: string, callback: (data: any) => void): () => void {
  if (!db) return () => {};
  const dbRef = ref(db, path);
  const unsubscribe = onValue(dbRef, (snapshot) => {
    callback(snapshot.val());
  });
  return unsubscribe;
}

export async function getAllData(path: string): Promise<any> {
  if (!db) return null;
  const snapshot = await get(ref(db, path));
  return snapshot.val();
}
