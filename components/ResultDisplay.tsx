import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { OutputFormat } from '../types';
import { vttToSrt, srtToVtt, toTxt } from '../utils/subtitleConverter';

interface ResultDisplayProps {
  content: string;
  outputFormat: OutputFormat;
  originalFileName: string;
  isLoading: boolean;
}

const MIME_TYPES: Record<OutputFormat, string> = {
  [OutputFormat.VTT]: 'text/vtt',
  [OutputFormat.SRT]: 'application/x-subrip',
  [OutputFormat.TXT]: 'text/plain',
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, outputFormat, originalFileName, isLoading }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopy = () => {
    if (!content || isLoading) return;
    navigator.clipboard.writeText(content).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    }, () => {
      setCopyStatus('Failed!');
      setTimeout(() => setCopyStatus('Copy'), 2000);
    });
  };

  const handleDownload = (targetFormat: OutputFormat) => {
    if (!content || isLoading) return;

    let convertedContent = '';
    let sourceContent = content;

    // Determine the most likely source format if the output is text
    // This is a simple heuristic. A more robust solution might need more context.
    const isLikelyVtt = sourceContent.includes('WEBVTT');
    const isLikelySrt = !isLikelyVtt && /\d+\r?\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/.test(sourceContent);

    const effectiveOutputFormat = outputFormat === OutputFormat.TXT 
        ? (isLikelyVtt ? OutputFormat.VTT : isLikelySrt ? OutputFormat.SRT : OutputFormat.TXT)
        : outputFormat;


    if (effectiveOutputFormat === OutputFormat.VTT) {
      if (targetFormat === OutputFormat.SRT) convertedContent = vttToSrt(sourceContent);
      else if (targetFormat === OutputFormat.TXT) convertedContent = toTxt(sourceContent);
      else convertedContent = sourceContent; // VTT to VTT
    } else if (effectiveOutputFormat === OutputFormat.SRT) {
      if (targetFormat === OutputFormat.VTT) convertedContent = srtToVtt(sourceContent);
      else if (targetFormat === OutputFormat.TXT) convertedContent = toTxt(sourceContent);
      else convertedContent = sourceContent; // SRT to SRT
    } else { // Source is TXT
      if (targetFormat === OutputFormat.TXT) convertedContent = sourceContent;
      else {
        // Conversion from TXT to timed formats is not supported as there are no timestamps
        console.error(`Conversion from TXT to ${targetFormat} is not supported.`);
        return;
      }
    }


    const mimeType = MIME_TYPES[targetFormat];
    const blob = new Blob([convertedContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const baseFileName = originalFileName.split('.').slice(0, -1).join('.') || 'translated_subtitle';
    a.href = url;
    a.download = `${baseFileName}.${targetFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const canConvertToTimedText = outputFormat === OutputFormat.VTT || outputFormat === OutputFormat.SRT || toTxt(content) !== content;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-200">Translated Result</h2>
      <div className="relative">
        <textarea
          readOnly
          value={content}
          className="w-full h-96 p-4 font-mono text-sm text-gray-300 bg-gray-900 border border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500 resize-none"
          placeholder="Translation will appear here..."
        />
        <div className="absolute top-3 right-3 flex items-center space-x-2">
           <button
            onClick={handleCopy}
            disabled={!content || isLoading}
            className="p-2 text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={copyStatus}
          >
            <CopyIcon className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-1.5 pl-2 border-l border-gray-600">
            <DownloadIcon className="w-5 h-5 text-gray-500" />
            
            <button
                onClick={() => handleDownload(OutputFormat.VTT)}
                disabled={!content || isLoading || !canConvertToTimedText}
                className="px-2.5 py-1.5 text-xs font-semibold text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download as .vtt"
            >
                VTT
            </button>

            <button
                onClick={() => handleDownload(OutputFormat.SRT)}
                disabled={!content || isLoading || !canConvertToTimedText}
                className="px-2.5 py-1.5 text-xs font-semibold text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download as .srt"
            >
                SRT
            </button>

            <button
                onClick={() => handleDownload(OutputFormat.TXT)}
                disabled={!content || isLoading}
                className="px-2.5 py-1.5 text-xs font-semibold text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download as .txt"
            >
                TXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;