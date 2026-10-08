import { NavLink } from "react-router-dom"
import { LayoutDashboard, ArrowUpCircle, ArrowDownCircle, Tag } from "lucide-react"

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/income", label: "Income", icon: ArrowUpCircle },
  { to: "/expense", label: "Expenses", icon: ArrowDownCircle },
  { to: "/category", label: "Categories", icon: Tag },
]

export default function BottomNav({ className = "" }) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-[#E7E5E4] flex items-stretch justify-around h-16 ${className}`}
    >
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 text-[11px] ${
              isActive ? "text-[#14532D]" : "text-[#78716C]"
            }`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}