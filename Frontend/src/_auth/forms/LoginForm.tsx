import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { RegisterValidation } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import Loader from "@/components/ui/loader"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"


const LoginForm = () => {
  const { toast } = useToast();
  const nav = useNavigate()
  const [isUserLoading, setIsUserLoading] = useState(false)
  
  
  function handleSignin(values: z.infer<typeof RegisterValidation>)  {
    console.log(values)
    setIsUserLoading(true)
    signIn(values.email,values.password)
    form.reset()
  }

  const signIn = async (email: string,password: string) => {
    const formData = new FormData();
    formData.append('email',email);
    formData.append('password',password)
    try {
      const response = await axios.post('http://localhost:8080/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)
      localStorage.setItem('token',response.data.token)
      localStorage.setItem('erp',response.data.erp)
      localStorage.setItem('email', response.data.email)
      localStorage.setItem('name', response.data.name)
      nav("/")
      setIsUserLoading(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsUserLoading(false)
        const axiosError = error as AxiosError;
  
        if (axiosError.response) {
          if (axiosError.response.status === 400 && 
            (axiosError.response.data === "Email Not Registered!" || 
            axiosError.response.data === "Invalid email or password")
            ) {
            toast({title:axiosError.response.data,})
            }
            
        }else{
          toast({title:"Backend Not Connected!"})
        }
      }
    }
  };

  const form = useForm<z.infer<typeof RegisterValidation>>({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  

  return (
    <Form {...form}>
    <div className="sm:w-420 flex-center flex-col">

      <h2 className="h1-bold md:h1-bold pt-5 sm:pt-12">
        Login
      </h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">
        Welcome Back!
      </p>
      <form
        onSubmit={form.handleSubmit(handleSignin)}
        className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="shad-button_primary"  style={{backgroundColor:'#2E0854'}}>
          {isUserLoading ? (
            <div className="flex-center gap-2">
              <Loader /> Loading...
            </div>
          ) : (
            "Log in"
          )}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2">
          Don&apos;t have an account?
          <Link
            to="/register"
            className="text-primary-500 text-small-semibold ml-1">
            Register
          </Link>
        </p>
      </form>
    </div>
  </Form>
  )
}

export default LoginForm