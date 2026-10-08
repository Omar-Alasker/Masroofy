import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"


export default function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="h-13 flex items-center bg-white justify-between px-2 border-b border-[#E7E5E4]">
      <div className="md:hidden flex gap-1">
        <img className="w-6" src="/images/screen.png" alt="Icon" />
        <h1 className="font-display">MASROOFY</h1>
      </div>

      
      <div className="flex gap-3 ml-auto">
        <Button onClick={() => navigate('/transaction')} className='flex p-1 text-[11px] md:text-[16px] md:p-3'>+ Add Transaction</Button>
        <Avatar>
          <AvatarImage
            src="/images/profile(1).jpg"
            alt="photo"
            className="grayscale"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  )
}