import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uploadFile(
  url: string,
  file: File,
  onProgress: (n: number) => void,
): Promise<{ status: number; body: string }> {
  const filename = file.name;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => onProgress(e.loaded / e.total));
    xhr.addEventListener('load', () => resolve({ status: xhr.status, body: xhr.responseText }));
    xhr.addEventListener('error', (e) => {
      reject(new Error(`Failed to upload ${filename}: ${String(e)}`));
    });
    xhr.addEventListener('abort', () => reject(new Error(`Aborted uploading ${filename}`)));
    xhr.open('POST', url, true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);
    xhr.send(formData);
  });
}
