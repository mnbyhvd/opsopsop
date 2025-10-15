import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCategories } from '../hooks/useCategories';

interface ProductSearchFilterProps {
  onSearchChange: (search: string) => void;
  onCategoryChange: (categoryId: number | null) => void;
  searchValue: string;
  selectedCategoryId: number | null;
}

const ProductSearchFilter: React.FC<ProductSearchFilterProps> = ({
  onSearchChange,
  onCategoryChange,
  searchValue,
  selectedCategoryId
}) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleCategorySelect = (categoryId: number | null) => {
    onCategoryChange(categoryId);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange(null);
  };

  const hasActiveFilters = Boolean(searchValue) || Boolean(selectedCategoryId);

  return (
    <div className="w-full mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6"
        style={{
          backgroundColor: 'rgba(98, 98, 98, 0.3)',
          backdropFilter: 'blur(38.400001525878906px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '30px'
        }}
      >
        {/* Поиск */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Поиск по названию и описанию..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 text-base md:text-lg rounded-2xl border-2 border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-gray-800/70 transition-all duration-300"
            style={{ fontFamily: 'Inter' }}
          />
        </div>

        {/* Фильтры и кнопка очистки в одной строке */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Кнопка фильтров */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                selectedCategoryId
                  ? 'border-red-500 bg-red-500/20 text-red-400'
                  : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-800/70'
              }`}
              style={{ fontFamily: 'Inter' }}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Категории
              {selectedCategoryId && (
                <span className="ml-1 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                  {categories.find(c => c.id === selectedCategoryId)?.name}
                </span>
              )}
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Выпадающий список категорий */}
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-auto bg-gray-800 border border-gray-600 rounded-xl shadow-xl z-50"
              >
                <div className="p-2">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                      !selectedCategoryId
                        ? 'bg-red-500/20 text-red-400'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                    style={{ fontFamily: 'Inter' }}
                  >
                    Все категории
                  </button>
                  {categoriesLoading ? (
                    <div className="px-4 py-3 text-gray-400 text-center">
                      Загрузка...
                    </div>
                  ) : (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                          selectedCategoryId === category.id
                            ? 'bg-red-500/20 text-red-400'
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                        style={{ fontFamily: 'Inter' }}
                      >
                        {category.name}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Кнопка очистки фильтров */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-6 py-4 rounded-xl border-2 border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-800/70 transition-all duration-300"
              style={{ fontFamily: 'Inter' }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Очистить
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductSearchFilter;
