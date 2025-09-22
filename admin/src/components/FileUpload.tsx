import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFilesSelect?: (files: File[]) => void; // для множественной загрузки
  accept?: string;
  maxSize?: number; // в MB
  multiple?: boolean; // разрешить множественную загрузку
  className?: string;
  disabled?: boolean;
  showPreview?: boolean; // показывать превью файлов
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFilesSelect,
  accept = '*/*',
  maxSize = 10,
  multiple = false,
  className = '',
  disabled = false,
  showPreview = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    
    // Проверка размера файла
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Файл слишком большой. Максимальный размер: ${maxSize}MB`);
      return;
    }
    
    if (showPreview) {
      setPreviewFiles([file]);
    }
    
    onFileSelect(file);
  };

  const handleFilesSelect = (files: File[]) => {
    setError(null);
    
    // Проверка размера файлов
    const oversizedFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Некоторые файлы слишком большие. Максимальный размер: ${maxSize}MB`);
      return;
    }
    
    if (showPreview) {
      setPreviewFiles(files);
    }
    
    if (onFilesSelect) {
      onFilesSelect(files);
    } else {
      files.forEach(file => onFileSelect(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (multiple) {
        handleFilesSelect(files);
      } else {
        handleFileSelect(files[0]);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      if (multiple) {
        handleFilesSelect(fileArray);
      } else {
        handleFileSelect(fileArray[0]);
      }
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
          ${className}
        `}
        style={{
          borderColor: isDragging ? '#D71920' : 'rgba(255, 255, 255, 0.2)',
          backgroundColor: isDragging ? 'rgba(215, 25, 32, 0.1)' : 'rgba(255, 255, 255, 0.05)'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12"
            style={{ color: isDragging ? '#D71920' : '#8B8B8B' }}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div>
            <p 
              className="text-sm font-medium"
              style={{ color: isDragging ? '#D71920' : '#F2F0F0' }}
            >
              {isDragging ? 'Отпустите файл здесь' : 'Нажмите или перетащите файл'}
            </p>
            <p 
              className="text-xs"
              style={{ color: '#8B8B8B' }}
            >
              Максимальный размер: {maxSize}MB
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <p 
          className="mt-2 text-sm"
          style={{ color: '#D71920' }}
        >
          {error}
        </p>
      )}

      {/* Превью файлов */}
      {showPreview && previewFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 
            className="text-sm font-medium"
            style={{ color: '#B8B8B8' }}
          >
            Выбранные файлы:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {previewFiles.map((file, index) => (
              <div 
                key={index}
                className="relative p-2 rounded border"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                {file.type.startsWith('image/') ? (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={file.name}
                    className="w-full h-20 object-cover rounded"
                  />
                ) : file.type.startsWith('video/') ? (
                  <div className="w-full h-20 bg-gray-700 rounded flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                ) : (
                  <div className="w-full h-20 bg-gray-700 rounded flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                    </svg>
                  </div>
                )}
                <p 
                  className="text-xs mt-1 truncate"
                  style={{ color: '#8B8B8B' }}
                  title={file.name}
                >
                  {file.name}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: '#8B8B8B' }}
                >
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
