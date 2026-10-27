import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Account, SavingsPlan, Transaction, FirebaseConfig } from '../types';
import { initializeFirebase, isFirebaseConnected, saveAccount, saveSavings, saveTransaction, deleteAccount as fbDeleteAccount, deleteSavings as fbDeleteSavings, deleteTransaction as fbDeleteTransaction, updateSavingsAmount, subscribeToData } from '../firebase';
import { v4 as uuidv4 } from 'uuid';

interface StoreContextType {
  accounts: Account[];
  savings: SavingsPlan[];
  transactions: Transaction[];
  firebaseConnected: boolean;
  firebaseConfig: FirebaseConfig | null;
  connectFirebase: (config: FirebaseConfig) => boolean;
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, data: Partial<Account>) => void;
  removeAccount: (id: string) => void;
  addSavings: (savings: Omit<SavingsPlan, 'id' | 'createdAt'>) => void;
  updateSavings: (id: string, data: Partial<SavingsPlan>) => void;
  removeSavings: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  removeTransaction: (id: string) => void;
  getAccountSavings: (accountId: string) => SavingsPlan[];
  getAccountBalance: (accountId: string) => number;
  getSavingsTransactions: (savingsId: string) => Transaction[];
}

const StoreContext = createContext<StoreContextType | null>(null);

function loadFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(() => loadFromStorage('accounts'));
  const [savings, setSavings] = useState<SavingsPlan[]>(() => loadFromStorage('savings'));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromStorage('transactions'));
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig | null>(null);

  // Load Firebase config from storage
  useEffect(() => {
    const config = localStorage.getItem('firebaseConfig');
    if (config) {
      try {
        const parsed = JSON.parse(config);
        const success = initializeFirebase(parsed);
        if (success) {
          setFirebaseConnected(true);
          setFirebaseConfig(parsed);
        }
      } catch (e) {
        console.error('Failed to load Firebase config', e);
      }
    }
  }, []);

  // Sync with Firebase when connected
  useEffect(() => {
    if (!firebaseConnected) return;

    const unsubAccounts = subscribeToData('accounts', (data) => {
      if (data) {
        const list = Object.values(data) as Account[];
        setAccounts(list);
        saveToStorage('accounts', list);
      }
    });

    const unsubSavings = subscribeToData('savings', (data) => {
      if (data) {
        const list = Object.values(data) as SavingsPlan[];
        setSavings(list);
        saveToStorage('savings', list);
      }
    });

    const unsubTransactions = subscribeToData('transactions', (data) => {
      if (data) {
        const list = Object.values(data) as Transaction[];
        setTransactions(list);
        saveToStorage('transactions', list);
      }
    });

    return () => {
      unsubAccounts();
      unsubSavings();
      unsubTransactions();
    };
  }, [firebaseConnected]);

  // Save to localStorage on changes
  useEffect(() => { saveToStorage('accounts', accounts); }, [accounts]);
  useEffect(() => { saveToStorage('savings', savings); }, [savings]);
  useEffect(() => { saveToStorage('transactions', transactions); }, [transactions]);

  const connectFirebase = useCallback((config: FirebaseConfig): boolean => {
    const success = initializeFirebase(config);
    if (success) {
      setFirebaseConnected(true);
      setFirebaseConfig(config);
      localStorage.setItem('firebaseConfig', JSON.stringify(config));
    }
    return success;
  }, []);

  const addAccount = useCallback((data: Omit<Account, 'id' | 'createdAt'>) => {
    const account: Account = { ...data, id: uuidv4(), createdAt: Date.now() };
    setAccounts(prev => [...prev, account]);
    if (firebaseConnected) saveAccount(account);
  }, [firebaseConnected]);

  const updateAccount = useCallback((id: string, data: Partial<Account>) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    if (firebaseConnected) {
      const updated = accounts.find(a => a.id === id);
      if (updated) saveAccount({ ...updated, ...data });
    }
  }, [firebaseConnected, accounts]);

  const removeAccount = useCallback((id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    if (firebaseConnected) fbDeleteAccount(id);
  }, [firebaseConnected]);

  const addSavings = useCallback((data: Omit<SavingsPlan, 'id' | 'createdAt'>) => {
    const saving: SavingsPlan = { ...data, id: uuidv4(), createdAt: Date.now() };
    setSavings(prev => [...prev, saving]);
    if (firebaseConnected) saveSavings(saving);
  }, [firebaseConnected]);

  const updateSavings = useCallback((id: string, data: Partial<SavingsPlan>) => {
    setSavings(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    if (firebaseConnected) {
      const updated = savings.find(s => s.id === id);
      if (updated) saveSavings({ ...updated, ...data });
    }
  }, [firebaseConnected, savings]);

  const removeSavings = useCallback((id: string) => {
    setSavings(prev => prev.filter(s => s.id !== id));
    if (firebaseConnected) fbDeleteSavings(id);
  }, [firebaseConnected]);

  const addTransaction = useCallback((data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const transaction: Transaction = { ...data, id: uuidv4(), createdAt: Date.now() };
    setTransactions(prev => [...prev, transaction]);
    
    // Update savings amount
    setSavings(prev => prev.map(s => {
      if (s.id === data.savingsId) {
        const newAmount = data.type === 'deposit' 
          ? s.currentAmount + data.amount 
          : s.currentAmount - data.amount;
        if (firebaseConnected) updateSavingsAmount(s.id, newAmount);
        return { ...s, currentAmount: Math.max(0, newAmount) };
      }
      return s;
    }));

    if (firebaseConnected) saveTransaction(transaction);
  }, [firebaseConnected]);

  const removeTransaction = useCallback((id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      // Reverse the amount
      setSavings(prev => prev.map(s => {
        if (s.id === tx.savingsId) {
          const newAmount = tx.type === 'deposit'
            ? s.currentAmount - tx.amount
            : s.currentAmount + tx.amount;
          if (firebaseConnected) updateSavingsAmount(s.id, newAmount);
          return { ...s, currentAmount: Math.max(0, newAmount) };
        }
        return s;
      }));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (firebaseConnected) fbDeleteTransaction(id);
  }, [firebaseConnected, transactions]);

  const getAccountSavings = useCallback((accountId: string) => {
    return savings.filter(s => s.accountId === accountId);
  }, [savings]);

  const getAccountBalance = useCallback((accountId: string) => {
    return savings
      .filter(s => s.accountId === accountId)
      .reduce((sum, s) => sum + s.currentAmount, 0);
  }, [savings]);

  const getSavingsTransactions = useCallback((savingsId: string) => {
    return transactions
      .filter(t => t.savingsId === savingsId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [transactions]);

  return (
    <StoreContext.Provider value={{
      accounts, savings, transactions, firebaseConnected, firebaseConfig,
      connectFirebase, addAccount, updateAccount, removeAccount,
      addSavings, updateSavings, removeSavings,
      addTransaction, removeTransaction,
      getAccountSavings, getAccountBalance, getSavingsTransactions
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
