import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductImage } from '../types';

interface ProductImageCarouselProps {
  images: ProductImage[];
  mainImage?: string;
  productName: string;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
  mainImage,
  productName
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Объединяем основное изображение с дополнительными
  const allImages = mainImage 
    ? [{ id: 0, image_url: mainImage, alt_text: productName, sort_order: 0 }, ...images]
    : images;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (allImages.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-700/50 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400 text-lg" style={{ fontFamily: 'Inter' }}>
          Изображение продукта
        </span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Основное изображение */}
      <div className="relative w-full h-72 md:h-80 xl:h-96 mb-4 rounded-2xl object-contain">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={allImages[currentIndex].image_url}
            alt={allImages[currentIndex].alt_text || productName}
            className="w-full h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Навигационные кнопки */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Индикатор текущего изображения */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Миниатюры */}
      {allImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700/60">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                index === currentIndex 
                  ? 'ring-2 ring-red-500 opacity-100' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image.image_url}
                alt={image.alt_text || productName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
