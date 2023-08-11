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

export function createPdfObject(file: File): PDFType {
  return {
    id: crypto.randomUUID(),
    url: URL.createObjectURL(file),
    file: file,
  };
}

export async function createPdfObjectFromRemoteURL(url: string, filename: string) {
  const file = await downloadPDFDocument(url, filename);
  return createPdfObject(file);
}
