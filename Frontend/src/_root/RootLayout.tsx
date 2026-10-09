import Bottombar from "@/components/shared/bottombar"
import LeftSidebar from "@/components/shared/leftsidebar"
import Topbar from "@/components/shared/topbar"
import { toast } from "@/components/ui/use-toast"
import axios, { AxiosError } from "axios"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

const RootLayout = () => {

  const nav = useNavigate()
  useEffect(() => {
    if(localStorage.getItem('token')!==null){
        validateJWT(localStorage.getItem('token'))
    }else{
        nav("/login")
    }
  }
  ,[])


  const validateJWT = async (token: string | null) => {
    if(token !== null){
    const formData = new FormData();
    formData.append('token', token)
    try {
      const response = await axios.post('http://localhost:8080/auth', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response)
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
      nav("/login")
    }
  }
}

  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  )
}

export default RootLayout