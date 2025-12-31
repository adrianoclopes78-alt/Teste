
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Reader from './components/Reader';
import { AppStatus, ProcessedText } from './types';
import { processTextWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [processedData, setProcessedData] = useState<ProcessedText | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTextExtracted = async (text: string, fileName: string) => {
    if (!text) return;
    
    setStatus(AppStatus.LOADING);
    setErrorMessage(null);

    try {
      // Process the text through Gemini to get structured segments
      // We take the first 4000 characters to ensure we don't hit limits for a single prompt
      const textToProcess = text.substring(0, 4000);
      const result = await processTextWithGemini(textToProcess, fileName);
      setProcessedData(result);
      setStatus(AppStatus.READING);
    } catch (error) {
      console.error("Gemini Error:", error);
      setErrorMessage("Ocorreu um erro ao processar o texto com Inteligência Artificial. Verifique sua conexão ou tente um arquivo menor.");
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setProcessedData(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-5xl mb-12 text-center">
        <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c1.11 0 2.152.22 3.102.617a.75.75 0 001-.707V4.262a.75.75 0 00-.5-.707 9.735 9.735 0 00-3.25-.555 9.707 9.707 0 00-5.25 1.533v16.103z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Accent Master <span className="text-blue-600">Pro</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium">Leia, entenda e fale como um nativo com ajuda de IA.</p>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center">
        {status === AppStatus.IDLE && (
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <FileUpload onTextExtracted={handleTextExtracted} isLoading={false} />
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-3.946-4.656a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97 2.72-2.72a.75.75 0 011.06 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-1">Tradução Real</h4>
                <p className="text-sm text-slate-500">Traduções precisas contexto por contexto.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                    <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                    <path d="M3.316 10.934a.75.75 0 10-1.132.988 8.002 8.002 0 007.066 4.027v1.301H7.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5H10.75v-1.301a8.002 8.002 0 007.066-4.027.75.75 0 00-1.132-.988 6.502 6.502 0 01-12.632 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-1">Guia Fonético</h4>
                <p className="text-sm text-slate-500">Pronúncia adaptada para o português brasileiro.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                    <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.061l1.061-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.061a.75.75 0 001.06 1.06l1.061-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.061 1.06l1.06 1.061zM5.404 6.464a.75.75 0 001.06-1.06l-1.061-1.06a.75.75 0 10-1.06 1.061l1.06 1.06z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-800 mb-1">Sincronização</h4>
                <p className="text-sm text-slate-500">Acompanhe visualmente cada palavra falada.</p>
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.LOADING && (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl shadow-sm border border-slate-100 w-full max-w-2xl animate-pulse">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">A IA está trabalhando...</h3>
            <p className="text-slate-500 mt-2">Traduzindo e preparando a fonética para você.</p>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="p-8 bg-red-50 rounded-3xl border border-red-100 text-center w-full max-w-2xl">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.401 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Ops! Algo deu errado</h3>
            <p className="text-red-700 mb-6">{errorMessage}</p>
            <button 
              onClick={reset}
              className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {status === AppStatus.READING && processedData && (
          <Reader data={processedData} onReset={reset} />
        )}
      </main>

      <footer className="mt-auto py-8 text-slate-400 text-sm">
        &copy; 2024 Accent Master Pro • Desenvolvido com Gemini AI
      </footer>
    </div>
  );
};

export default App;
