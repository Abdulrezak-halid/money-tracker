export enum Category {
  MARKET = 'Market', 
  ULASIM = 'Ulaşım', 
  YEMEK = 'Yemek & Restoran',
  GIYIM = 'Giyim & Moda', 
  FATURA = 'Faturalar', 
  EGLENCE = 'Eğlence',
  SAGLIK = 'Sağlık',
  EGITIM = 'Eğitim',
  KOZMETIK = 'Kozmetik',
  TEKNOLOJI = 'Teknoloji',
  EV = 'Ev & Yaşam',
  HEDIYE = 'Hediye',
  DIGER = 'Diğer'
}

export interface Expense {
  id: string;
  amount: number;
  description: string; 
  category: Category;
  date: string; // ISO String
}

export interface ParsedExpenseData {
  amount: number;
  description: string;
  category: Category;
}

export interface TranslationSet {
  appTitle: string;
  subtitle: string;
  totalSpent: string;
  transactionCount: string;
  smartAdd: string;
  smartAddDesc: string;
  placeholderSmart: string;
  addBtn: string;
  analyzing: string;
  manualAdd: string;
  placeLabel: string;
  placePlaceholder: string;
  amountLabel: string;
  amountPlaceholder: string;
  categoryLabel: string;
  saveBtn: string;
  recentTransactions: string;
  noTransactions: string;
  chartTitle: string;
  errorParsing: string;
  errorConnection: string;
  statusTitle: string;
  statusDesc: string;
  statusEmpty: string;
  noDataChart: string;
  delete: string;
  confirmDelete: string;
  categories: Record<Category, string>;
}
