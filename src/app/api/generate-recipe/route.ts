import { createWorkersAI } from 'workers-ai-provider';
import { generateObject } from 'ai';
import { z } from 'zod';
import { KVNamespace } from '@cloudflare/workers-types';

export const runtime = 'edge';

type Env = {
  AI: any;
  RECIPES: KVNamespace;
};

const recipeSchema = z.object({
  recipe: z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    cuisine: z.string(),
    ingredients: z.array(z.object({
      item: z.string(),
      amount: z.string(),
      unit: z.string(),
    })),
    instructions: z.array(z.string()),
    description: z.string(),
    prepTime: z.string(),
    cookTime: z.string(),
    totalTime: z.string(),
    servings: z.number(),
    calories: z.number(),
    dietaryInfo: z.array(z.string()),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    tags: z.array(z.string()),
  }),
});

export async function POST(req: Request) {
  try {
    const { dish, dietary } = await req.json();
    
    const workersai = createWorkersAI({ 
      binding: process.env.AI as unknown as Env['AI']
    });

    const result = await generateObject({
      model: workersai('@cf/meta/llama-3.1-8b-instruct'),
      prompt: `Generate a detailed recipe for ${dish}. ${dietary ? `Make it suitable for ${dietary} diet.` : ''}`,
      schema: recipeSchema,
    });

    // Generate a unique ID using Web Crypto API
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const recipeId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    result.object.recipe.id = recipeId;

    // Save the recipe to KV
    await (process.env.RECIPES as unknown as Env['RECIPES']).put(recipeId, JSON.stringify(result.object.recipe));

    return Response.json(result.object);
  } catch (error) {
    console.error('Generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate recipe' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
