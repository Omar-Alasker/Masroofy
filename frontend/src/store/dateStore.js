import { create } from "zustand"

const useDateStore = create((set) => ({
  dateRange: { from: undefined, to: undefined },
  setDateRange: (range) => set({ dateRange: range })
}
))

export default useDateStore