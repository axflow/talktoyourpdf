import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const CONTENT_TYPE_TO_EXT_MAP = {
  'text/csv': 'csv',
  'application/pdf': 'pdf',
  'text/plain': 'text',
} as const;

export type ContentType = keyof typeof CONTENT_TYPE_TO_EXT_MAP;

type PropsType = {
  label: string;
  accept?: ContentType[];
  disabled?: boolean;
  onSubmit: (files: File[]) => void;
};

export function FileForm(props: PropsType) {
  const { label, accept, disabled, onSubmit } = props;

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files || files.length < 1) {
      return;
    }

    const file = files[0];
    const type = file.type as ContentType;

    if (Array.isArray(accept) && !accept.includes(type)) {
      const fileTypes = accept.map((t) => CONTENT_TYPE_TO_EXT_MAP[t]);
      setError(`Supported file types: ${fileTypes.join(', ')}`);
    } else {
      setError(null);
      setFiles([file]);
    }
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="file-input">{label}</Label>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          id="file-input"
          type="file"
          onChange={onChange}
          className={`cursor-pointer${error ? ' border-red-700' : ''}`}
        />
        <Button
          type="submit"
          disabled={disabled || files.length === 0}
          onClick={() => onSubmit(files)}
        >
          Continue
        </Button>
      </div>
      {error && <span className="text-red-700 text-sm">{error}</span>}
    </div>
  );
}
