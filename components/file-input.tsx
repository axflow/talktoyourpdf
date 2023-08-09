import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { UploadIcon } from '@radix-ui/react-icons';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/client-utils';

const FIVE_MEGABYTES = 5 * 1024 * 1024;

type PropsType = {
  uploading: null | { progress: number; message: string };
  onSubmit: (file: File) => void;
};

export function PDFUploadForm(props: PropsType) {
  const { uploading, onSubmit } = props;

  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full">
      {uploading === null ? (
        <UploadForm setError={setError} onSubmit={onSubmit} />
      ) : (
        <Uploading {...uploading} />
      )}
      {error && <p className="pt-4 text-red-600 text-sm text-center">{error}</p>}
    </div>
  );
}

type UploadPropsType = {
  onSubmit: (file: File) => void;
  setError: (message: string | null) => void;
};

function UploadForm({ setError, onSubmit }: UploadPropsType) {
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: (files, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setError('Only one PDF file is allowed. Please select a PDF file.');
        return;
      }

      const file = files[0];

      if (file) {
        if (file.size >= FIVE_MEGABYTES) {
          setError('Maximum supported file size is 5 megabytes. Please choose a smaller PDF file.');
        } else {
          setError(null);
          onSubmit(file);
        }
      }
    },
    maxFiles: 1,
    accept: { 'application/pdf': ['.pdf'] },
  });

  return (
    <label
      {...getRootProps({
        onClick: open,
        htmlFor: 'dropzone-file',
        className: cn(
          'flex flex-col items-center justify-center w-full h-96 border-2 border-zinc-600 hover:border-zinc-400 border-dashed rounded-lg cursor-pointer text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 transition ease-in',
          isDragActive && 'dark:text-zinc-300 border-zinc-400',
        ),
      })}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <p className="mb-2">
          <UploadIcon width={32} height={32} />
        </p>
        <p className="mb-2 text-sm">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs">PDF (maximum size of 5MB)</p>
      </div>
      <input {...getInputProps({ id: 'dropzone-file', className: 'hidden' })} />
    </label>
  );
}

function Uploading({ message, progress }: { message: string; progress: number }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-96 border-2 border-zinc-400 border-dashed rounded-lg cursor-pointer hover:text-zinc-300 transition ease-in">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Progress value={progress * 100} className="w-[300px] mb-2" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
