import { NavLink } from "react-router-dom"
import { LayoutDashboard, ArrowUpCircle, ArrowDownCircle, Tag, LogOut } from "lucide-react"
import useAuthStore from "@/store/authStore"
import { useNavigate } from "react-router-dom"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/income", label: "Income", icon: ArrowUpCircle },
  { to: "/expense", label: "Expenses", icon: ArrowDownCircle },
  { to: "/category", label: "Categories", icon: Tag },
]

export default function Sidebar({ className = "" }) {
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <aside className={`w-60 border-r border-[#E7E5E4] bg-white flex-col ${className}`}>
      <div className="h-13 flex items-center gap-2 px-6 border-b border-[#E7E5E4]">
        <img className="w-6" src="/images/screen.png" alt="Icon" />
        <span className="font-display font-semibold text-[#1C1917]">MASROOFY</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#14532D] text-white"
                  : "text-[#57534E] hover:bg-[#F6F7F5]"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[#E7E5E4]">
        {user && (
          <p className="px-3 text-xs text-[#78716C] mb-2 truncate">
            {user.name} {user.lastName}
          </p>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#57534E] hover:bg-[#F6F7F5] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}