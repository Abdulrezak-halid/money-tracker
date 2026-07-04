import React, { useState } from 'react';
import { Expense, Category, TranslationSet } from '../types';
import { Language } from '../translations';
import { v4 as uuidv4 } from 'uuid';
import { FaChevronDown } from 'react-icons/fa6';

interface CManualFormProps {
  onAdd: (expense: Expense) => void;
  t: TranslationSet;
  language: Language;
}

const CManualForm: React.FC<CManualFormProps> = ({ onAdd, t, language }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.MARKET);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedDescription = description.trim();
    const trimmedAmount = amount.trim();
    
    if (!trimmedDescription || !trimmedAmount) return;

    const val = parseFloat(trimmedAmount);
    if (isNaN(val) || val <= 0 || val > 1000000) return;

    const newExpense: Expense = {
      id: uuidv4(),
      amount: val,
      category: category,
      description: trimmedDescription,
      date: new Date().toISOString()
    };

    onAdd(newExpense);
    setDescription('');
    setAmount('');
    setCategory(Category.MARKET);
  };

  return (
    <div className="bg-white dark:bg-gunmetal p-6 rounded-2xl shadow-md border border-gray-100 dark:border-rich-black h-full transition-colors flex flex-col">
      <h3 className="text-rich-black dark:text-platinum font-semibold mb-6 pb-2 border-b border-gray-100 dark:border-rich-black">{t.manualAdd}</h3>
      <form onSubmit={handleSubmit} className="space-y-5 flex-1">
        <div>
          <label className="block text-xs font-semibold text-walnut/70 dark:text-platinum/60 mb-2 uppercase tracking-wide">{t.placeLabel}</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.placePlaceholder}
            className="w-full p-3 rounded-xl bg-platinum/30 dark:bg-rich-black/50 border border-transparent focus:border-walnut dark:focus:border-khaki focus:ring-1 focus:ring-walnut dark:focus:ring-khaki outline-none text-sm text-rich-black dark:text-platinum placeholder-walnut/40 dark:placeholder-platinum/30 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-walnut/70 dark:text-platinum/60 mb-2 uppercase tracking-wide">{t.amountLabel}</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t.amountPlaceholder}
            className={`w-full p-3 rounded-xl bg-platinum/30 dark:bg-rich-black/50 border border-transparent focus:border-walnut dark:focus:border-khaki focus:ring-1 focus:ring-walnut dark:focus:ring-khaki outline-none text-sm font-mono text-rich-black dark:text-platinum placeholder-walnut/40 dark:placeholder-platinum/30 transition-all ${language === 'ar' ? 'text-left' : ''}`}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-walnut/70 dark:text-platinum/60 mb-2 uppercase tracking-wide">{t.categoryLabel}</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full p-3 pr-10 rounded-xl bg-platinum/30 dark:bg-rich-black/50 border border-transparent focus:border-walnut dark:focus:border-khaki focus:ring-1 focus:ring-walnut dark:focus:ring-khaki outline-none text-sm text-rich-black dark:text-platinum appearance-none cursor-pointer transition-all"
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-gunmetal text-rich-black dark:text-platinum">
                  {t.categories[cat]}
                </option>
              ))}
            </select>
            <div className="absolute top-1/2 right-3 rtl:right-auto rtl:left-3 -translate-y-1/2 pointer-events-none text-walnut dark:text-platinum/50">
              <FaChevronDown size={12} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-walnut hover:bg-[#4a3f32] dark:bg-khaki dark:hover:bg-[#b59b7e] text-platinum dark:text-rich-black py-3 rounded-xl font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all text-sm mt-4"
        >
          {t.saveBtn}
        </button>
      </form>
    </div>
  );
};

export default CManualForm;
