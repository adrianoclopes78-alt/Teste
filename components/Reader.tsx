
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProcessedText } from '../types';

interface ReaderProps {
  data: ProcessedText;
  onReset: () => void;
}

const Reader: React.FC<ReaderProps> = ({ data, onReset }) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const synth = window.speechSynthesis;
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const stopAudio = useCallback(() => {
    synth.cancel();
    setIsPlaying(false);
    setActiveIndex(-1);
  }, [synth]);

  const speakSegment = (index: number) => {
    if (index >= data.segments.length) {
      setIsPlaying(false);
      setActiveIndex(-1);
      return;
    }

    setActiveIndex(index);
    const segment = data.segments[index];
    const utterance = new SpeechSynthesisUtterance(segment.original);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for better learning

    utterance.onend = () => {
      if (isPlaying) {
        speakSegment(index + 1);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setActiveIndex(-1);
    };

    currentUtterance.current = utterance;
    synth.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      setIsPlaying(true);
      speakSegment(0);
    }
  };

  const handleSegmentClick = (index: number) => {
    stopAudio();
    setIsPlaying(true);
    speakSegment(index);
  };

  useEffect(() => {
    return () => {
      synth.cancel();
    };
  }, [synth]);

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md pb-6 flex items-center justify-between border-b border-slate-200 mb-8">
        <div>
          <button 
            onClick={onReset}
            className="text-sm font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Voltar
          </button>
          <h2 className="text-2xl font-bold text-slate-800 truncate max-w-md">{data.title}</h2>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={togglePlay}
            className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all ${
              isPlaying 
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
            }`}
          >
            {isPlaying ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75zm10.5 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0v-12a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
                Parar
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                Ler Tudo
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4 pb-20">
        <div className="grid grid-cols-3 gap-4 px-4 py-2 font-bold text-slate-400 text-xs uppercase tracking-wider sticky top-24 bg-slate-50">
          <div>Inglês</div>
          <div>Tradução</div>
          <div>Pronúncia (PT-BR)</div>
        </div>
        
        {data.segments.map((segment, idx) => (
          <div 
            key={idx}
            id={`segment-${idx}`}
            onClick={() => handleSegmentClick(idx)}
            className={`grid grid-cols-3 gap-6 p-6 rounded-2xl transition-all cursor-pointer group border-2 ${
              activeIndex === idx 
              ? 'bg-blue-50 border-blue-200 shadow-md transform scale-[1.01]' 
              : 'bg-white border-transparent hover:border-slate-100 hover:shadow-sm'
            }`}
          >
            <div className={`text-lg font-medium leading-relaxed ${activeIndex === idx ? 'text-blue-900' : 'text-slate-800'}`}>
              {segment.original}
            </div>
            <div className="text-lg text-slate-600 leading-relaxed italic">
              {segment.translation}
            </div>
            <div className="text-lg text-blue-600/80 font-mono leading-relaxed bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
              {segment.phonetic}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reader;
