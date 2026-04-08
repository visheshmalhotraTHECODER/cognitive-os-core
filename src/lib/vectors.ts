import { pipeline } from '@xenova/transformers';

/**
 * Vector Engine for Cognitive.OS
 * 
 * Factory Rule #5: All knowledge must be searchable via semantic embeddings.
 * We use local transformer models for zero-latency vectorization.
 */

let embedder: any = null;

export async function getEmbedding(text: string): Promise<number[]> {
  if (!embedder) {
    // Using a lightweight but capable model for expert heuristics
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }

  const result = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}

/**
 * Calculates cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(mA) * Math.sqrt(mB));
}
