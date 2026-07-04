import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Expense } from '../types';

interface MoneyDB extends DBSchema {
  transactions: {
    key: string;
    value: Expense;
    indexes: { 'by-date': string };
  };
}

let dbPromise: Promise<IDBPDatabase<MoneyDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<MoneyDB>('money-tracker-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('transactions', { keyPath: 'id' });
        store.createIndex('by-date', 'date');
      }
    });
  }
  return dbPromise;
}

export async function saveTransaction(tx: MoneyDB['transactions']['value']) {
  const db = await getDB();
  await db.put('transactions', tx);
}

export async function getAllTransactions() {
  const db = await getDB();
  return db.getAll('transactions');
}

export async function replaceTransactions(transactions: Expense[]) {
  const db = await getDB();
  const tx = db.transaction('transactions', 'readwrite');
  await tx.store.clear();

  for (const transaction of transactions) {
    await tx.store.put(transaction);
  }

  await tx.done;
}
