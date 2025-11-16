
import { Language, OutputFormat } from './types';

export const LANGUAGE_OPTIONS: Language[] = [
  Language.JAPANESE,
  Language.ENGLISH,
  Language.CHINESE,
  Language.THAI,
];

export const OUTPUT_FORMAT_OPTIONS = [
  { value: OutputFormat.VTT, label: '.vtt (WebVTT)' },
  { value: OutputFormat.SRT, label: '.srt (SubRip)' },
  { value: OutputFormat.TXT, label: '.txt (Plain Text)' },
];
