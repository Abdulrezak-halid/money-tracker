import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Expense, TranslationSet } from '../types';

interface ICCategoryChartProps {
  expenses: Expense[];
  t: TranslationSet;
}

// Professional palette matching the theme
const COLORS = [
  '#c6ac8f', // Khaki
  '#5e503f', // Walnut
  '#22333b', // Gunmetal
  '#0a0908', // Rich Black
  '#8d7b68', 
  '#a4ac86', 
  '#335c67', 
  '#e09f3e'
];

const CCategoryChart: React.FC<ICCategoryChartProps> = ({ expenses, t }) => {
  const data = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name: t.categories[name] || name, value }))
      .sort((a, b) => b.value - a.value); 
  }, [expenses, t]);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gunmetal p-6 rounded-2xl shadow-md border border-gray-100 dark:border-rich-black h-[300px] flex items-center justify-center text-walnut/50 dark:text-platinum/50 transition-colors">
        {t.noDataChart}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gunmetal p-6 rounded-2xl shadow-md border border-gray-100 dark:border-rich-black flex flex-col items-center transition-colors h-full">
      <h3 className="text-rich-black dark:text-platinum font-semibold mb-4 w-full text-left rtl:text-right">{t.chartTitle}</h3>
      {/* 
         FIX: Recharts requires a defined height on the container to calculate dimensions. 
         w-full and h-[300px] ensures strict dimensions.
      */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => `₺${value.toLocaleString('tr-TR')}`}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#eae0d5',
                color: '#0a0908',
                fontFamily: 'Rubik'
              }}
              itemStyle={{ color: '#0a0908' }}
              cursor={false}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CCategoryChart;
