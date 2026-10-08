import { Monitor, Utensils, Syringe, GlassWater, School, ShoppingBag, Car, Home, Zap, Briefcase, Heart, Plane, Move } from "lucide-react"

export const colorOptions = ["#14532D", "#FFDF00", "#DAB1DA", "#FF4D00", "#B45309", "#991B1B", "#3730A3", "#0E7490", "#7E22CE", "#BE185D", "#C2410C"]

export const iconOptions = [
  { value: "monitor", icon: Monitor },
  { value: "utensils", icon: Utensils },
  { value: "shopping-bag", icon: ShoppingBag },
  { value: "car", icon: Car },
  { value: "home", icon: Home },
  { value: "zap", icon: Zap },
  { value: "briefcase", icon: Briefcase },
  { value: "heart", icon: Heart },
  { value: "plane", icon: Plane },
  { value: "move", icon: Move },
  {value: "school" , icon: School},
  {value: "water" , icon: GlassWater},
  {value: "doctor", icon: Syringe}
]

export const getIconComponent = (value) => {
  const found = iconOptions.find((opt) => opt.value === value)
  return found ? found.icon : Monitor 
}