import type { NextRequest } from "next/server"
import type { KVNamespace } from "@cloudflare/workers-types"

type Env = {
  RECIPES: KVNamespace
}

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (id) {
      // Retrieve a specific recipe
      const recipe = await (process.env.RECIPES as unknown as Env["RECIPES"]).get(id)
      if (!recipe) {
        return new Response(JSON.stringify({ error: "Recipe not found" }), { status: 404 })
      }
      return new Response(recipe, { status: 200 })
    } else {
      // List all recipes
      const keys = await (process.env.RECIPES as unknown as Env["RECIPES"]).list()
      const recipes = await Promise.all(
        keys.keys.map(async (key) => {
          const recipe = await (process.env.RECIPES as unknown as Env["RECIPES"]).get(key.name)
          return recipe ? JSON.parse(recipe) : null
        }),
      )
      return new Response(JSON.stringify(recipes.filter(Boolean)), { status: 200 })
    }
  } catch (error) {
    console.error("Error:", error)
    return new Response(JSON.stringify({ error: "Failed to retrieve recipes" }), { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return new Response(JSON.stringify({ error: "Recipe ID is required" }), { status: 400 })
    }

    await (process.env.RECIPES as unknown as Env["RECIPES"]).delete(id)
    return new Response(JSON.stringify({ message: "Recipe deleted successfully" }), { status: 200 })
  } catch (error) {
    console.error("Error:", error)
    return new Response(JSON.stringify({ error: "Failed to delete recipe" }), { status: 500 })
  }
}

