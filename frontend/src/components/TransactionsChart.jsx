import { Bar, BarChart, XAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import api from "@/api/axios"
import { useEffect, useState } from "react"
import { formatPrice } from "@/lib/formatPrice"
import { BanknoteArrowUp } from 'lucide-react';
import { BanknoteArrowDown } from 'lucide-react';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const chartConfig = {
  income: { label: "Income", color: "#14532D" },
  expense: { label: "Expense", color: "#C2290C" },
}

export default function TransactionsChart() {
    const [chartData, setChartData] = useState([])
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentYear = new Date().getFullYear()
    const [year, setYear] = useState(currentYear)
    const yearOptions = [currentYear - 2, currentYear - 1, currentYear]
    const [avgIncome, setAvgIncome] = useState(0)
    const [avgExpense, setAvgExpense] = useState(0)
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalExpense, setTotalExpense] = useState(0)

    const fetchChartData = async () => {
        try {
            const {data} = await api.get('/dashboard' , { params: {year} })
            const {expenseByMonth, incomeByMonth} = data

            const grouped = {}
            monthOrder.forEach((month) => {
                grouped[month] = {month, expense: 0, income: 0}
            })

            expenseByMonth.forEach((item) => {
                const month = monthNames[item._id]
                grouped[month].expense = item.total
            })
            
            incomeByMonth.forEach((item) => {
                const month = monthNames[item._id]
                grouped[month].income = item.total
            })

            setChartData(monthOrder.map((month) => grouped[month]))
            const incomesGroup = monthOrder.map((month) => grouped[month].income)
            setAvgIncome(((incomesGroup.reduce((acc, curr) => acc + curr , 0)) / 12).toFixed(2))
            const expensesGroup = monthOrder.map((month) => grouped[month].expense)
            setAvgExpense(((expensesGroup.reduce((acc, curr) => acc + curr , 0)) / 12).toFixed(2))
            setTotalExpense((expensesGroup.reduce((acc, curr) => acc + curr , 0)).toFixed(2))
            setTotalIncome((incomesGroup.reduce((acc, curr) => acc + curr , 0)).toFixed(2))
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchChartData()
    }, [year])


  return (
    <div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 pb-6">
            <Card className='w-full md:w-1/5 gap-0'>
                <CardHeader>
                    <CardTitle className='text-sm pb-2'>Yearly Income</CardTitle>
                    <CardAction><BanknoteArrowUp className="text-green-600"/></CardAction>
                </CardHeader>
                <CardContent className='text-xl font-black'>
                    {formatPrice(totalIncome)}
                </CardContent>
                <CardContent className='text-[12px] font-light'>
                    monthly {formatPrice(avgIncome)}
                </CardContent>
            </Card>
            <Card className='w-full md:w-1/5 gap-0'>
                <CardHeader>
                    <CardTitle className='text-sm pb-2'>Yearly Expenses</CardTitle>
                    <CardAction><BanknoteArrowDown className="text-red-600"/></CardAction>
                </CardHeader>
                <CardContent className='text-xl font-black'>
                    {formatPrice(totalExpense)}
                </CardContent>
                <CardContent className='text-[12px] font-light'>
                    monthly {formatPrice(avgExpense)}
                </CardContent>
            </Card>
        </div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg">Monthly Overview</h2>
            <NativeSelect value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {yearOptions.map((y) => (
                <NativeSelectOption key={y} value={y}>{y}</NativeSelectOption>
            ))}
            </NativeSelect>
        </div>
        <div className="w-full min-w-0 overflow-hidden">
        <ChartContainer config={chartConfig} className="h-75 w-full">
            <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
        </ChartContainer>
        </div>
    </div>
  )
}
