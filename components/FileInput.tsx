
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileInputProps {
  onFileSelect: (file: File | null) => void;
  fileName: string;
}

const FileInput: React.FC<FileInputProps> = ({ onFileSelect, fileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".vtt,.srt,.txt"
      />
      <div
        className="flex justify-center w-full px-6 py-10 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-pink-500 transition-colors duration-200"
        onClick={handleButtonClick}
      >
        <div className="text-center">
          <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
          <p className="mt-1 text-sm text-gray-400">
            <span className="font-semibold text-pink-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            .vtt, .srt, or .txt files
          </p>
          {fileName && (
              <p className="mt-4 text-sm font-medium text-green-400 bg-green-900/50 px-3 py-1 rounded-md">
                  Selected: {fileName}
              </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileInput;
