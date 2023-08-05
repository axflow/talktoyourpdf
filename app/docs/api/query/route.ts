import { NextRequest } from 'next/server';
import { getPineconeStore } from '@/lib/node-utils';
import {
  RAGChat,
  OpenAIChatCompletion,
  PromptMessageWithContext,
  Retriever,
  OpenAIEmbedder,
  QUESTION_WITH_CONTEXT,
} from 'axgen';

// Separators recommended from
// https://stackoverflow.com/questions/6319551/whats-the-best-separator-delimiter-characters-for-a-plaintext-db-file
const JSON_STREAM_SEPARATOR = Uint8Array.from([0x1d]);
const CONTENT_STREAM_SEPARATOR = Uint8Array.from([0x1e]);

const queryChatStream = async ({ query }: { query: string }) => {
  const store = getPineconeStore();

  const rag = new RAGChat({
    model: new OpenAIChatCompletion({
      model: 'gpt-4',
      max_tokens: 1000,
      // Let's not get creative today
      temperature: 0,
    }),
    prompt: new PromptMessageWithContext({ template: QUESTION_WITH_CONTEXT }),
    retriever: new Retriever({ store, topK: 4 }),
    embedder: new OpenAIEmbedder(),
  });
  return rag.stream(query);
};

type ChatResponse = {
  choices: Array<{
    delta: {
      content: string;
    };
  }>;
};

type InfoContext = {
  context?: Array<object>;
};

function iterableToStream(iterable: AsyncIterable<ChatResponse>, info: InfoContext) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async pull(controller) {
      for await (const value of iterable) {
        const chunk = typeof value === 'string' ? value : value.choices[0].delta.content;
        controller.enqueue(encoder.encode(chunk));
      }

      controller.enqueue(CONTENT_STREAM_SEPARATOR);
      const documents = info.context;
      if (documents) {
        for (const document of documents) {
          controller.enqueue(encoder.encode(JSON.stringify(document)));
          controller.enqueue(JSON_STREAM_SEPARATOR);
        }
      }

      controller.close();
    },
  });
}

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  const { result: iterable, info } = await queryChatStream({ query });
  // @ts-ignore (I dont understand this error TODO fix)
  const stream = iterableToStream(iterable, info);
  return new Response(stream);
}
