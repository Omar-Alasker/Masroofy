import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from '@/pages/Login'
import ProtectedRoutes from './components/ProtectedRoutes'
import Dashboard from '@/pages/Dashboard'
import Income from '@/pages/Income'
import Expenses from '@/pages/Expenses'
import Category from '@/pages/Category'
import Layout from './components/Layout'
import Transaction from './pages/Transaction'
import TransactionLayout from './components/TransactionLayout'
import Download from './pages/Download'
import { Toaster } from "@/components/ui/sonner"

 
function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        
        <Route element={<ProtectedRoutes/>}>
          <Route element={<Layout/>}>
            <Route element={<TransactionLayout/>}>
              <Route path='/income' element={<Income/>}></Route>
              <Route path='/expense' element={<Expenses/>}></Route>
            </Route>
            <Route index element={<Dashboard/>}></Route>
            <Route path='/category' element={<Category/>}></Route>
            <Route path='/transaction' element={<Transaction/>}></Route>
            <Route path='/download' element={<Download/>}></Route>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App