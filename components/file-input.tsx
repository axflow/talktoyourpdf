import { UploadIcon } from '@radix-ui/react-icons';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

const FIVE_MEGABYTES = 5 * 1024 * 1024;

type PropsType = {
  uploading: null | { progress: number; message: string };
  onSubmit: (file: File) => void;
};

export function PDFUploadForm(props: PropsType) {
  const { uploading, onSubmit } = props;

  const [error, setError] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files || files.length < 1) {
      return;
    }

    const file = files[0];

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed. Please select a PDF file.');
    } else if (file.size > FIVE_MEGABYTES) {
      setError('Maximum supported file size is 5 megabytes. Please choose a smaller PDF file.');
    } else {
      setError(null);
      onSubmit(file);
    }
  }

  return (
    <div className="w-full">
      {uploading === null ? <UploadForm onChange={onChange} /> : <Uploading {...uploading} />}
      {error && <p className="pt-4 text-red-600 text-sm text-center">{error}</p>}
    </div>
  );
}

function UploadForm({ onChange }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label
      htmlFor="dropzone-file"
      className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-600 hover:border-zinc-400 border-dashed rounded-lg cursor-pointer text-zinc-500 dark:text-zinc-400 dark:hover:text-zinc-300 transition ease-in"
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
      <input id="dropzone-file" type="file" className="hidden" onChange={onChange} />
    </label>
  );
}

function Uploading({ message, progress }: { message: string; progress: number }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-400 border-dashed rounded-lg cursor-pointer hover:text-zinc-300 transition ease-in">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Progress value={progress * 100} className="w-[300px] mb-2" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
