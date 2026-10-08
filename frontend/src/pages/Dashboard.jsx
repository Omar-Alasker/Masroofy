import TransactionsChart from "@/components/TransactionsChart"
import DownloadBtn from "@/components/DownloadBtn"

export default function Dashboard() {
  return (
    <div className="min-w-0">
      <div className="flex flex-row-reverse mb-6">
        <DownloadBtn></DownloadBtn>
      </div>
      <TransactionsChart></TransactionsChart>
    </div>
  )
}
