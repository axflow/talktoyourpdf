import { Pinecone } from 'axgen';

export function getEnv(key: string) {
  return process.env[key];
}

export function getEnvOrThrow(key: string) {
  const value = getEnv(key);

  if (!value) {
    throw new Error(`Expected "${key}" to be set in the process environment`);
  }

  return value;
}

export function getPineconeStore() {
  return new Pinecone({
    index: getEnvOrThrow('PINECONE_INDEX'),
    namespace: getEnvOrThrow('PINECONE_NAMESPACE'),
    apiKey: getEnvOrThrow('PINECONE_API_KEY'),
    environment: getEnvOrThrow('PINECONE_ENVIRONMENT'),
  });
}
