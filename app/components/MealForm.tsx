/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, useEffect } from 'react';

interface MealFormProps {
  mealDescription: string;
  setMealDescription: (description: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onImageUpload: (file: File) => Promise<void>;
  isEditing: boolean;
  isLoading: boolean;
  tokenUsage?: {
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
  };
}

export default function MealForm({
  mealDescription,
  setMealDescription,
  onSubmit,
  onImageUpload,
  isEditing,
  isLoading,
  tokenUsage,
}: MealFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMounted, setIsMounted] = useState(false);

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
      handleImageSelect(file);
    }
  };

  const handleImageSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setSelectedFile(file);
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
    if (selectedFile) {
      await onImageUpload(selectedFile);
    } else {
      await onSubmit(e);
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
          disabled={isEditing || isLoading}
        />
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
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
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <p className='text-sm text-gray-400'>Click or drag to replace image</p>
          </div>
        ) : (
          <div className='space-y-2'>
            <svg
              className='w-8 h-8 mx-auto text-gray-400'
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
        disabled={isEditing || isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Meal'}
      </button>
    </form>
  );
}
