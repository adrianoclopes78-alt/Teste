
import React, { useRef } from 'react';

interface FileUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onTextExtracted, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.type === 'application/pdf') {
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
        // Access pdfjs from window as it's loaded via CDN in index.html
        const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        try {
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let fullText = '';
          for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) { // Limit to 10 pages for demo
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item: any) => item.str);
            fullText += strings.join(' ') + '\n';
          }
          onTextExtracted(fullText.trim(), file.name);
        } catch (error) {
          console.error("Error parsing PDF:", error);
          alert("Erro ao ler o PDF. Tente um arquivo mais simples.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'text/plain') {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onTextExtracted(text, file.name);
      };
      reader.readAsText(file);
    } else {
      alert("Por favor, envie apenas arquivos .pdf ou .txt");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-blue-200 rounded-3xl bg-white shadow-sm hover:border-blue-400 transition-colors cursor-pointer group"
         onClick={() => fileInputRef.current?.click()}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf,.txt" 
        className="hidden" 
      />
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-800">Carregar Documento</h3>
      <p className="text-slate-500 mt-2 text-center max-w-xs">Selecione um arquivo PDF ou TXT em Inglês para começar seu aprendizado.</p>
      {isLoading && (
        <div className="mt-6 flex items-center gap-2 text-blue-600 font-medium">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Processando com IA...
        </div>
      )}
    </div>
  );
};

export default FileUpload;
