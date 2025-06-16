import { exportUserData, importUserData, validateUserData } from '@/lib/exportImport';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRef, useState } from 'react';

export default function DataPortability() {
  const { user } = useAuth();
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!user) {
      alert('Please sign in to export data');
      return;
    }

    try {
      // Get all user data
      const userData = exportUserData(user.uid);

      // Convert to JSON and create blob
      const jsonData = JSON.stringify(userData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });

      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      link.download = `calorie-tracker-export-${date}.json`;

      // Trigger download and cleanup
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const handleImportClick = () => {
    if (!user) {
      alert('Please sign in to import data');
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const jsonData = e.target?.result as string;
        const data = JSON.parse(jsonData);

        // Validate the imported data
        const validation = validateUserData(data);

        if (validation.valid) {
          // Import the data
          importUserData(data, user.uid);
          setImportStatus({
            success: true,
            message: 'Data imported successfully. Reload the page to see changes.',
          });

          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          setImportStatus({
            success: false,
            message: validation.message || 'Invalid data format',
          });
        }
      } catch (error) {
        console.error('Error importing data:', error);
        setImportStatus({
          success: false,
          message: 'Error parsing JSON file. Please check the file format.',
        });
      }
    };

    reader.readAsText(file);
  };

  if (!user) {
    return (
      <div className="bg-gray-700 p-4 rounded-lg">
        <h2 className="mb-4 font-medium text-lg">Data Portability</h2>
        <p className="text-gray-300 text-sm">
          Please sign in to access data import and export features.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h2 className="mb-4 font-medium text-lg">Data Portability</h2>
      <p className="mb-4 text-gray-300 text-sm">
        Export your data to use on another device or create a backup. Import previously exported
        data to restore your settings and meal history.
      </p>

      <div className="flex flex-col space-y-4">
        <button
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition-colors"
        >
          Export Data
        </button>

        <div>
          <button
            onClick={handleImportClick}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full text-white transition-colors"
          >
            Import Data
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      {importStatus && (
        <div
          className={`mt-4 p-3 rounded text-sm ${
            importStatus.success ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
          }`}
        >
          {importStatus.message}
        </div>
      )}
    </div>
  );
}