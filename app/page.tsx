'use client';
import { useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { PDFUploadForm } from '@/components/file-input';
import { uploadFile } from '@/lib/client-utils';

const Uploader = () => {
  const [uploading, setUploading] = useState<null | { progress: number; message: string }>(null);
  const { toast } = useToast();

  const handleSubmit = async (file: File) => {
    const message = `Uploading ${file.name}...`;

    setUploading({ progress: 0, message: message });

    try {
      const { body } = await uploadFile('/api/upload', file, (progress) => {
        setUploading({
          progress,
          message: progress === 1 ? `Processing ${file.name}...` : message,
        });
      });

      const responseData = JSON.parse(body);
      const count = responseData.chunkCount;

      toast({
        title: 'Success',
        description: `${
          file.name
        } has been uploaded successfully. It was split into ${count} chunk${count > 1 ? 's' : ''}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Something went wrong uploading ${file.name}. Please try again.`,
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="mt-24 flex items-center justify-center w-full max-w-3xl">
      <PDFUploadForm onSubmit={handleSubmit} uploading={uploading} />
    </div>
  );
};

export default function LandingPage() {
  return (
    <main className="h-screen flex flex-col items-center">
      <Uploader />
    </main>
  );
}
