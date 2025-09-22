import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import FileUpload from '../../components/FileUpload';
import VideoPlayer from '../../components/VideoPlayer';
import DataExporter from '../../components/DataExporter';

interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  youtube_url: string;
  thumbnail_url: string;
  duration: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SortableVideoProps {
  video: Video;
  index: number;
  onEdit: (video: Video) => void;
  onDelete: (id: number) => void;
}

const SortableVideo: React.FC<SortableVideoProps> = ({ video, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="admin-card"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-4">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-700 rounded"
            style={{ color: '#8B8B8B' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              {video.thumbnail_url && (
                <div className="relative">
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <h3 
                  className="text-xl font-semibold mb-1"
                  style={{
                    fontFamily: 'Roboto Flex',
                    fontWeight: 500,
                    color: '#F2F0F0'
                  }}
                >
                  {video.title}
                </h3>
                <p 
                  className="text-sm mb-2"
                  style={{
                    fontFamily: 'Inter',
                    color: '#B8B8B8'
                  }}
                >
                  {video.description}
                </p>
                <div 
                  className="text-xs"
                  style={{ color: '#8B8B8B' }}
                >
                  Длительность: {video.duration} | 
                  Порядок: {video.sort_order} | 
                  Статус: {video.is_active ? 'Активен' : 'Неактивен'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(video)}
            className="admin-button-secondary"
          >
            Редактировать
          </button>
          <button
            onClick={() => onDelete(video.id)}
            className="admin-button-danger"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

interface VideoSettings {
  id: number;
  title: string;
  subtitle: string;
  created_at: string;
  updated_at: string;
}

const VideosAdmin: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [settings, setSettings] = useState<VideoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      const response = await fetch('/api/videos/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching video settings:', error);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Ошибка загрузки файла');
    }
    
    const result = await response.json();
    return result.data.url;
  };

  const handleVideoUpload = async (file: File) => {
    if (!editingVideo) return;
    
    setUploadingVideo(true);
    try {
      const videoUrl = await uploadFile(file);
      setEditingVideo({ ...editingVideo, video_url: videoUrl });
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Ошибка загрузки видео');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!editingVideo) return;
    
    setUploadingThumbnail(true);
    try {
      const thumbnailUrl = await uploadFile(file);
      setEditingVideo({ ...editingVideo, thumbnail_url: thumbnailUrl });
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('Ошибка загрузки превью');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv' | 'xlsx') => {
    try {
      let data: string;
      let mimeType: string;
      let filename: string;

      switch (format) {
        case 'json':
          data = JSON.stringify(videos, null, 2);
          mimeType = 'application/json';
          filename = 'videos.json';
          break;
        case 'csv':
          const csvHeaders = 'ID,Title,Description,Video URL,Thumbnail URL,Duration,Sort Order,Active,Created At,Updated At\n';
          const csvRows = videos.map(video => 
            `${video.id},"${video.title}","${video.description}","${video.video_url}","${video.thumbnail_url}","${video.duration}",${video.sort_order},${video.is_active},"${video.created_at}","${video.updated_at}"`
          ).join('\n');
          data = csvHeaders + csvRows;
          mimeType = 'text/csv';
          filename = 'videos.csv';
          break;
        case 'xlsx':
          // Для Excel нужна библиотека, пока экспортируем как CSV
          data = JSON.stringify(videos, null, 2);
          mimeType = 'application/json';
          filename = 'videos.json';
          break;
        default:
          throw new Error('Неподдерживаемый формат');
      }

      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo({ ...video });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingVideo({
      id: 0,
      title: '',
      description: '',
      video_url: '',
      youtube_url: '',
      thumbnail_url: '',
      duration: '',
      sort_order: videos.length + 1,
      is_active: true,
      created_at: '',
      updated_at: ''
    });
    setIsCreating(true);
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/videos/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const result = await response.json();
        setSettings(result.data);
        setShowSettings(false);
      } else {
        console.error('Error saving video settings');
      }
    } catch (error) {
      console.error('Error saving video settings:', error);
    }
  };

  const handleSave = async () => {
    if (!editingVideo) return;

    try {
      const url = isCreating 
        ? '/api/videos'
        : `/api/videos/${editingVideo.id}`;
      
      const method = isCreating ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingVideo),
      });

      if (response.ok) {
        const result = await response.json();
        if (isCreating) {
          setVideos([...videos, result.data]);
        } else {
          setVideos(videos.map(video => 
            video.id === editingVideo.id ? result.data : video
          ));
        }
        setEditingVideo(null);
        setIsCreating(false);
      } else {
        console.error('Error saving video');
      }
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить это видео?')) return;

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVideos(videos.filter(video => video.id !== id));
      } else {
        console.error('Error deleting video');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = videos.findIndex(video => video.id === active.id);
      const newIndex = videos.findIndex(video => video.id === over.id);

      const newVideos = arrayMove(videos, oldIndex, newIndex);
      setVideos(newVideos);

      // Обновляем порядок в базе данных
      try {
        const updates = newVideos.map((video, index) => ({
          id: video.id,
          sort_order: index + 1
        }));

        const updatePromises = updates.map(update => 
          fetch(`/api/videos/${update.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...videos.find(video => video.id === update.id),
              sort_order: update.sort_order
            }),
          })
        );

        await Promise.all(updatePromises);
      } catch (error) {
        console.error('Error updating sort order:', error);
        setVideos(videos);
      }
    }
  };

  const handleCancel = () => {
    setEditingVideo(null);
    setIsCreating(false);
  };

  if (loading) {
    return <div className="p-8">Загрузка...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-6"
          style={{
            fontFamily: 'Roboto Flex',
            fontWeight: 478,
            fontSize: '32px',
            lineHeight: '100%',
            letterSpacing: '-1px',
            fontVariationSettings: '"wdth" 10, "YTUC" 850, "YTAS" 900',
            color: '#F2F0F0'
          }}
        >
          Управление видео-презентациями
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleCreate}
            className="admin-button-primary"
          >
            Добавить новое видео
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="admin-button-secondary"
          >
            Настройки секции
          </button>
          <DataExporter onExport={handleExport} />
        </div>
      </div>

      {/* Список видео с drag and drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={videos.map(video => video.id)} strategy={verticalListSortingStrategy}>
          <div className="grid gap-6">
            {videos.map((video, index) => (
              <SortableVideo
                key={video.id}
                video={video}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Форма редактирования */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="admin-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 
              className="text-2xl font-bold mb-6"
              style={{
                fontFamily: 'Roboto Flex',
                fontWeight: 478,
                color: '#F2F0F0'
              }}
            >
              {isCreating ? 'Создание нового видео' : 'Редактирование видео'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Название видео
                </label>
                <input
                  type="text"
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                  className="admin-input"
                />
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Описание
                </label>
                <textarea
                  value={editingVideo.description}
                  onChange={(e) => setEditingVideo({...editingVideo, description: e.target.value})}
                  className="admin-input h-32"
                />
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={editingVideo.youtube_url || ''}
                  onChange={(e) => setEditingVideo({...editingVideo, youtube_url: e.target.value})}
                  className="admin-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Локальный видео файл
                </label>
                <FileUpload
                  onFileSelect={handleVideoUpload}
                  accept="video/*"
                  maxSize={100}
                  disabled={uploadingVideo}
                  showPreview={true}
                />
                {editingVideo.video_url && (
                  <div className="mt-4">
                    <VideoPlayer
                      src={`${editingVideo.video_url}`}
                      className="w-full h-64"
                    />
                    <input
                      type="text"
                      value={editingVideo.video_url}
                      onChange={(e) => setEditingVideo({...editingVideo, video_url: e.target.value})}
                      className="admin-input mt-2"
                      placeholder="Или введите URL вручную"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Превью изображение
                </label>
                <FileUpload
                  onFileSelect={handleThumbnailUpload}
                  accept="image/*"
                  maxSize={5}
                  disabled={uploadingThumbnail}
                  showPreview={true}
                />
                {editingVideo.thumbnail_url && (
                  <div className="mt-2">
                    <img 
                      src={`${editingVideo.thumbnail_url}`} 
                      alt="Thumbnail preview" 
                      className="w-32 h-20 object-cover rounded"
                    />
                    <input
                      type="text"
                      value={editingVideo.thumbnail_url}
                      onChange={(e) => setEditingVideo({...editingVideo, thumbnail_url: e.target.value})}
                      className="admin-input mt-2"
                      placeholder="Или введите URL вручную"
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Длительность (например: 2:30)
                </label>
                <input
                  type="text"
                  value={editingVideo.duration}
                  onChange={(e) => setEditingVideo({...editingVideo, duration: e.target.value})}
                  className="admin-input"
                  placeholder="2:30"
                />
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Порядок сортировки
                </label>
                <input
                  type="number"
                  value={editingVideo.sort_order}
                  onChange={(e) => setEditingVideo({...editingVideo, sort_order: parseInt(e.target.value) || 0})}
                  className="admin-input"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingVideo.is_active}
                  onChange={(e) => setEditingVideo({...editingVideo, is_active: e.target.checked})}
                  className="mr-2"
                  style={{ accentColor: '#D71920' }}
                />
                <label 
                  htmlFor="is_active" 
                  className="text-sm font-medium"
                  style={{ color: '#B8B8B8' }}
                >
                  Активен
                </label>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                className="admin-button-success"
              >
                Сохранить
              </button>
              <button
                onClick={handleCancel}
                className="admin-button-secondary"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно настроек секции */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="admin-card max-w-2xl w-full mx-4">
            <h2 
              className="text-2xl font-bold mb-6"
              style={{
                fontFamily: 'Roboto Flex',
                fontWeight: 478,
                color: '#F2F0F0'
              }}
            >
              Настройки секции видео-презентаций
            </h2>
            
            <div className="space-y-4">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Заголовок секции
                </label>
                <input
                  type="text"
                  value={settings?.title || ''}
                  onChange={(e) => setSettings({...settings, title: e.target.value} as VideoSettings)}
                  className="admin-input"
                  placeholder="ВИДЕО-ПРЕЗЕНТАЦИИ"
                />
              </div>
              
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: '#B8B8B8' }}
                >
                  Подзаголовок
                </label>
                <input
                  type="text"
                  value={settings?.subtitle || ''}
                  onChange={(e) => setSettings({...settings, subtitle: e.target.value} as VideoSettings)}
                  className="admin-input"
                  placeholder="Главные особенности и преимущества в коротких видео-роликах"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSaveSettings}
                className="admin-button-success"
              >
                Сохранить
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="admin-button-secondary"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosAdmin;
