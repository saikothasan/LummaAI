"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

type RecipeFormProps = {
  onSubmit: (dish: string, dietary: string) => void
  isLoading: boolean
}

export function RecipeForm({ onSubmit, isLoading }: RecipeFormProps) {
  const [dish, setDish] = useState("")
  const [dietary, setDietary] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (dish.trim()) {
      onSubmit(dish, dietary)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={dish}
        onChange={(e) => setDish(e.target.value)}
        placeholder="Enter a dish name..."
        disabled={isLoading}
      />
      <Select value={dietary} onValueChange={setDietary}>
        <SelectTrigger>
          <SelectValue placeholder="Select dietary preference (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No preference</SelectItem>
          <SelectItem value="vegetarian">Vegetarian</SelectItem>
          <SelectItem value="vegan">Vegan</SelectItem>
          <SelectItem value="gluten-free">Gluten-free</SelectItem>
          <SelectItem value="keto">Keto</SelectItem>
          <SelectItem value="paleo">Paleo</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {isLoading ? "Generating Recipe..." : "Generate Recipe"}
      </Button>
    </form>
  )
}

