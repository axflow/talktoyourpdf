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
    <div className="flex items-center justify-center w-full">
      <div className="py-2 w-[500px]">
        <PDFUploadForm onSubmit={handleSubmit} uploading={uploading} />
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <main className="h-screen flex">
      <section className="bg-muted bg-zinc-900 dark:border-r lg:max-w-[600px] pt-[52px]">
        <div className="pl-6 pr-9 pt-24">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome
          </h1>

          <p className="mt-6">
            This is a guided tutorial of Retrieval Augmented Generation (RAG) using the{' '}
            <a
              href="https://github.com/axilla-io/ax"
              className="font-medium underline underline-offset-4"
            >
              ax framework
            </a>
            .
          </p>

          <blockquote className="mt-6 border-l-2 pl-6 text-sm text-muted-foreground">
            <p className="italic">
              Retrieval Augmented Generation is a method that combines the strengths of large
              language models and external retrieval or search mechanisms. In RAG, when generating a
              response, the model first retrieves relevant information or documents from a large
              corpus and then uses this retrieved information to conditionally generate an answer.
              <span className="font-bold">
                This allows the model to pull in external knowledge beyond its training data when
                answering questions.
              </span>
            </p>
            <footer className="mt-3 font-semibold">— ChatGPT</footer>
          </blockquote>

          <p className="mt-6">
            For this tutorial, we're trying to develop an understanding of how ChatGPT can better
            answer our questions when provided relevant context from our documents.
          </p>

          <p className="mt-6">
            To begin, upload a PDF file less than 5MB or{' '}
            <span className="font-medium underline underline-offset-4 cursor-pointer">
              try this one
            </span>
            .
          </p>
        </div>
      </section>
      <section className="w-full pt-[52px]">
        <div className="px-6 pt-24">
          <Uploader />
        </div>
      </section>
    </main>
  );
}
