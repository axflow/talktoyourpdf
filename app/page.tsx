'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { UploadIcon } from '@radix-ui/react-icons';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PDFUploadForm } from '@/components/file-input';
import Link, { SpanLink } from '@/components/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

import { SHOPIFY_S1_PDF_URL, SHOPIFY_S1_PDF_FILENAME, type PDFType } from '@/lib/pdf';
import {
  createPdfObjectFromRemoteURL,
  queryStream,
  generateSequentialId,
  uploadFile,
} from '@/lib/client-utils';

function PDFUploadView(props: {
  pdf: PDFType;
  onSuccess: (response: any) => void;
  onTryAgain: (file: PDFType | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [failed, setFailed] = useState(false);

  const { pdf, onSuccess, onTryAgain } = props;

  async function onUpload() {
    if (uploading) {
      return;
    }

    setUploading(true);

    try {
      const response = await uploadFile('/api/upload', pdf.file);
      onSuccess(response);
    } catch (error) {
      console.error(error);
      setFailed(true);
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
      <AlertDialog open={failed}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ruh roh!</AlertDialogTitle>
            <AlertDialogDescription>
              The request failed to parse the PDF. PDF parsing is surprisingly brittle in Node.
              We're working to fix that! In the meantime, you can try a different file or use our
              example one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                onTryAgain(null);
                setFailed(false);
              }}
            >
              Start over
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const file = await createPdfObjectFromRemoteURL(
                  SHOPIFY_S1_PDF_URL,
                  SHOPIFY_S1_PDF_FILENAME,
                );
                onTryAgain(file);
                setFailed(false);
              }}
            >
              Use example
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
        For this tutorial, we're trying to develop an understanding of how LLMs can better answer
        our questions when provided relevant context from our documents.
      </p>

      <p className="mt-6">
        To begin, upload a PDF file less than 5MB or{' '}
        <SpanLink
          onClick={async () => {
            const file = await createPdfObjectFromRemoteURL(
              SHOPIFY_S1_PDF_URL,
              SHOPIFY_S1_PDF_FILENAME,
            );
            props.setPdf(file);
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

function Querying(props: { pdf: PDFType }) {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Querying</h1>

      <p className="mt-6">
        Now the fun part! Let's ask questions about{' '}
        <span className="font-mono text-sm">{props.pdf.file.name}</span>.
      </p>

      <p className="mt-6">
        If the document contains generally available information, then it's possible the responses
        generated by the LLM contain little improvement over responses generated without the added
        context from our document. If the document contains information that is publicly unavailable
        or time-sensitive, then you should see a large discrepancy between responses with and
        without this context.
      </p>

      <p className="mt-6">Each request will go through the following steps:</p>

      <p className="mt-6">
        First, we'll calculate embeddings for the submitted question. Second, using the embeddings,
        we'll look up chunks of our document that are semantically similar to our question in the
        vector database. Lastly, we'll forward those chunks along with the original question to the
        LLM.
      </p>

      <p className="mt-6">Play around a bit to get a feel for it!</p>
    </>
  );
}

type MessageType = {
  id: number;
  text: string;
  user: boolean;
};

function Playground(props: {
  disabled: boolean;
  messages: MessageType[];
  response: MessageType | null;
  onSubmit: () => void;
  questionText: string;
  setQuestionText: (text: string) => void;
}) {
  function onChange(e: React.FormEvent<HTMLTextAreaElement>) {
    props.setQuestionText(e.currentTarget.value);
  }

  const messages = props.response ? props.messages.concat([props.response]) : props.messages;

  return (
    <div className="h-full flex flex-col justify-end">
      <div className="">
        {messages.map((msg) => {
          return <p key={msg.id}>{msg.text}</p>;
        })}
      </div>
      <Separator className="my-4" />
      <div className="pb-8 px-6">
        <Textarea
          value={props.questionText}
          onChange={onChange}
          id="user-prompt"
          autoFocus
          placeholder="Ask a question..."
        />
        <div className="mt-4 flex justify-end">
          <Button disabled={props.disabled} onClick={props.onSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

type StepType = 'landing' | 'chunking' | 'querying';

export default function LandingPage() {
  const [step, setStep] = useState<StepType>('landing');
  const [pdf, setPdf] = useState<PDFType | null>(null);
  const [playgroundDisabled, setPlaygroundDisabled] = useState(false);

  const [questionText, setQuestionText] = useState('');
  const [response, setResponse] = useState<MessageType | null>(null);

  const [messages, setMessages] = useState<MessageType[]>([]);

  function setPdfAndNavigate(file: PDFType) {
    setPdf(file);
    setStep('chunking');
  }

  function onTryAgain(file: PDFType | null) {
    if (pdf) {
      URL.revokeObjectURL(pdf.url);
    }
    setPdf(file);
    setStep(file ? 'chunking' : 'landing');
  }

  function onUploadSuccess(response: any) {
    setStep('querying');
  }

  async function onQuestionSubmit() {
    if (playgroundDisabled) {
      return;
    }
    setPlaygroundDisabled(true);

    const updatedMessages = messages.concat([
      {
        id: generateSequentialId(),
        text: questionText,
        user: true,
      },
    ]);
    setMessages(updatedMessages);
    setQuestionText('');

    let llmResponse: MessageType = {
      id: generateSequentialId(),
      text: '',
      user: false,
    };

    for await (const object of queryStream(questionText)) {
      if (object.type === 'chunk') {
        llmResponse = { ...llmResponse, text: llmResponse.text + object.value };
        setResponse(llmResponse);
      }
    }

    setResponse(null);
    setMessages(updatedMessages.concat([llmResponse]));
    setPlaygroundDisabled(false);
  }

  function renderLeftPanel() {
    switch (step) {
      case 'landing':
        return (
          <div className="pl-6 pr-9 pt-24">
            <Welcome setPdf={setPdfAndNavigate} />
          </div>
        );
      case 'chunking':
        return (
          <div className="pl-6 pr-9 pt-24">
            <Chunking />
          </div>
        );
      case 'querying':
        return (
          <div className="pl-6 pr-9 pt-24">
            <Querying pdf={pdf!} />
          </div>
        );
    }
  }

  function renderRightPanel() {
    switch (step) {
      case 'landing':
        return (
          <div className="px-6 pt-24">
            <div className="flex items-center justify-center w-full">
              <div className="py-2 w-[500px]">{<PDFUploadForm onSubmit={setPdfAndNavigate} />}</div>
            </div>
          </div>
        );
      case 'chunking':
        return (
          <div className="px-6 pt-24">
            <div className="flex items-center justify-center w-full">
              <div className="py-2 w-[500px]">
                <PDFUploadView pdf={pdf!} onSuccess={onUploadSuccess} onTryAgain={onTryAgain} />
              </div>
            </div>
          </div>
        );
      case 'querying':
        return (
          <div className="pt-24 h-full">
            <Playground
              response={response}
              disabled={playgroundDisabled}
              onSubmit={onQuestionSubmit}
              messages={messages}
              questionText={questionText}
              setQuestionText={setQuestionText}
            />
          </div>
        );
    }
  }

  return (
    <main className="min-h-screen h-screen flex">
      <section className="bg-muted bg-zinc-900 dark:border-r min-w-[600px] max-w-[600px] pt-[52px] pb-8">
        {renderLeftPanel()}
      </section>
      <section className="w-full h-full pt-[52px]">{renderRightPanel()}</section>
    </main>
  );
}
