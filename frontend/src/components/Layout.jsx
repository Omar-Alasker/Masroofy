// components/Layout.jsx
import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import BottomNav from "@/components/BottomNav"

export default function Layout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar className="hidden md:flex" />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 pb-20 md:pb-6 min-w-0">
          <Outlet />
        </main>
      </div>

      <BottomNav className="md:hidden" />
    </div>
  )
}