import React, { useState } from 'react';
import { parseExpenseFromText } from '../services/geminiService';
import { Expense, TranslationSet } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { FaWandMagicSparkles, FaArrowRight, FaSpinner } from 'react-icons/fa6';

interface CSmartEntryProps {
  onAdd: (expense: Expense) => void;
  t: TranslationSet;
}

const CSmartEntry: React.FC<CSmartEntryProps> = ({ onAdd, t }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    const trimmedText = text.trim();
    if (!trimmedText || loading) return;

    setLoading(true);
    setError(null);
    
    try {
      const result = await parseExpenseFromText(trimmedText);
      
      if (result && result.amount > 0) {
        const newExpense: Expense = {
          id: uuidv4(),
          amount: result.amount,
          category: result.category,
          description: result.description,
          date: new Date().toISOString(),
        };
        onAdd(newExpense);
        setText('');
      } else {
        setError(t.errorParsing);
      }
    } catch {
      setError(t.errorConnection);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gunmetal p-6 rounded-2xl shadow-md border border-gray-100 dark:border-rich-black transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-walnut/10 dark:bg-khaki/20 text-walnut dark:text-khaki p-2 rounded-lg text-lg">
           <FaWandMagicSparkles />
        </span>
        <h3 className="text-rich-black dark:text-platinum font-semibold">{t.smartAdd}</h3>
      </div>
      
      <p className="text-sm text-walnut/80 dark:text-platinum/60 mb-4 leading-relaxed">
        {t.smartAddDesc}
      </p>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholderSmart}
          className="w-full p-4 pr-24 rounded-xl bg-platinum/30 dark:bg-rich-black/50 border border-transparent focus:border-walnut dark:focus:border-khaki focus:ring-1 focus:ring-walnut dark:focus:ring-khaki text-rich-black dark:text-platinum placeholder-walnut/40 dark:placeholder-platinum/30 outline-none transition-all resize-none text-sm min-h-[100px]"
          disabled={loading}
        />
        <button
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 bg-walnut hover:bg-[#4a3f32] dark:bg-khaki dark:hover:bg-[#b59b7e] disabled:opacity-50 disabled:cursor-not-allowed text-platinum dark:text-rich-black px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <span className="animate-spin"><FaSpinner /></span>
              <span className="hidden sm:inline">{t.analyzing}</span>
            </>
          ) : (
            <>
              <span>{t.addBtn}</span>
              <span className="rtl:rotate-180"><FaArrowRight /></span>
            </>
          )}
        </button>
      </div>
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-xs rounded-lg border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      )}
    </div>
  );
};

export default CSmartEntry;
