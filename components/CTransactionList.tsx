import React from 'react';
import { Expense, TranslationSet } from '../types';
import { getCategoryIcon } from '../utils/icons';
import { FaTrashCan } from 'react-icons/fa6';

interface CTransactionListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  t: TranslationSet;
}

const CTransactionList: React.FC<CTransactionListProps> = ({ expenses, onDelete, t }) => {
  /**
   * Handles deletion with confirmation
   */
  const handleDelete = (id: string, description: string) => {
    if (window.confirm(t.confirmDelete.replace('{description}', description))) {
      onDelete(id);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-walnut/50 dark:text-platinum/50 bg-white dark:bg-gunmetal rounded-2xl shadow-sm border border-gray-100 dark:border-rich-black transition-colors">
        <div className="text-4xl mb-3 opacity-30">🧾</div>
        <p className="text-sm">{t.noTransactions}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gunmetal rounded-2xl shadow-md border border-gray-100 dark:border-rich-black overflow-hidden transition-colors h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-rich-black bg-platinum/30 dark:bg-rich-black/30">
        <h3 className="font-semibold text-rich-black dark:text-platinum">{t.recentTransactions}</h3>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-rich-black overflow-y-auto max-h-[500px] lg:max-h-[700px] no-scrollbar">
        {expenses.map((expense) => (
          <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-platinum/20 dark:hover:bg-rich-black/30 transition-colors group relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm bg-platinum dark:bg-rich-black text-walnut dark:text-khaki shrink-0">
                {getCategoryIcon(expense.category)}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-rich-black dark:text-platinum truncate pr-2">{expense.description}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-walnut/70 dark:text-platinum/60 mt-0.5">
                  <span className="bg-platinum/50 dark:bg-rich-black/50 px-2 py-0.5 rounded-full text-rich-black dark:text-khaki whitespace-nowrap">
                    {t.categories[expense.category] || expense.category}
                  </span>
                  <span className="opacity-50">•</span>
                  <span className="whitespace-nowrap">{new Date(expense.date).toLocaleDateString(document.documentElement.lang === 'ar' ? 'ar-SA' : 'tr-TR', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="font-bold text-walnut dark:text-khaki font-mono whitespace-nowrap">
                -₺{expense.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </span>
              
              <button 
                onClick={() => handleDelete(expense.id, expense.description)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 -mr-2 lg:opacity-0 lg:group-hover:opacity-100 focus:opacity-100"
                title={t.delete}
                aria-label={t.delete}
              >
                <FaTrashCan size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CTransactionList;
