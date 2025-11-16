
import React, { useState, useCallback } from 'react';
import { Language, OutputFormat } from './types';
import { LANGUAGE_OPTIONS, OUTPUT_FORMAT_OPTIONS } from './constants';
import { translateSubtitle } from './services/geminiService';
import LanguageSelector from './components/LanguageSelector';
import FileInput from './components/FileInput';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import OutputFormatSelector from './components/OutputFormatSelector';

const App: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<Language>(Language.ENGLISH);
  const [targetLang, setTargetLang] = useState<Language>(Language.THAI);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(OutputFormat.VTT);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
        setFileName(file.name);
        setTranslatedContent('');
        setError('');
      };
      reader.onerror = () => {
        setError('Failed to read the file.');
        setFileContent('');
        setFileName('');
      };
      reader.readAsText(file);
    } else {
        setFileContent('');
        setFileName('');
    }
  };

  const handleTranslate = useCallback(async () => {
    if (!fileContent) {
      setError('Please select a subtitle file first.');
      return;
    }
    if (sourceLang === targetLang) {
      setError('Source and target languages cannot be the same.');
      return;
    }

    setIsLoading(true);
    setError('');
    setTranslatedContent('');

    try {
      const stream = translateSubtitle(fileContent, sourceLang, targetLang, outputFormat);
      for await (const chunk of stream) {
        setTranslatedContent((prev) => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during translation.');
    } finally {
      setIsLoading(false);
    }
  }, [fileContent, sourceLang, targetLang, outputFormat]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
            Erotic Subtitle Translator
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Powered by Gemini 2.5 Pro
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-red-500/10 p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LanguageSelector
              label="Translate From"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value as Language)}
              options={LANGUAGE_OPTIONS.map(lang => ({ value: lang, label: lang }))}
            />
            <LanguageSelector
              label="Translate To"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value as Language)}
              options={LANGUAGE_OPTIONS.map(lang => ({ value: lang, label: lang }))}
            />
            <OutputFormatSelector
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
              options={OUTPUT_FORMAT_OPTIONS}
            />
          </div>

          <FileInput onFileSelect={handleFileSelect} fileName={fileName} />
          
          <div className="text-center">
             <button
              onClick={handleTranslate}
              disabled={isLoading || !fileContent}
              className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50"
            >
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Translate
                </>
              )}
            </button>
          </div>

          {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
          
          {(translatedContent || isLoading) && (
            <ResultDisplay 
              content={translatedContent} 
              outputFormat={outputFormat}
              originalFileName={fileName}
            />
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Erotic Subtitle Translator. For educational and entertainment purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
