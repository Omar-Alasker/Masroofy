import { useState, useEffect } from "react"
import api from "@/api/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon, Download as DownloadIcon } from "lucide-react"
import { format } from "date-fns"
import { formatPrice } from "@/lib/formatPrice"
import useDateStore from "@/store/dateStore"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
  header: { fontSize: 18, color: "#14532D", marginBottom: 4 },
  subheader: { fontSize: 10, color: "#78716C", marginBottom: 20 },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#14532D",
    padding: 6,
  },
  headerCell: { flex: 1, color: "white", fontSize: 9, fontWeight: "bold" },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #E7E5E4",
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  cell: { flex: 1, fontSize: 9 },
  income: { color: "#14532D" },
  expense: { color: "#B91C1C" },
  summary: {
    marginTop: 20,
    paddingTop: 10,
    borderTop: "1px solid #1C1917",
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
})

function TransactionReport({ transactions, dateRange }) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Masroofy</Text>
        <Text style={styles.subheader}>
          Transaction Report
          {dateRange?.from && dateRange?.to
            ? ` · ${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
            : " · All time"}
        </Text>

        <View>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Type</Text>
            <Text style={styles.headerCell}>Category</Text>
            <Text style={styles.headerCell}>Title</Text>
            <Text style={styles.headerCell}>Amount</Text>
          </View>

          {transactions.map((t) => (
            <View style={styles.row} key={t._id}>
              <Text style={styles.cell}>{new Date(t.date).toLocaleDateString()}</Text>
              <Text style={[styles.cell, t.type === "income" ? styles.income : styles.expense]}>
                {t.type === "income" ? "Income" : "Expense"}
              </Text>
              <Text style={styles.cell}>{t.categoryId?.name || "Uncategorized"}</Text>
              <Text style={styles.cell}>{t.title}</Text>
              <Text style={[styles.cell, t.type === "income" ? styles.income : styles.expense]}>
                {t.type === "income" ? "+" : "-"}{formatPrice(t.amount)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Total Income</Text>
            <Text style={styles.income}>{formatPrice(totalIncome)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Total Expense</Text>
            <Text style={styles.expense}>{formatPrice(totalExpense)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Net</Text>
            <Text>{formatPrice(totalIncome - totalExpense)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default function Download() {
  const dateRange = useDateStore((state) => state.dateRange)
  const setDate = useDateStore((state) => state.setDateRange)
  const [fileName, setFileName] = useState("transactions")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setFileName(
        `transactions_${format(dateRange.from, "yyyy-MM-dd")}_to_${format(dateRange.to, "yyyy-MM-dd")}`
      )
    }
  }, [dateRange])

  const handleDownload = async () => {
    try {
      setLoading(true)
      const { data } = await api.get("/export", {
        params: {
          startDate: dateRange.from,
          endDate: dateRange.to,
        },
      })

      const blob = await pdf(
        <TransactionReport transactions={data.transactions} dateRange={dateRange} />
      ).toBlob()

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileName || "transactions"}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    }
    catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Something went wrong")
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto flex flex-col gap-4 mt-15">
      <h1 className="font-display text-xl text-[#1C1917]">Download Report</h1>
      <p className="text-sm text-[#78716C]">
        Choose a date range and export your income and expenses as a PDF.
      </p>

      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            "justify-start text-left font-normal"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL d, y")} - {format(dateRange.to, "LLL d, y")}
              </>
            ) : (
              format(dateRange.from, "LLL d, y")
            )
          ) : (
            "All time (no range selected)"
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <div>
        <Label htmlFor="filename">File name</Label>
        <Input
          id="filename"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="transactions"
          className='bg-white mt-1'
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button onClick={handleDownload} disabled={loading} className="w-full">
        <DownloadIcon className="mr-2 h-4 w-4" />
        {loading ? "Generating..." : "Download PDF"}
      </Button>
    </div>
  )
}