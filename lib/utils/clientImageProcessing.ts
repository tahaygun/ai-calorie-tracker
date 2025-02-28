export async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      // Set src after binding onload to ensure we don't miss the load event
      img.onload = () => {
        try {
          // Clean up object URL
          URL.revokeObjectURL(objectUrl);

          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 800;

          if (width > MAX_SIZE || height > MAX_SIZE) {
            if (width > height) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            } else {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          // Draw and compress image
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }

          // Draw image
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Could not compress image - blob creation failed'));
                return;
              }

              // Create new file from blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              // Verify the compressed file
              if (compressedFile.size === 0) {
                reject(new Error('Compressed file is empty'));
                return;
              }

              resolve(compressedFile);
            },
            'image/jpeg',
            0.8 // quality
          );
        } catch (err) {
          console.error('Error during image processing:', err);
          reject(err);
        }
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        console.error('Error loading image:', err);
        reject(new Error('Failed to load image. Please make sure the file is a valid image.'));
      };

      // Set src after binding events
      img.src = objectUrl;
    } catch (err) {
      console.error('Error in compression setup:', err);
      reject(err);
    }
  });
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      try {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = base64String.split(',')[1];
        if (!base64) {
          throw new Error('Failed to convert file to base64');
        }
        resolve(base64);
      } catch (err) {
        console.error('Error converting to base64:', err);
        reject(err);
      }
    };
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(error);
    };
  });
}
