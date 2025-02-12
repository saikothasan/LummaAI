import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"

export type Recipe = {
  id: string
  name: string
  category: string
  cuisine: string
  ingredients: { item: string; amount: string; unit: string }[]
  instructions: string[]
  description: string
  prepTime: string
  cookTime: string
  totalTime: string
  servings: number
  calories: number
  dietaryInfo: string[]
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
}

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{recipe.category}</Badge>
          <Badge variant="secondary">{recipe.cuisine}</Badge>
          <Badge variant="outline">{recipe.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{recipe.description}</p>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{recipe.totalTime}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>{recipe.servings} servings</span>
          </div>
          <div>{recipe.calories} cal</div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Ingredients:</h3>
          <ul className="list-disc list-inside">
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>{`${ing.amount} ${ing.unit} ${ing.item}`}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Instructions:</h3>
          <ol className="list-decimal list-inside">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Dietary Information:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {recipe.dietaryInfo.map((info, index) => (
              <Badge key={index} variant="outline">
                {info}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

