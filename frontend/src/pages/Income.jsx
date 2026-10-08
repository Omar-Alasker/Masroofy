import api from "@/api/axios"
import { useEffect, useState } from "react"
import { getIconComponent } from "@/constants/categoryOptions"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import  { formatPrice }  from "@/lib/formatPrice"
import useDateStore from "@/store/dateStore"


export default function Incomes() {
  const [incomes, setIncomes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const dateRange = useDateStore((state) => state.dateRange)

  const fetchIncome = async () => {
    try{
      setLoading(true)
      const {data} = await api.get('/income' , {params: {page, limit: 10, startDate: dateRange.from, endDate: dateRange.to}})
      setIncomes(data.incomes)
      setPagination(data.pagination)
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
    fetchIncome()
  }, [page , dateRange])
  return (
    <div>
      <Table className='hidden md:table'>
        <TableCaption>A list of your recent incomes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">MERCHANT</TableHead>
            <TableHead>CLASSIFICATION</TableHead>
            <TableHead>AMOUNT</TableHead>
            <TableHead className="text-right">TIMESTAMP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomes.map((income) => (
            <TableRow key={income._id}>
              <TableCell className="font-medium pr-20">
                <div className="flex gap-2 min-w-90">
                  <div style={{ backgroundColor: `${income.categoryId.color}3A` }} className="flex items-center rounded">
                    {(() => {
                      const Icon = getIconComponent(income.categoryId.icon)
                      return <Icon className="h-5 w-5 m-2 " />
                    })()}
                  </div>
                  <div className="flex flex-col">
                    <div>{income.title}</div>
                    <div className="font-light text-xs text-mist-500 leading-relaxed whitespace-normal wrap-break-word">{income.description}</div>
                  </div>
                </div>
                
              </TableCell>
              <TableCell><Badge style={{ backgroundColor: income.categoryId.color }} variant="default">{income.categoryId.name}</Badge></TableCell>
              <TableCell>{formatPrice(income.amount)}</TableCell>
              <TableCell className="text-right">{new Date(income.date).toLocaleDateString('sv-SE')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{formatPrice(incomes.reduce((acc, curr) => acc + curr.amount , 0))}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="md:hidden flex flex-col gap-6">
          {
            incomes.map((income) => 
              <Card key={income._id}>
                <CardHeader>
                  <CardTitle className='mb-4'>
                    <div className="flex gap-2">
                      <div style={{ backgroundColor: `${income.categoryId.color}3A` }} className="flex items-center rounded">
                        {(() => {
                          const Icon = getIconComponent(income.categoryId.icon)
                          return <Icon className="h-5 w-5 m-2 " />
                        })()}
                      </div>
                      <div className="flex flex-col">
                        <div>{income.title}</div>
                        <div className="font-light text-sm text-mist-700">{new Date(income.date).toLocaleDateString('sv-SE')}</div>
                      </div>
                    </div>
                  </CardTitle>
                  <CardAction className='text-green-600'>+{formatPrice(income.amount)}</CardAction>
                  <CardDescription >{income.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Badge style={{ backgroundColor: income.categoryId.color }} variant="default">{income.categoryId.name}</Badge>
                </CardFooter>
              </Card>
            )
          }
      </div>
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>

        <span className="text-sm text-[#78716C]">
          Page {pagination?.page} of {pagination?.totalPages}
        </span>

        <Button
          variant="outline"
          disabled={pagination && page >= pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
