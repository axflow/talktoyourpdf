'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { UploadIcon } from '@radix-ui/react-icons';

import { PDFUploadForm } from '@/components/file-input';
import Link, { SpanLink } from '@/components/link';
import { Button } from '@/components/ui/button';

import { SHOPIFY_S1_PDF_URL, SHOPIFY_S1_PDF_FILENAME, type PDFType } from '@/lib/pdf';
import { createPdfObject, downloadPDFDocument, uploadFile, cn } from '@/lib/client-utils';

function PDFUploadView(props: { pdf: PDFType }) {
  const [uploading, setUploading] = useState(false);

  const pdf = props.pdf;

  async function onUpload() {
    if (uploading) {
      return;
    }

    setUploading(true);

    try {
      const response = await uploadFile('/api/upload', pdf.file);
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <object
        className="rounded-xl"
        width="100%"
        height="500"
        data={pdf.url}
        type="application/pdf"
      ></object>
      <div className="mt-8">
        <Button disabled={uploading} onClick={onUpload} className="w-full">
          {uploading ? (
            <Loader2 width={15} height={15} className="mr-2 animate-spin" />
          ) : (
            <UploadIcon className="mr-2" />
          )}
          Upload {pdf.file.name}
        </Button>
        {uploading && (
          <p className="mt-2 text-xs text-center text-muted-foreground italic">
            Processing may take up to 30 seconds
          </p>
        )}
      </div>
    </>
  );
}

function Welcome(props: { setPdf: (pdf: PDFType) => void }) {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Welcome</h1>

      <p className="mt-6">
        This is a guided tutorial of Retrieval Augmented Generation (RAG) using the{' '}
        <Link href="https://github.com/axilla-io/ax">ax framework</Link>.
      </p>

      <blockquote className="mt-6 border-l-2 pl-6 text-sm text-muted-foreground">
        <p className="italic">
          Retrieval Augmented Generation is a method that combines the strengths of large language
          models and external retrieval or search mechanisms. In RAG, when generating a response,
          the model first retrieves relevant information or documents from a large corpus and then
          uses this retrieved information to conditionally generate an answer.
          <span className="font-bold">
            This allows the model to pull in external knowledge beyond its training data when
            answering questions.
          </span>
        </p>
        <footer className="mt-3 font-semibold">— ChatGPT</footer>
      </blockquote>

      <p className="mt-6">
        For this tutorial, we're trying to develop an understanding of how ChatGPT can better answer
        our questions when provided relevant context from our documents.
      </p>

      <p className="mt-6">
        To begin, upload a PDF file less than 5MB or{' '}
        <SpanLink
          onClick={async () => {
            const file = await downloadPDFDocument(SHOPIFY_S1_PDF_URL, SHOPIFY_S1_PDF_FILENAME);
            props.setPdf(createPdfObject(file));
          }}
        >
          try this one
        </SpanLink>
        .
      </p>
    </>
  );
}

function Chunking() {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Chunking</h1>

      <p className="mt-6">
        When asking an LLM questions, we want to provide the model with relevant context from our
        documents. This allows the LLM to reason over previously-unseen information and reduce{' '}
        <Link href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">
          hallucinations
        </Link>
        .
      </p>

      <p className="mt-6">
        Providing the entire document is usually not an option due to limitations in the the maximum
        size of a given request, called a context window. Additionally, it's often cheaper and more
        performant to provide only the most relevant snippets within the document.
      </p>

      <p className="mt-6">
        To obtain only the most relevant snippets we need to split the document into chunks. For
        each chunk, we'll need to transform its text it into an array of numbers, called a vector.
        These vectors are also referred to as{' '}
        <Link href="https://www.deepset.ai/blog/the-beginners-guide-to-text-embeddings">
          text embeddings
        </Link>
        .
      </p>

      <p className="mt-6">
        We'll need to store these vectors where we can later retrieve them. Databases that store
        vectors are called vector databases. We're using Pinecone in this tutorial.
      </p>

      <p className="mt-6 italic">
        To continue, click the button under the PDF preview to upload the PDF, split it into chunks,
        calculate the embedding of each chunk, and store the embeddings in Pinecone.
      </p>
    </>
  );
}

export default function LandingPage() {
  const [pdf, setPdf] = useState<PDFType | null>(null);

  return (
    <main className="min-h-screen flex">
      <section className="bg-muted bg-zinc-900 dark:border-r lg:max-w-[600px] pt-[52px]">
        <div className="pl-6 pr-9 pt-24">
          {pdf !== null ? <Chunking /> : <Welcome setPdf={setPdf} />}
        </div>
      </section>
      <section className="w-full pt-[52px]">
        <div className="px-6 pt-24">
          <div className="flex items-center justify-center w-full">
            <div className="py-2 w-[500px]">
              {pdf !== null ? <PDFUploadView pdf={pdf} /> : <PDFUploadForm onSubmit={setPdf} />}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
