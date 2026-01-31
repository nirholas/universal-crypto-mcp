'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Upload, X, File, Image, FileText, Film, Music, CheckCircle, AlertCircle } from 'lucide-react';

// ============================================================
// Types
// ============================================================

interface FileWithPreview extends File {
  preview?: string;
  progress?: number;
  status?: 'uploading' | 'success' | 'error';
  error?: string;
}

// ============================================================
// File Dropzone
// ============================================================

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  accept?: string[];
  maxSize?: number; // bytes
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export function Dropzone({
  onDrop,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  disabled = false,
  className,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent, isDraggingOver: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(isDraggingOver);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).slice(0, maxFiles);
    const validFiles = files.filter(file => {
      if (maxSize && file.size > maxSize) return false;
      if (accept && !accept.some(type => file.type.match(type))) return false;
      return true;
    });

    onDrop(validFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, maxFiles);
    onDrop(files);
    e.target.value = '';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      className={cn(
        'relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer',
        isDragging
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-white/20 hover:border-white/40 bg-white/5',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onDragEnter={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDragOver={(e) => handleDrag(e, true)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      whileHover={!disabled ? { scale: 1.01 } : undefined}
      animate={{ borderColor: isDragging ? '#8b5cf6' : undefined }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={maxFiles > 1}
        accept={accept?.join(',')}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />

      <motion.div
        animate={{ scale: isDragging ? 1.1 : 1 }}
        className="mx-auto w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4"
      >
        <Upload className="w-8 h-8 text-purple-400" />
      </motion.div>

      <p className="text-white font-medium mb-1">
        {isDragging ? 'Drop files here' : 'Drag and drop files here'}
      </p>
      <p className="text-sm text-white/60">
        or click to browse
      </p>

      <div className="mt-4 text-xs text-white/40">
        {accept && <p>Accepted: {accept.join(', ')}</p>}
        <p>Max size: {formatBytes(maxSize)} • Max files: {maxFiles}</p>
      </div>
    </motion.div>
  );
}

// ============================================================
// File Preview Card
// ============================================================

interface FilePreviewProps {
  file: FileWithPreview;
  onRemove?: () => void;
  className?: string;
}

export function FilePreview({ file, onRemove, className }: FilePreviewProps) {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Film;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return File;
  };

  const Icon = getFileIcon(file.type);
  const isImage = file.type.startsWith('image/');

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'relative flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10',
        className
      )}
    >
      {/* Preview/Icon */}
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
        {isImage && file.preview ? (
          <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <Icon className="w-6 h-6 text-white/60" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{file.name}</p>
        <p className="text-xs text-white/50">{formatBytes(file.size)}</p>

        {/* Progress bar */}
        {file.status === 'uploading' && typeof file.progress === 'number' && (
          <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${file.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Status */}
      {file.status === 'success' && (
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
      )}
      {file.status === 'error' && (
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
      )}

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

// ============================================================
// File Upload Manager
// ============================================================

interface FileUploadProps {
  value: FileWithPreview[];
  onChange: (files: FileWithPreview[]) => void;
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  accept,
  maxSize,
  maxFiles = 10,
  className,
}: FileUploadProps) {
  const handleDrop = (newFiles: File[]) => {
    const filesWithPreview = newFiles.map(file => {
      const f = file as FileWithPreview;
      if (file.type.startsWith('image/')) {
        f.preview = URL.createObjectURL(file);
      }
      f.status = 'success'; // Mock success for demo
      return f;
    });

    const combined = [...value, ...filesWithPreview].slice(0, maxFiles);
    onChange(combined);
  };

  const handleRemove = (index: number) => {
    const file = value[index];
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Dropzone
        onDrop={handleDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles - value.length}
        disabled={value.length >= maxFiles}
      />

      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {value.map((file, i) => (
              <FilePreview
                key={`${file.name}-${i}`}
                file={file}
                onRemove={() => handleRemove(i)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Image Upload with Preview
// ============================================================

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null, file?: File) => void;
  aspectRatio?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  aspectRatio = '16/9',
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      onChange(URL.createObjectURL(file), file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(URL.createObjectURL(file), file);
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-xl overflow-hidden border-2 border-dashed transition-colors',
        isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 bg-white/5',
        className
      )}
      style={{ aspectRatio }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="sr-only"
      />

      {value ? (
        <>
          <img src={value} alt="Upload" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="p-2 bg-red-500 rounded-full text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
          <Image className="w-10 h-10 text-white/40 mb-2" />
          <p className="text-sm text-white/60">Click or drag to upload</p>
        </div>
      )}
    </div>
  );
}
