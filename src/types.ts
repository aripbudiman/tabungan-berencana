export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  icon?: string;
  color?: string;
  createdAt: number;
}

export interface SavingsPlan {
  id: string;
  accountId: string;
  name: string;
  photo?: string;
  targetAmount: number;
  currentAmount: number;
  planType: 'monthly' | 'weekly';
  defaultNominal: number;
  createdAt: number;
}

export interface Transaction {
  id: string;
  savingsId: string;
  accountId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  note?: string;
  attachment?: string; // base64 image
  createdAt: number;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
