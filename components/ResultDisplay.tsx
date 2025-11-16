
import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { OutputFormat } from '../types';

interface ResultDisplayProps {
  content: string;
  outputFormat: OutputFormat;
  originalFileName: string;
}

const MIME_TYPES: Record<OutputFormat, string> = {
  [OutputFormat.VTT]: 'text/vtt',
  [OutputFormat.SRT]: 'application/x-subrip',
  [OutputFormat.TXT]: 'text/plain',
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, outputFormat, originalFileName }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }, () => {
      setCopyStatus('Failed!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    });
  };

  const handleDownload = () => {
    const mimeType = MIME_TYPES[outputFormat];
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const baseFileName = originalFileName.split('.').slice(0, -1).join('.') || 'translated_subtitle';
    a.href = url;
    a.download = `${baseFileName}.${outputFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          readOnly
          value={content}
          className="w-full h-96 p-4 font-mono text-sm text-gray-300 bg-gray-900 border border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500 resize-none"
          placeholder="Translation will appear here..."
        />
        <div className="absolute top-3 right-3 flex space-x-2">
           <button
            onClick={handleCopy}
            className="p-2 text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
            title={copyStatus}
          >
            <CopyIcon className="w-5 h-5" />
          </button>
           <button
            onClick={handleDownload}
            className="p-2 text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
            title={`Download .${outputFormat} file`}
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
