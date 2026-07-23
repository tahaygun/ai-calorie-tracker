import { exportUserData, importUserData, validateUserData } from '@/lib/exportImport';
import React, { useRef, useState } from 'react';
import { FaDownload, FaUpload } from 'react-icons/fa';

export default function DataPortability() {
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [includeApiKey, setIncludeApiKey] = useState(true);

  const handleExport = () => {
    try {
      const userData = exportUserData();
      const jsonData = JSON.stringify(userData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const date = new Date().toISOString().split('T')[0];
      link.download = `calorie-tracker-export-${date}.json`;

      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const jsonData = e.target?.result as string;
        const data = JSON.parse(jsonData);

        const validation = validateUserData(data);

        if (validation.valid) {
          importUserData(data, { includeApiKey });
          setImportStatus({
            success: true,
            message: 'Data imported successfully. Reload the page to see changes.',
          });

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

  return (
    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
      <div>
        <h3 className="font-semibold text-slate-100 text-sm">Backup & Restore</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Export your meal logs and settings to JSON, or restore from a backup file.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleExport}
          className="flex justify-center items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
        >
          <FaDownload className="w-3.5 h-3.5" />
          <span>Export Data</span>
        </button>

        <button
          type="button"
          onClick={handleImportClick}
          className="flex justify-center items-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold border border-slate-700 rounded-xl text-xs transition-all active:scale-[0.98]"
        >
          <FaUpload className="w-3.5 h-3.5" />
          <span>Import Backup</span>
        </button>
      </div>

      <div className="pt-2 border-t border-slate-800/80 space-y-1">
        <label className="flex items-center text-xs text-slate-300 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={includeApiKey}
            onChange={e => setIncludeApiKey(e.target.checked)}
            className="mr-2 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500/20"
          />
          Include API key in import
        </label>
        <p className="text-[11px] text-slate-500">
          Uncheck to preserve your current device API key during import.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {importStatus && (
        <div
          className={`p-3 rounded-xl text-xs font-medium ${
            importStatus.success
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {importStatus.message}
        </div>
      )}
    </div>
  );
}
