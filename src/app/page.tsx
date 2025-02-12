"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecipeCard, type Recipe } from "./components/RecipeCard"
import { RecipeForm } from "./components/RecipeForm"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RecipeGenerator() {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSavedRecipes()
  }, [])

  const fetchSavedRecipes = async () => {
    try {
      const res = await fetch("/api/recipes")
      if (!res.ok) throw new Error("Failed to fetch recipes")
      const recipes = await res.json()
      setSavedRecipes(recipes)
    } catch (error) {
      console.error("Error fetching recipes:", error)
      toast({
        title: "Error",
        description: "Failed to fetch saved recipes.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (dish: string, dietary: string) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dish, dietary }),
      })

      if (!res.ok) throw new Error("Failed to generate recipe")

      const data = await res.json()
      setRecipe(data.recipe)
      await fetchSavedRecipes() // Refresh the list of saved recipes
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteRecipe = async (id: string) => {
    try {
      const res = await fetch(`/api/recipes?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete recipe")
      await fetchSavedRecipes() // Refresh the list of saved recipes
      toast({
        title: "Recipe Deleted",
        description: "The recipe has been removed from your saved recipes.",
      })
    } catch (error) {
      console.error("Error deleting recipe:", error)
      toast({
        title: "Error",
        description: "Failed to delete recipe.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">AI Recipe Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate a New Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
          </CardContent>
        </Card>
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Recipe</TabsTrigger>
            <TabsTrigger value="saved">Saved Recipes</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            {recipe ? (
              <div className="space-y-4">
                <RecipeCard recipe={recipe} />
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Generate a recipe to see it here.</p>
            )}
          </TabsContent>
          <TabsContent value="saved">
            {savedRecipes.length > 0 ? (
              <div className="space-y-4">
                {savedRecipes.map((savedRecipe) => (
                  <div key={savedRecipe.id} className="relative">
                    <RecipeCard recipe={savedRecipe} />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => deleteRecipe(savedRecipe.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No saved recipes yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

