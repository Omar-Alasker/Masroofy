import { getIconComponent } from "@/constants/categoryOptions"
import { Pencil, Trash } from 'lucide-react'
import { useState } from "react"

export default function CategoryCard({ category, onEdit, onDelete }) {
  const Icon = getIconComponent(category.icon)
  const color = category.color || "#78716C"

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-[#E7E5E4] rounded-xl">
      <div
        className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}1A`, color: color }}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#1C1917] truncate">{category.name}</p>
        <span className="text-xs text-[#78716C] capitalize">{category.type}</span>
      </div>

      {category.monthlyLimit ? (
        <p className="text-sm font-medium text-[#1C1917] whitespace-nowrap">
          {category.monthlyLimit} JOD/mo
        </p>
      ) : null}

      <div className="flex gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="p-1.5 rounded-md text-[#78716C] hover:bg-[#F6F7F5] hover:text-[#1C1917]"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(category._id)}
          className="p-1.5 rounded-md text-[#78716C] hover:bg-red-50 hover:text-red-600"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}