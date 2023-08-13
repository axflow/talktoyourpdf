import { NextRequest, NextResponse } from 'next/server';
import { converters, TextSplitter, OpenAIEmbedder } from 'axgen';
import { getPineconeStore } from '@/lib/node-utils';

function zip<T1, T2>(l1: Array<T1>, l2: Array<T2>): Array<[T1, T2]> {
  if (l1.length !== l2.length) {
    throw new Error('Cannot zip two lists of unequal length');
  }

  return l1.map((item, i) => [item, l2[i]]);
}
const store = getPineconeStore();

/**
 * POST /docs/api/upload
 *  Receive a pdf file, chunk it, get embeddings, and store it into pinecone
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');
  const filename = formData.get('filename');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Error reading file' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const fileContentBuffer = Buffer.from(arrayBuffer);
  const doc = await converters.pdf(fileContentBuffer, { url: `file://${filename}` });

  try {
    const splitter = new TextSplitter({ chunkSize: 2000, chunkOverlap: 0 });
    // const embedder = new OpenAIEmbedder();

    const chunks = await splitter.split(doc);
    // const embeddings = await embedder.embed(chunks.map((chunk) => chunk.text));

    // const chunksWithEmbeddings = zip(chunks, embeddings).map(([chunk, embeddings]) => ({
    //   ...chunk,
    //   embeddings,
    // }));

    // await store.add(chunksWithEmbeddings);

    return NextResponse.json({ chunkCount: chunks.length }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error ingesting file' }, { status: 400 });
  }
}
