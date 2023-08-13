import { NextRequest } from 'next/server';
import { getPineconeStore } from '@/lib/node-utils';
import {
  RAGChat,
  OpenAIChatCompletion,
  PromptMessageWithContext,
  Retriever,
  OpenAIEmbedder,
  QUESTION_WITH_CONTEXT,
  OpenAIChatCompletionStreaming,
  IVectorQueryResult,
} from 'axgen';

const queryChatStream = async ({ query }: { query: string }) => {
  const store = getPineconeStore();

  const rag = new RAGChat({
    model: new OpenAIChatCompletion({
      model: 'gpt-4',
      max_tokens: 1000,
      temperature: 0,
    }),
    prompt: new PromptMessageWithContext({ template: QUESTION_WITH_CONTEXT }),
    retriever: new Retriever({ store, topK: 4 }),
    embedder: new OpenAIEmbedder(),
  });

  return rag.stream(query);
};

function iterableToStream(
  iterable: AsyncIterable<OpenAIChatCompletionStreaming.Response>,
  info: { context?: IVectorQueryResult[] },
) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async pull(controller) {
      for await (const value of iterable) {
        const chunk = value.choices[0].delta.content;
        if (typeof chunk === 'string') {
          const json = JSON.stringify({ type: 'chunk', value: chunk });
          controller.enqueue(encoder.encode(json + '\n'));
        }
      }

      const documents = info.context;

      if (documents) {
        for (const document of documents) {
          const json = JSON.stringify({ type: 'document', value: document });
          controller.enqueue(encoder.encode(json + '\n'));
        }
      }

      controller.close();
    },
  });
}

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  const { result: iterable, info } = await queryChatStream({ query });
  const stream = iterableToStream(iterable, info);
  return new Response(stream);
}
