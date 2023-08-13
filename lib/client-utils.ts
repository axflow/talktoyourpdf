import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { PDFType } from './pdf';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadFile(url: string, file: File) {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('filename', file.name);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload PDF`);
  }

  return response.json();
}

export async function downloadPDFDocument(url: string, name = 'file.pdf') {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], name, { type: 'application/pdf' });
}

export const generateSequentialId = ((counter: number) => {
  return () => Date.now() + ++counter;
})(0);

export function generateId() {
  return crypto.randomUUID();
}

export function createPdfObject(file: File): PDFType {
  return {
    id: generateId(),
    url: URL.createObjectURL(file),
    file: file,
  };
}

export async function createPdfObjectFromRemoteURL(url: string, filename: string) {
  const file = await downloadPDFDocument(url, filename);
  return createPdfObject(file);
}

const NEWLINE_BYTE = 10;

export async function* queryStream(params: { query: string; useRag: boolean }) {
  const response = await fetch('/api/query', {
    method: 'POST',
    body: JSON.stringify(params),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Response failed with status code ${response.status}`);
  }

  let buffer: number[] = [];
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  function bufferToObject(buffer: number[]) {
    const json = decoder.decode(Uint8Array.from(buffer));
    return JSON.parse(json);
  }

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      if (buffer.length > 0) {
        console.warn('Unhandled bytes remaining after stream close');
      }

      break;
    }

    for (const byte of value) {
      if (byte === NEWLINE_BYTE) {
        yield bufferToObject(buffer);
        buffer = [];
        continue;
      }

      buffer.push(byte);
    }
  }
}
