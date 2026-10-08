import { Button } from "@/components/ui/button"
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import useAuthStore from "@/store/authStore"
import api from '@/api/axios'
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod" 

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(5, "Password must be at least 5 characters")
})

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({resolver: zodResolver(loginSchema)})

    const navigate = useNavigate()
    const login = useAuthStore((store) => store.login)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const onSubmit = async (data) => {
        try{
            setLoading(true)
            const {data: response} = await api.post('/auth', data)
            const token = response.token
            const user = response.user
            if(token){
                login(token, user)
                navigate('/')
            }
        }
        catch(err){
            setError(err.response?.data?.message || "Something went wrong")
        }
        finally{
            setLoading(false)
        }
    }

  return (
    <div className="flex justify-center mt-6">
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                    <Button variant="link" onClick={() => navigate('/register')}>Sign Up</Button>
                </CardAction>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register("email")}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                href="#"
                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                Forgot your password?
                                </a>
                            </div>
                            <Input id="password" type="password" {...register('password')}/>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <Button disabled={loading} type="submit" className="w-full">
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  )
}
