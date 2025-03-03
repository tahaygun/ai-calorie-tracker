import { compressImage } from '@/lib/utils/clientImageProcessing';
import React, { useEffect, useRef, useState } from 'react';
import { FaImage, FaStar } from 'react-icons/fa';

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
  onOpenFavorites: () => void;
}

export default function MealForm({
  mealDescription,
  setMealDescription,
  onSubmit,
  onImageUpload,
  isLoading,
  tokenUsage,
  onOpenFavorites,
}: MealFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to process image. Please try a different image.';
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
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label htmlFor="mealDescription" className="font-medium text-sm">
          What did you eat? (Separate items with commas)
        </label>
        <button
          type="button"
          onClick={onOpenFavorites}
          className="p-2 hover:text-yellow-300 text-sm transition-colors"
          aria-label="Open favorite meals"
        >
          <FaStar className="w-6 h-6 text-yellow-400" />
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-3">
        <textarea
          id="mealDescription"
          value={mealDescription}
          onChange={e => setMealDescription(e.target.value)}
          className="bg-gray-800 p-2 border border-gray-700 rounded w-full text-gray-100 placeholder-gray-400"
          placeholder={
            selectedImage
              ? 'Add a description of your meal if needed here.'
              : 'Example: 2 eggs, 1 slice of toast, 1 apple'
          }
          rows={3}
          required={selectedFile === null}
          disabled={isLoading}
        />

        {error && (
          <div className="bg-red-900/50 p-3 border border-red-700 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageSelect(file);
              }
            }}
            disabled={isLoading || isCompressing}
          />
          <input
            type="file"
            accept="image/*"
            capture="environment"
            id="camera-input"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageSelect(file);
              }
            }}
            disabled={isLoading || isCompressing}
          />

          {selectedImage ? (
            <div className="flex justify-center space-y-2">
              <div className="relative">
                <img src={selectedImage} alt="Selected food" className="rounded max-h-32" />
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteImage();
                  }}
                  className="-top-2 -right-2 absolute bg-red-500 hover:bg-red-600 p-1 rounded-full text-white"
                  disabled={isLoading || isCompressing}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => !isLoading && !isCompressing && fileInputRef.current?.click()}
                className="flex flex-1 justify-center items-center gap-2 hover:bg-gray-700 p-2 border border-gray-700 rounded transition-colors"
                disabled={isLoading || isCompressing}
              >
                <FaImage className="w-5 h-5 text-gray-400" />
                Upload Image
              </button>
              <button
                type="button"
                onClick={() => {
                  const cameraInput = document.getElementById('camera-input');
                  if (cameraInput) {
                    cameraInput.click();
                  }
                }}
                className="flex flex-1 justify-center items-center gap-2 hover:bg-gray-700 p-2 border border-gray-700 rounded transition-colors"
                disabled={isLoading || isCompressing}
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Take Photo
              </button>
            </div>
          )}
        </div>

        {tokenUsage && (
          <div className="space-y-1 text-gray-400 text-xs">
            <p>Token Usage:</p>
            <div className="gap-2 grid grid-cols-3">
              <div>Total: {tokenUsage.totalTokens}</div>
              <div>Prompt: {tokenUsage.promptTokens}</div>
              <div>Completion: {tokenUsage.completionTokens}</div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-4 py-2 rounded w-full text-sm transition-colors disabled:cursor-not-allowed"
          disabled={isLoading || isCompressing}
        >
          {isLoading ? 'Analyzing...' : isCompressing ? 'Compressing...' : 'Analyze Meal'}
        </button>
      </form>
    </div>
  );
}
