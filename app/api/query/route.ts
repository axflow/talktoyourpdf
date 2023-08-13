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

const model = new OpenAIChatCompletion({
  model: 'gpt-4',
  max_tokens: 1000,
  temperature: 0,
});

function chatStream(query: string) {
  return model.stream([{ role: 'user', content: query }]);
}

function ragChatStream(query: string, documentId: string) {
  const store = getPineconeStore();

  const rag = new RAGChat({
    model: model,
    prompt: new PromptMessageWithContext({ template: QUESTION_WITH_CONTEXT }),
    retriever: new Retriever({ store, topK: 4, filterTerm: documentId }),
    embedder: new OpenAIEmbedder(),
  });

  return rag.stream(query);
}

function iterableToStream(
  iterable: AsyncIterable<OpenAIChatCompletionStreaming.Response>,
  info?: { context?: IVectorQueryResult[] },
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

      const documents = info?.context;

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
  const { query, document_id: documentId, use_rag: useRag } = await request.json();

  if (useRag) {
    const { result: iterable, info } = ragChatStream(query, documentId);
    const stream = iterableToStream(iterable, info);
    return new Response(stream);
  } else {
    const iterable = chatStream(query);
    const stream = iterableToStream(iterable);
    return new Response(stream);
  }
}
