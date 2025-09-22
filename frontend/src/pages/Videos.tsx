import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageContainer from '../components/PageContainer';
import { useVideos, Video } from '../hooks/useVideos';

const Videos: React.FC = () => {
  const { videos, loading, error } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue', color: '#F2F0F0' }}>
            ЗАГРУЗКА ВИДЕО...
          </div>
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0D' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bebas Neue', color: '#D71920' }}>
            ОШИБКА ЗАГРУЗКИ
          </div>
          <div className="text-lg" style={{ fontFamily: 'Inter', color: '#B8B8B8' }}>
            Не удалось загрузить видео
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0D' }}>
      {/* Фоновое изображение */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/1.png)',
          opacity: 0.1,
          zIndex: -1
        }}
      />
      {/* Hero секция */}
      <section className="py-20 relative">
        <PageContainer>
          <div className="col-start-1 col-end-13 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 
                className="text-6xl font-bold mb-6"
                style={{ 
                  fontFamily: 'Bebas Neue',
                  color: '#F2F0F0',
                  textTransform: 'uppercase'
                }}
              >
                ВИДЕО-ПРЕЗЕНТАЦИИ
              </h1>
              
              <p 
                className="text-xl max-w-4xl mx-auto"
                style={{ 
                  fontFamily: 'Inter',
                  color: '#B8B8B8'
                }}
              >
                Главные особенности и преимущества в коротких видео-роликах
              </p>
            </motion.div>
          </div>
        </PageContainer>
      </section>

      {/* Основной контент */}
      <section className="py-16 relative">
        <PageContainer>
          {/* Список видео */}
          <div className="col-start-1 col-end-13">
            <div className="space-y-8">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl overflow-hidden group cursor-pointer flex flex-col md:flex-row items-center gap-8 p-6"
                  onClick={() => {
                    setSelectedVideo(video);
                    setIsVideoModalOpen(true);
                  }}
                  style={{
                    backgroundColor: 'rgba(98, 98, 98, 0.3)',
                    backdropFilter: 'blur(38.400001525878906px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '30px'
                  }}
                >
                  {/* Видео превью */}
                  <div className="relative w-full md:w-80 h-48 bg-gray-700/50 flex items-center justify-center overflow-hidden rounded-lg flex-shrink-0">
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Play кнопка */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                      </div>
                    </div>
                    {/* Длительность */}
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm text-white">
                      {video.duration}
                    </div>
                  </div>
                  
                  {/* Контент */}
                  <div className="flex-1 w-full">
                    <h3 
                      className="text-3xl font-bold mb-4"
                      style={{ 
                        fontFamily: 'Bebas Neue',
                        color: '#F2F0F0'
                      }}
                    >
                      {video.title}
                    </h3>
                    <p 
                      className="text-gray-300 mb-6 text-lg"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {video.description}
                    </p>
                    <div className="text-sm text-gray-400" style={{ fontFamily: 'Inter' }}>
                      {video.category} • {video.duration}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Модальное окно для просмотра видео */}
      {isVideoModalOpen && selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => {
            setIsVideoModalOpen(false);
            setSelectedVideo(null);
          }}
        >
          <div 
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <button
              onClick={() => {
                setIsVideoModalOpen(false);
                setSelectedVideo(null);
              }}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
              style={{ zIndex: 10 }}
            >
              ✕
            </button>
            
            {/* Видео плеер */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                className="absolute inset-0 w-full h-full rounded-lg"
                controls
                autoPlay
                style={{ backgroundColor: '#000' }}
              >
                <source src={selectedVideo.video_url} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            
            {/* Информация о видео */}
            <div 
              className="mt-4 p-6 rounded-lg"
              style={{
                backgroundColor: 'rgba(98, 98, 98, 0.3)',
                backdropFilter: 'blur(38.400001525878906px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <h3 
                className="text-2xl font-bold mb-2"
                style={{ 
                  fontFamily: 'Bebas Neue',
                  color: '#F2F0F0'
                }}
              >
                {selectedVideo.title}
              </h3>
              <p 
                className="text-gray-300 mb-4"
                style={{ fontFamily: 'Inter' }}
              >
                {selectedVideo.description}
              </p>
              <div className="text-sm text-gray-400" style={{ fontFamily: 'Inter' }}>
                {selectedVideo.category} • {selectedVideo.duration}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;