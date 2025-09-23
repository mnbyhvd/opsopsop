import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageContainer from './PageContainer';

interface VideoPresentation {
  id: number;
  title: string;
  description: string;
  video_url: string;
  youtube_url: string;
  thumbnail_url: string;
  duration: string;
  sort_order: number;
  is_active: boolean;
}

interface VideoSettings {
  id: number;
  title: string;
  subtitle: string;
}

const VideoPresentationsSection: React.FC = () => {
  const [videos, setVideos] = useState<VideoPresentation[]>([]);
  const [settings, setSettings] = useState<VideoSettings | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoPresentation | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Создаем массив элементов для слайдера (дублируем для бесконечности)
  const sliderItems = React.useMemo(() => {
    if (videos.length === 0) return [];
    
    // Создаем 6 элементов: 3 копии массива видео для бесконечности
    const duplicatedVideos = [...videos, ...videos, ...videos];
    return duplicatedVideos.map((video, index) => ({
      ...video,
      sliderIndex: index
    }));
  }, [videos]);

  // Начальная позиция - начинаем с середины (второй копии)
  const startPosition = videos.length;
  const currentPosition = startPosition + currentSlide;

  useEffect(() => {
    fetchVideos();
    fetchSettings();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching video settings:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const newSlide = prev + 1;
      // Если дошли до конца третьей копии, мгновенно перепрыгиваем к началу второй
      if (newSlide >= videos.length * 2) {
        return 0;
      }
      return newSlide;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const newSlide = prev - 1;
      // Если дошли до начала второй копии, мгновенно перепрыгиваем к концу второй
      if (newSlide < 0) {
        return videos.length - 1;
      }
      return newSlide;
    });
  };

  const handleVideoClick = (video: VideoPresentation) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getVideoUrl = (video: VideoPresentation) => {
    return video.youtube_url || video.video_url;
  };

  const isYouTube = (video: VideoPresentation) => {
    return !!video.youtube_url;
  };

  const getYouTubeEmbedUrl = (youtubeUrl: string) => {
    const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : youtubeUrl;
  };

  if (loading) {
    return (
      <section 
        className="py-20 relative"
      >
        <PageContainer>
          <div className="col-start-2 col-end-12 text-center">
            <div className="text-xl" style={{ color: '#F2F0F0' }}>Загрузка...</div>
          </div>
        </PageContainer>
      </section>
    );
  }

  return (
    <section 
      className="py-8 relative"
      style={{ marginTop: '-50px' }}
    >
      <PageContainer>
        {/* Заголовок и подзаголовок */}
        <div className="col-start-1 col-end-13 text-center mb-16 px-16">
          <h2 
            className="mb-6"
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: '64px',
              fontWeight: 400,
              color: '#F2F0F0',
              textTransform: 'uppercase'
            }}
          >
            {settings?.title || 'ВИДЕО-ПРЕЗЕНТАЦИИ'}
          </h2>
          <p 
            className="text-lg"
            style={{
              fontFamily: 'Inter',
              color: '#F2F0F0',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            {settings?.subtitle || 'Главные особенности и преимущества в коротких видео-роликах'}
          </p>
        </div>

        {/* Слайдер с видео */}
        <div className="col-start-1 col-end-13 relative">
          {/* Контейнер для видео и стрелок */}
          <div className="grid grid-cols-12 gap-6">
            {/* Стрелка влево - колонка 1 */}
            <div className="col-start-1 col-end-2 flex items-center justify-center">
              <button
                onClick={prevSlide}
                className="flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px'
                }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-white"
                >
                  <path 
                    d="M15 18L9 12L15 6" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Контейнер для видео с анимацией */}
            <div className="col-start-2 col-end-12 relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(${currentSlide * -50}%)`
                }}
              >
                {/* Рендерим все элементы слайдера */}
                {sliderItems.map((video, index) => (
                  <div key={`video-${video.sliderIndex}`} className="w-1/2 flex-shrink-0 px-3">
                    <div 
                      className="relative w-full h-80 overflow-hidden cursor-pointer group"
                      style={{ 
                        backgroundColor: '#2a2a2a',
                        borderRadius: '18px'
                      }}
                      onClick={() => handleVideoClick(video)}
                    >
                      {/* Превью изображение */}
                      {video.thumbnail_url && (
                        <div 
                          className="w-full h-full bg-cover bg-center"
                          style={{ 
                            backgroundImage: `url(${video.thumbnail_url})` 
                          }}
                        />
                      )}

                      {/* Overlay с информацией */}
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center group-hover:bg-opacity-40 transition-all duration-300">
                        <div className="text-center">
                          <h3 
                            className="text-lg font-bold mb-2"
                            style={{
                              fontFamily: 'Bebas Neue',
                              color: '#F2F0F0',
                              textTransform: 'uppercase'
                            }}
                          >
                            {video.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Стрелка вправо - колонка 12 */}
            <div className="col-start-12 col-end-13 flex items-center justify-center">
              <button
                onClick={nextSlide}
                className="flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px'
                }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-white"
                >
                  <path 
                    d="M9 18L15 12L9 6" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Модальное окно для видео */}
      <AnimatePresence>
        {showModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Кнопка закрытия */}
              <button
                onClick={closeModal}
                className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
              
              {/* Видео контент */}
              <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
                {isYouTube(selectedVideo) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedVideo.youtube_url!)}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={selectedVideo.video_url} type="video/mp4" />
                  </video>
                )}
              </div>
              
              {/* Информация о видео */}
              <div className="mt-4 text-center">
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{
                    fontFamily: 'Bebas Neue',
                    color: '#F2F0F0',
                    textTransform: 'uppercase'
                  }}
                >
                  {selectedVideo.title}
                </h3>
                <p 
                  className="text-sm"
                  style={{
                    fontFamily: 'Inter',
                    color: '#B8B8B8'
                  }}
                >
                  {selectedVideo.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoPresentationsSection;
