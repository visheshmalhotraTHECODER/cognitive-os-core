import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEmbedding, cosineSimilarity } from '@/lib/vectors';

/**
 * Agent Discovery API
 * 
 * Allows AI Agents to query the Tacit Knowledge Graph semantically.
 * IF an expert has handled a similar situation, the agent finds the exact heuristic.
 */

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 1. Vectorize the incoming agent query
    const queryEmbedding = await getEmbedding(query);

    // 2. Fetch knowledge base from Persistence Layer
    const allNodes = await prisma.heuristicNode.findMany({
      where: {
        vectorData: { not: null }
      }
    });

    // 3. Semantic Search (K-Nearest Neighbors in JS memory)
    const scoredNodes = allNodes.map((node) => {
      const nodeEmbedding = JSON.parse(node.vectorData!);
      const similarity = cosineSimilarity(queryEmbedding, nodeEmbedding);
      return { ...node, similarity };
    });

    // Sort by most similar first
    scoredNodes.sort((a, b) => b.similarity - a.similarity);

    // Return the top 3 semantic matches
    return NextResponse.json({
      success: true,
      matches: scoredNodes.slice(0, 3).map(n => ({
        rule: n.derivedRule,
        reasoning: n.reasoning,
        similarity: n.similarity,
        expertId: n.expertId
      }))
    });

  } catch (error: any) {
    console.error('[API_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
