'use client';

import { FileForm } from '@/components/file-input';

export default function Docs() {
  const handleSubmit = async (files: File[]) => {
    console.log('Chat with the following pdfs', files);
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('filename', files[0].name);

    const res = await window.fetch('/docs/api/upload/', {
      method: 'POST',
      body: formData,
    });
    const responseData = await res.json();
    console.log('responseData', responseData);
  };
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-extrabold">Upload your pdf</h1>
      <div>
        <FileForm label="PDF" accept={['application/pdf']} onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
