import { compressImage } from '@/lib/utils/clientImageProcessing';
import React, { useEffect, useRef, useState } from 'react';

interface MealFormProps {
  mealDescription: string;
  setMealDescription: (description: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onImageUpload: (file: File) => Promise<void>;
  isLoading: boolean;
  tokenUsage?: {
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
  };
}

export default function MealForm({ mealDescription, setMealDescription, onSubmit, onImageUpload, isLoading, tokenUsage }: MealFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleImageSelect(file);
    }
  };

  const handleImageSelect = async (file: File) => {
    try {
      setIsCompressing(true);
      setError(null);

      // Validate file size (max 10MB)
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > MAX_SIZE) {
        throw new Error('Image is too large. Maximum size is 10MB.');
      }

      // Compress the image
      const compressedFile = await compressImage(file);

      // Create preview URL from compressed file
      const imageUrl = URL.createObjectURL(compressedFile);
      setSelectedImage(imageUrl);
      setSelectedFile(compressedFile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process image. Please try a different image.';
      setError(errorMessage);
      console.error('Image compression error:', err);

      // Clean up any partial state
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
      setSelectedImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDeleteImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedFile) {
      try {
        await onImageUpload(selectedFile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
      }
    } else {
      try {
        await onSubmit(e);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to analyze meal. Please try again.');
      }
    }
  };

  if (!isMounted) {
    return null; // or a loading state
  }

  return (
    <form onSubmit={handleFormSubmit} className='space-y-3'>
      <div>
        <label htmlFor='mealDescription' className='block text-sm font-medium mb-1'>
          What did you eat? (Separate items with commas)
        </label>
        <textarea
          id='mealDescription'
          value={mealDescription}
          onChange={(e) => setMealDescription(e.target.value)}
          className='w-full p-2 border rounded bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400'
          placeholder='Example: 2 eggs, 1 slice of toast, 1 apple'
          rows={3}
          required={selectedFile === null}
          disabled={isLoading}
        />
      </div>

      {error && <div className='p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm'>{error}</div>}

      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'
        } ${isLoading || isCompressing ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageSelect(file);
            }
          }}
          disabled={isLoading || isCompressing}
        />
        <input
          type='file'
          accept='image/*'
          capture='environment'
          id='camera-input'
          className='hidden'
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleImageSelect(file);
            }
          }}
          disabled={isLoading || isCompressing}
        />

        {selectedImage ? (
          <div className='space-y-2'>
            <div className='relative inline-block'>
              <img src={selectedImage} alt='Selected food' className='max-h-48 mx-auto rounded' />
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage();
                }}
                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                disabled={isLoading || isCompressing}
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <p className='text-sm text-gray-400'>Click or drag to replace image</p>
          </div>
        ) : (
          <div className='relative h-48'>
            <div
              className='absolute inset-0 flex flex-col items-center justify-center cursor-pointer'
              onClick={() => !isLoading && !isCompressing && fileInputRef.current?.click()}
            >
              <svg
                className='w-8 h-8 text-gray-400 mb-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              <p className='text-sm text-gray-400'>Click or drag and drop an image here</p>
            </div>
            <button
              type='button'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const cameraInput = document.getElementById('camera-input');
                if (cameraInput) {
                  cameraInput.click();
                }
              }}
              className='absolute left-2 bottom-0 p-2 rounded-full hover:bg-gray-700 transition-colors'
              disabled={isLoading || isCompressing}
            >
              <svg
                className='w-6 h-6 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
            </button>
          </div>
        )}
      </div>

      {tokenUsage && (
        <div className='text-xs text-gray-400 space-y-1'>
          <p>Token Usage:</p>
          <div className='grid grid-cols-3 gap-2'>
            <div>Total: {tokenUsage.totalTokens}</div>
            <div>Prompt: {tokenUsage.promptTokens}</div>
            <div>Completion: {tokenUsage.completionTokens}</div>
          </div>
        </div>
      )}

      <button
        type='submit'
        className='w-full bg-blue-600 text-sm py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed'
        disabled={isLoading || isCompressing}
      >
        {isLoading ? 'Analyzing...' : isCompressing ? 'Compressing...' : 'Analyze Meal'}
      </button>
    </form>
  );
}
