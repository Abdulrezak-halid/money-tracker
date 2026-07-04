import React, { useState, useEffect } from "react";

import { Expense } from "./types";
import { translations, Language } from "./translations";
import { FaMoon, FaSun, FaGlobe, FaWallet } from "react-icons/fa6";
import CTransactionList from "./components/CTransactionList";
import CCategoryChart from "./components/CCategoryChart";
import CManualForm from "./components/CManualForm";
import CSmartEntry from "./components/CSmartEntry";
import CStatsCard from "./components/CStatsCard";
import { getAllTransactions, replaceTransactions } from "./services/storage";

const LEGACY_EXPENSES_KEY = "expenses";

const parseStoredExpenses = (raw: string | null): Expense[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isExpensesReady, setIsExpensesReady] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "tr";
  });

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const savedExpenses = await getAllTransactions();

        if (savedExpenses.length > 0) {
          setExpenses(savedExpenses);
          setIsExpensesReady(true);
          return;
        }

        const legacyExpenses = parseStoredExpenses(
          localStorage.getItem(LEGACY_EXPENSES_KEY)
        );

        if (legacyExpenses.length > 0) {
          setExpenses(legacyExpenses);
          await replaceTransactions(legacyExpenses);
          localStorage.removeItem(LEGACY_EXPENSES_KEY);
        }
      } catch (error) {
        console.error("Failed to load IndexedDB expenses:", error);
        setExpenses(parseStoredExpenses(localStorage.getItem(LEGACY_EXPENSES_KEY)));
      }

      setIsExpensesReady(true);
    };

    void loadExpenses();
  }, []);

  useEffect(() => {
    if (!isExpensesReady) {
      return;
    }

    const persistExpenses = async () => {
      try {
        await replaceTransactions(expenses);
        localStorage.removeItem(LEGACY_EXPENSES_KEY);
      } catch (error) {
        console.error("Failed to persist IndexedDB expenses:", error);
        localStorage.setItem(LEGACY_EXPENSES_KEY, JSON.stringify(expenses));
      }
    };

    void persistExpenses();
  }, [expenses, isExpensesReady]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const t = translations[language];

  const handleAddExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div
      className={`min-h-screen pb-12 transition-colors duration-300 ${
        language === "ar" ? "font-arabic" : ""
      } selection:bg-walnut selection:text-platinum`}
    >
      <header className="bg-walnut dark:bg-gunmetal border-b border-transparent dark:border-rich-black sticky top-0 z-50 shadow-lg transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-platinum dark:bg-khaki rounded-xl flex items-center justify-center text-rich-black font-bold text-lg shadow-inner">
              <FaWallet />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-platinum dark:text-khaki tracking-tight leading-tight">
                {t.appTitle}
              </h1>
              <p className="text-[10px] sm:text-xs text-platinum/80 dark:text-khaki/80 uppercase tracking-widest">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLanguage((l) => (l === "tr" ? "ar" : "tr"))}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-platinum/10 text-platinum hover:bg-platinum/20 dark:text-khaki dark:bg-khaki/10 dark:hover:bg-khaki/20 transition-all flex items-center gap-2"
              title="Change Language"
            >
              <FaGlobe />
              <span className="hidden sm:inline">
                {language === "tr" ? "العربية" : "TR"}
              </span>
              <span className="sm:hidden text-xs uppercase">
                {language === "tr" ? "AR" : "TR"}
              </span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-lg bg-platinum/10 text-platinum hover:bg-platinum/20 dark:text-khaki dark:bg-khaki/10 dark:hover:bg-khaki/20 transition-all"
              aria-label="Toggle Theme"
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <CStatsCard expenses={expenses} t={t} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <CSmartEntry onAdd={handleAddExpense} t={t} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              <CManualForm onAdd={handleAddExpense} t={t} language={language} />
              <CCategoryChart expenses={expenses} t={t} />
            </div>
          </div>

          <div className="lg:col-span-4 h-full">
            <CTransactionList
              expenses={expenses}
              onDelete={handleDeleteExpense}
              t={t}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
