import { useForm } from "react-hook-form"
import { Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import api from "@/api/axios"
import { SquarePlus } from 'lucide-react';
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Pencil } from 'lucide-react';
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from "@/components/ui/input-group"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["expense", "income"], { required_error: "Please select a type" }),
  icon: z.string().optional(),
  color: z.string().optional(),
  monthlyLimit: z.coerce.number().optional()
})
import { colorOptions, iconOptions, } from "@/constants/categoryOptions"
import CategoryCard from "@/components/CategoryCard"

export default function Category() {
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {register, handleSubmit, watch, reset, control, formState: {errors}} = useForm({resolver: zodResolver(categorySchema) ,defaultValues: {type: "expense",color: colorOptions[0],}})
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors }
  } = useForm({ resolver: zodResolver(categorySchema) })
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const selectedType = watch("type")

  const handleAddCategory = async(data) => {
    try{
      setLoading(true)
      await api.post('/category' , data)
      fetchCategories()
      reset()
    }
    catch(err){
      console.log(err)
      setError(err.response?.data?.message || "Something went wrong")
    }
    finally{
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id) => {
    try{
      setLoading(true)
      await api.delete(`/category/${id}`)
      toast.success("Category deleted successfully!")
      fetchCategories()
    }
    catch(err){
      console.log(err)
      setError(err.response?.data?.message || "Something went wrong")
      toast.error(err.response?.data?.message || "Something went wrong")
    }
    finally{
      setLoading(false)
    }
  }

  const handleEditCategory = async (id, data) => {
    try{
      setLoading(true)
      const {data: category} = await api.patch(`/category/${id}` , data)
      setCategories((prev) => prev.map(p => (p._id === id? category : p)))
      setEditingCategory(null)
    }
    catch(err){
      console.log(err)
      setError(err.response?.data?.message || "Something went wrong")
    }
    finally{
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try{
      setLoading(true)
      const {data: categories} = await api.get('/category')
      setCategories(categories)
    }
    catch(err){
      console.log(err)
      setError(err.response?.data?.message || "Something went wrong")
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=> {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (editingCategory) {
      resetEdit(editingCategory)
    }
  }, [editingCategory])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
          
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitEdit((data) => handleEditCategory(editingCategory._id, data))}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="edit-category-input">Category Title</FieldLabel>
                    <InputGroup className="bg-[#EEF0FF]">
                      <InputGroupInput id="edit-category-input" placeholder="Transportation" {...registerEdit("name")}/>
                      <InputGroupAddon align="inline-end">
                        <Pencil />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  {editErrors.name && <p className="text-red-500 text-sm">{editErrors.name.message}</p>}
                  <Field>
                    <FieldLabel htmlFor="edit-limit-input">Monthly Limit</FieldLabel>
                    <InputGroup className="bg-[#EEF0FF]">
                      <InputGroupInput type='number' id="edit-limit-input" placeholder="180.00" {...registerEdit('monthlyLimit')}/>
                      <InputGroupAddon>
                        <InputGroupText>JOD</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        JOD / MONTH
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  {editErrors.monthlyLimit && <p className="text-red-500 text-sm mt-1">{editErrors.monthlyLimit.message}</p>}
                </FieldGroup>
                <DialogFooter>
                  <DialogClose render={<Button type="button" variant="outline">Cancel</Button>} />
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
        </Dialog>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold"><SquarePlus className="text-green-900"/> Create Category</CardTitle> 
          </CardHeader>
          <form onSubmit={handleSubmit(handleAddCategory)}>
            <CardContent>
              <div className="py-6">
                <Label>Category Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <ToggleGroup
                      type="single"
                      value={field.value ? [field.value] : []}
                      onValueChange={(value) => {
                        if (value.length > 0) {
                          field.onChange(value[0])
                        }
                      }}
                      className="w-full mt-2"
                    >
                      <ToggleGroupItem value="expense" className="flex-1 flex-col h-auto py-3 gap-1">
                        <ArrowUpRight className="h-4 w-4" />
                        Expense Category
                      </ToggleGroupItem>
                      <ToggleGroupItem value="income" className="flex-1 flex-col h-auto py-3 gap-1">
                        <ArrowDownLeft className="h-4 w-4" />
                        Income Category
                      </ToggleGroupItem>
                    </ToggleGroup>
                  )}
                />
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
              </div>
              <div>
                <Field>
                  <FieldLabel htmlFor="category-input">Category Title</FieldLabel>
                  <InputGroup className="bg-[#EEF0FF]">
                    <InputGroupInput id="category-input" placeholder="Transportation" {...register("name")}/>
                    <InputGroupAddon align="inline-end">
                      <Pencil />
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div className="py-6">
                <Label className='pb-3'>Category Color</Label>
                <Controller
                  name='color'
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-2 flex-wrap">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          style={{ backgroundColor: color }}
                          className={`h-8 w-8 rounded-full ${field.value === color ? "ring-2 ring-offset-2 ring-black" : ""}`}
                        />
                      ))}
                    </div>
                  )}
                />
              </div>
              <div className="pb-6">
                <Label className=''>Category Icon</Label>
                <Controller
                  name="icon"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {iconOptions.map(({ value, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => field.onChange(value)}
                          className={`h-12 w-12 rounded-lg flex items-center justify-center border transition-colors ${
                            field.value === value
                              ? "border-[#14532D] bg-[#14532D]/10 text-[#14532D]"
                              : "border-[#E7E5E4] text-[#57534E] hover:bg-[#F6F7F5]"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </button>
                      ))}
                    </div>
                  )}
                />
                {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon.message}</p>}
              </div>
              <div className="pb-6">
                <Field>
                  <FieldLabel htmlFor="limit-input">Monthly Limit</FieldLabel>
                  <InputGroup className="bg-[#EEF0FF]">
                    <InputGroupInput type='number' id="limit-input" placeholder="180.00" {...register('monthlyLimit')}/>
                    <InputGroupAddon>
                      <InputGroupText>JOD</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                      JOD / MONTH
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
                {errors.monthlyLimit && <p className="text-red-500 text-sm mt-1">{errors.monthlyLimit.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className='bg-green-900 w-full py-5 text-md hover:bg-green-800'>
                {selectedType === "income"
                ? "Create Income Category"
                : selectedType === "expense"
                ? "Create Expense Category"
                : "Create Category"}
              </Button>
            </CardFooter>
          </form>
          
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} onEdit={() => setEditingCategory(category)} onDelete={() => handleDeleteCategory(category._id)}/> 
        ))}
      </div>
    </div>
  )
}
