'use client';
import { useState, Dispatch } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileForm } from '@/components/file-input';
import { Button } from '@/components/ui/button';

const JSON_SEPARATOR_CODE_POINT = String.fromCharCode(parseInt('1d', 16));
const CONTENT_SEPARATOR_CODE_POINT = String.fromCharCode(parseInt('1e', 16));

const Uploader = () => {
  const [disabled, setDisabled] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (files: File[]) => {
    setDisabled(true);

    const filename = files[0].name;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('filename', filename);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const responseData = await res.json();
      const count = responseData.chunkCount;
      toast({
        title: 'Success',
        description: `${filename} has been uploaded successfully. It was split into ${count} chunk${
          count > 1 ? 's' : ''
        }.`,
      });
      console.log(responseData);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Something went wrong uploading ${filename}. Please try again.`,
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold">Upload your pdf</h1>
      <div>
        <FileForm
          label="PDF"
          accept={['application/pdf']}
          onSubmit={handleSubmit}
          disabled={disabled}
        />
      </div>
    </>
  );
};

const Querier = ({ setResponse }: { setResponse: Dispatch<string> }) => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [querying, setQuerying] = useState(false);
  const [docs, setDocs] = useState<Array<Object>>([]);

  const handleSubmit = async () => {
    setResponse('');
    setQuerying(true);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        body: JSON.stringify({ query }),
      });

      if (!res?.body) {
        return;
      }

      const reader = res.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          const finishedChunks = new Uint8Array(
            ([] as number[]).concat(...chunks.map((chunk) => Array.from(chunk))),
          );
          const decodedData = new TextDecoder().decode(finishedChunks);
          const chainedDocuments = decodedData.split(CONTENT_SEPARATOR_CODE_POINT)[1];
          const documents = chainedDocuments.split(JSON_SEPARATOR_CODE_POINT);

          setDocs(documents.filter((doc) => doc).map((doc) => JSON.parse(doc)));
          break;
        }

        chunks.push(value);
        const concatenatedChunks = new Uint8Array(
          ([] as number[]).concat(...chunks.map((chunk) => Array.from(chunk))),
        );

        const decodedData = new TextDecoder().decode(concatenatedChunks);
        const text = decodedData.split(CONTENT_SEPARATOR_CODE_POINT)[0];

        setResponse(text);
        console.log(docs);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong asking the AI. Please try again.',
        variant: 'destructive',
      });
    }

    setQuerying(false);
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold">Ask a question</h1>
      <div className="grid w-1/2 gap-1.5">
        <Label htmlFor="question">Question</Label>
        <Textarea
          id="question"
          placeholder="ask your data anything..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Button type="submit" className="mt-4" disabled={querying} onClick={handleSubmit}>
        {querying ? 'Querying...' : 'Query'}
      </Button>
    </>
  );
};

const Response = ({ response }: { response: string }) => {
  return (
    <>
      <h1 className="text-4xl font-extrabold">Response</h1>
      <div className="grid w-1/2 gap-1.5">
        <p>{response}</p>
      </div>
    </>
  );
};
export default function LandingPage() {
  const [response, setResponse] = useState('');

  return (
    <main className="flex flex-col items-center gap-8 justify-between p-24">
      <Uploader />
      <Separator />
      <Querier setResponse={setResponse} />
      <Separator />
      {response && <Response response={response} />}
    </main>
  );
}
