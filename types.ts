
export interface TextSegment {
  original: string;
  translation: string;
  phonetic: string;
}

export interface ProcessedText {
  segments: TextSegment[];
  title: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  READING = 'READING',
  ERROR = 'ERROR'
}
