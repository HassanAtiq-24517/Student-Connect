import { toast } from "@/components/ui/use-toast"
import axios, { AxiosError } from "axios"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

const AuthLayout = () => {

  const nav = useNavigate()
  useEffect(() => {
    if(localStorage.getItem('token')!==null){
        validateJWT(localStorage.getItem('token'))
    }
  }
  ,[])


  const validateJWT = async (token: string | null) => {
    if(token !== null){
    const formData = new FormData();
    formData.append('token', token)
    try {
      const response = await axios.post('/auth', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)
      if(response.data=true){
        nav("/")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
  
        if (axiosError.response) {
          if (axiosError.response.status === 400 && 
            (axiosError.response.data === "Invalid Authentication")
            ) {
            toast({title:axiosError.response.data,})
            }
        }
      }
    }
  }
}
  
  return (
        <>
        <img 
        src="/assets/images/home1.svg"
        alt="bgimage"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
        />
        <section className="flex flex-1 justify-center items-center flex-col py-10">
          <Outlet />
        </section>
        </>
  )
}

export default AuthLayout