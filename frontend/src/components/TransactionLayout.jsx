import { Outlet } from "react-router-dom"
import DateRangeFilter from "./DateRangeFilter"

export default function TransactionLayout() {
  return (
    <div>
      <DateRangeFilter/>
      <Outlet/>
    </div>
  )
}
