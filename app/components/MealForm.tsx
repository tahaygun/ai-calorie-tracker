import { compressImage } from '@/lib/utils/clientImageProcessing';
import React, { useEffect, useRef, useState } from 'react';
import { FaCamera, FaImage, FaMagic, FaStar, FaTimes } from 'react-icons/fa';

interface MealFormProps {
  mealDescription: string;
  setMealDescription: (_description: string) => void;
  onSubmit: (_e: React.FormEvent) => Promise<void>;
  onImageUpload: (_file: File) => Promise<void>;
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
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl shadow-black/30 backdrop-blur-md space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <label htmlFor="mealDescription" className="font-semibold text-slate-100 text-base block">
            What did you eat?
          </label>
          <p className="text-xs text-slate-400">Describe items or upload a meal photo for AI analysis</p>
        </div>
        <button
          type="button"
          onClick={onOpenFavorites}
          className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:scale-105 transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold"
          aria-label="Open favorite meals text"
        >
          <FaStar className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Favorites</span>
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            id="mealDescription"
            value={mealDescription}
            onChange={e => setMealDescription(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-100 placeholder-slate-500 p-3.5 text-sm transition-all outline-none resize-y min-h-[90px] shadow-inner font-sans"
            placeholder={
              selectedImage
                ? 'Add an optional description of your meal here...'
                : 'e.g., 2 eggs, 1 slice of toast with butter, 1 apple'
            }
            rows={3}
            required={selectedFile === null}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="bg-rose-500/10 p-3.5 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
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
            <div className="flex justify-center">
              <div className="relative group rounded-2xl overflow-hidden border border-slate-700/80 shadow-md">
                <img src={selectedImage} alt="Selected food preview" className="max-h-40 object-cover" />
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteImage();
                  }}
                  className="absolute top-2 right-2 bg-slate-900/90 hover:bg-rose-600 border border-slate-700 p-1.5 rounded-full text-white transition-all shadow-lg"
                  disabled={isLoading || isCompressing}
                  aria-label="Remove image"
                >
                  <FaTimes className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => !isLoading && !isCompressing && fileInputRef.current?.click()}
                className="flex justify-center items-center gap-2 py-2.5 px-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm active:scale-[0.98]"
                disabled={isLoading || isCompressing}
              >
                <FaImage className="w-4 h-4 text-blue-400" />
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
                className="flex justify-center items-center gap-2 py-2.5 px-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm active:scale-[0.98]"
                disabled={isLoading || isCompressing}
              >
                <FaCamera className="w-4 h-4 text-emerald-400" />
                Take Photo
              </button>
            </div>
          )}
        </div>

        {tokenUsage && (
          <div className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Tokens: {tokenUsage.totalTokens}</span>
            <span>Prompt: {tokenUsage.promptTokens}</span>
            <span>Completion: {tokenUsage.completionTokens}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none disabled:text-slate-500 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          disabled={isLoading || isCompressing}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing Meal with AI...</span>
            </>
          ) : isCompressing ? (
            <span>Optimizing Image...</span>
          ) : (
            <>
              <FaMagic className="w-4 h-4" />
              <span>Analyze Meal</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
