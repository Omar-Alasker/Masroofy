import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import api from '@/api/axios'
import useAuthStore from "@/store/authStore"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
})


export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({resolver: zodResolver(registerSchema)})

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const login = useAuthStore((store) => store.login)
    const navigate = useNavigate()

    const onSubmit = async (data) => {
        try{
            setLoading(true)
            const {data : response} = await api.post('/user', data)
            const token = response.token
            const user = response.user
            if(token) {
                login(token, user)
                navigate('/')
            }
        }
        catch(err){
            setError(err.response?.data?.message || "Something went wrong")
            setTimeout(() => setError('') , 5000)
        }
        finally{
            setLoading(false)
        }
    }

  return (
    <div className="flex flex-col md:max-w-4/12 m-auto p-6">
        <Card>
            <CardHeader className='flex flex-col'>
                <CardTitle className='font-display text-xl sm:text-2xl md:text-3xl text-[#1C1917]'>Register</CardTitle>
                <CardDescription className='font-display text-sm sm:text-md md:text-lg' >Create an account to start tracking your budget</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className='flex flex-col gap-6 py-6'>
                    <div>
                        <Label htmlFor='name'>First Name</Label>
                        <Input placeholder='eg. John' id='name' {...register("name")} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}                    
                    </div>
                    <div>
                        <Label htmlFor='lastName'>Last Name</Label>
                        <Input placeholder='eg. Lee' id='lastName' {...register("lastName")} />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor='email'>Email Address</Label>
                        <Input placeholder='user@email.com' id='email' {...register("email")} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor='password'>Password</Label>
                        <Input placeholder='Enter strong password' id='password' type='password' {...register("password")} />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                </CardContent>

                <CardFooter className='flex flex-col items-center gap-2'>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <Button className='font-display py-2 px-10' disabled={loading} type='submit'>{loading ? "Registering..." : "Register Now"}</Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  )
}
