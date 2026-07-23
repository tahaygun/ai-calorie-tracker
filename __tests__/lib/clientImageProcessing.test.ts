import { compressImage, fileToBase64 } from '@/lib/utils/clientImageProcessing';
import { describe, expect, it, vi } from 'vitest';

describe('clientImageProcessing utilities', () => {
  describe('compressImage', () => {
    it('should reject non-image file types', async () => {
      const nonImageFile = new File(['hello'], 'document.pdf', { type: 'application/pdf' });
      await expect(compressImage(nonImageFile)).rejects.toThrow('File is not an image');
    });

    it('should process and compress an image file', async () => {
      // Mock Image & canvas context behavior in Vitest JSDOM
      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: vi.fn().mockReturnValue({
          drawImage: vi.fn(),
        }),
        toBlob: vi.fn((callback: (_blob: Blob | null) => void) => {
          const blob = new Blob(['compressed-image-data'], { type: 'image/jpeg' });
          callback(blob);
        }),
      };

      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return mockCanvas as unknown as HTMLCanvasElement;
        }
        return document.createElement(tagName);
      });

      // Mock Image constructor
      class MockImage {
        width = 1600;
        height = 1200;
        onload: (() => void) | null = null;
        onerror: ((_err: unknown) => void) | null = null;
        private _src = '';

        set src(url: string) {
          this._src = url;
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
        get src() {
          return this._src;
        }
      }

      vi.stubGlobal('Image', MockImage);

      const mockFile = new File(['dummy-data'], 'test.png', { type: 'image/png' });
      const result = await compressImage(mockFile);

      expect(result).toBeInstanceOf(File);
      expect(result.type).toBe('image/jpeg');
    });
  });

  describe('fileToBase64', () => {
    it('should convert file to base64 string without data prefix', async () => {
      const file = new File(['sample content'], 'sample.txt', { type: 'text/plain' });
      
      // Stub FileReader
      class MockFileReader {
        result: string | null = null;
        onload: (() => void) | null = null;
        onerror: ((_err: unknown) => void) | null = null;

        readAsDataURL() {
          this.result = 'data:text/plain;base64,c2FtcGxlIGNvbnRlbnQ=';
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      }

      vi.stubGlobal('FileReader', MockFileReader);

      const base64 = await fileToBase64(file);
      expect(base64).toBe('c2FtcGxlIGNvbnRlbnQ=');
    });
  });
});
