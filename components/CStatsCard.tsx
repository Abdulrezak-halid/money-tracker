import React from "react";
import { Expense, TranslationSet } from "../types";

interface CStatsCardProps {
  expenses: Expense[];
  t: TranslationSet;
}

const CStatsCard: React.FC<CStatsCardProps> = ({ expenses, t }) => {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const count = expenses.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-linear-to-r from-walnut to-[#6d5e4b] dark:from-gunmetal dark:to-[#2c4049] rounded-2xl p-6 text-platinum dark:text-khaki shadow-lg border border-transparent dark:border-khaki/20">
        <h3 className="text-platinum/80 dark:text-khaki/80 text-sm font-medium uppercase tracking-wider">
          {t.totalSpent}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-4xl font-bold font-mono">
            ₺{total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <p className="mt-2 text-platinum/70 dark:text-khaki/70 text-sm">
          {t.transactionCount.replace("{count}", count)}
        </p>
      </div>

      <div className="bg-white dark:bg-gunmetal rounded-2xl p-6 shadow-md border border-gray-100 dark:border-rich-black flex flex-col justify-center transition-colors">
        <h3 className="text-walnut dark:text-khaki text-sm font-medium uppercase tracking-wider">
          {t.statusTitle}
        </h3>
        <p className="mt-2 text-rich-black dark:text-platinum">
          {total > 0 ? t.statusDesc : t.statusEmpty}
        </p>
      </div>
    </div>
  );
};

export default CStatsCard;
