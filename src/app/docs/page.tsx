'use client';

import { FileForm } from '@/components/file-input';

export default function Docs() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-extrabold">Upload your pdf</h1>
      <div>
        <FileForm
          label="PDF"
          accept={['application/pdf']}
          onSubmit={(files) => console.log('Chat with the following pdfs', files)}
        />
      </div>
    </main>
  );
}
