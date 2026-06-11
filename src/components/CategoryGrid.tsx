import * as Icons from 'lucide-react';
import { Category } from '../types';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryGrid({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryGridProps) {
  return (
    <div className="bg-slate-50 border-b border-slate-100 py-6" id="jd-category-explorer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
              What are you looking for today?
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Explore trusted reviews, direct communication channels, and direct service appointments
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-full transition-all cursor-pointer shadow-sm"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Scrollable on mobile, beautiful grids on large screens */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
          {categories.map((category) => {
            // Dynamically resolve icon or fallback to HelpCircle
            const LucideIcon = (Icons as any)[category.iconName] || Icons.HelpCircle;
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(isSelected ? null : category.id)}
                className={`group flex flex-col items-center p-3 rounded-2xl border text-center transition-all duration-300 relative cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20 translate-y-[-2px]'
                    : 'bg-white border-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-md'
                }`}
              >
                {/* Circular Icon frame with gradient backgrounds */}
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center mb-2 shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-50 text-slate-600 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100'
                  }`}
                >
                  <LucideIcon className="h-5 w-5 stroke-[1.8]" />
                </div>

                <span className="text-[10px] font-bold tracking-tight line-clamp-1 block leading-tight">
                  {category.name}
                </span>

                <span
                  className={`text-[9px] font-medium block mt-0.5 ${
                    isSelected ? 'text-white/80' : 'text-slate-400 group-hover:text-slate-500'
                  }`}
                >
                  {category.count}+
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
