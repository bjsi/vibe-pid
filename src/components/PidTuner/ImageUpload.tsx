
import { useState, useCallback } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  loading?: boolean;
}

const ImageUpload = ({ onImageUpload, loading }: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          onImageUpload(file);
        }
      }
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        onImageUpload(files[i]);
        break;
      }
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  return (
    <div
      className={`relative min-h-[100px] rounded-lg border-2 border-dashed ${
        dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      } transition-colors`}
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        ) : (
          <div className="text-center">
            <ImagePlus className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Paste or drag an image here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
