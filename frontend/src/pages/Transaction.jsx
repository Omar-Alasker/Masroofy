import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState, useEffect } from "react"
import api from "@/api/axios"

const transactionSchema = z.object({
    type: z.enum(["expense", "income"], { required_error: "Please select a type" }),
    title: z.string().min(2, "Title must be at least 2 characters"),
    amount: z.coerce.number().min(0.01, "Amount must be greater than zero"),
    description: z.string().optional(),
    date: z.date({ required_error: "Date must be chosen" }),
    categoryId: z.string().min(1, "Please select a category")
})

export default function Transaction() {
    const {
        register,
        handleSubmit, 
        watch,  
        reset,
        setValue,
        control, 
        formState: {errors}
    } = useForm({resolver: zodResolver(transactionSchema)})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])

    const handleAddTransaction = async (data) => {
        try{
            setLoading(true)
            const endPoint = data.type === 'expense' ? "/expense" : '/income'
            const {title, amount, description, date, categoryId} = data
            await api.post(endPoint, {title, amount, description, date, categoryId})
            toast.success("Transaction added successfully!")
            reset()
        }
        catch(err){
            toast.error(err.response?.data?.message || "Something went wrong")
        }
        finally{
            setLoading(false)
        }
    }

    const selectedType = watch('type')
    const fetchCategories = async (type) => {
        try{
            const { data } = await api.get(`/category?type=${type}`)
            setCategories(data)
        }
        catch(err){
            console.log(err)
            setError(err.response?.data?.message || "Something went wrong")
        }
    }

    useEffect(() => {
        if (selectedType) {
            fetchCategories(selectedType)
            setValue("categoryId", "")
        }
    }, [selectedType])

  return (
    <div>
        <div className="flex justify-center md:mt-3">
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(handleAddTransaction)}>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="Add Title Here..."
                                {...register('title')}
                            />
                        </div>
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                type="text"
                                placeholder="Add Description Here..."
                                {...register('description')}
                            />
                        </div>
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <NativeSelect className='w-full' id='type' {...register('type')}>
                                <NativeSelectOption value="">Select Type</NativeSelectOption>
                                <NativeSelectOption value="income">Income</NativeSelectOption>
                                <NativeSelectOption value="expense">Expense</NativeSelectOption>
                            </NativeSelect>
                        </div>
                        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="amount">Amount</Label>
                            </div>
                            <Input id="amount" type="number" placeholder='Add Amount Here...' {...register('amount')}/>
                        </div>
                        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <NativeSelect className='w-full' id='category' {...register('categoryId')}>
                                <NativeSelectOption value="">Select Category</NativeSelectOption>
                                {categories.map((category) => 
                                    <NativeSelectOption key={category._id} value={category._id}>{category.name}</NativeSelectOption>
                                )}
                            </NativeSelect>
                        </div>
                        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <Popover>
                                <PopoverTrigger
                                    render={
                                    <Button variant="outline" id="date-picker-simple" className="justify-start font-normal mb-3">
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                    }
                                />
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    defaultMonth={field.value}
                                    />
                                </PopoverContent>
                                </Popover>
                            )}
                        />
                    </div>
                    {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full">
                        Add Transaction
                    </Button>
                </CardFooter>
            </form>
            </Card>
        </div>
    </div>
  )
}
