import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterValidation } from "@/lib/validation"
import { useState, useRef } from "react"
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios"
import { useToast } from "@/components/ui/use-toast"
import Loader from "@/components/ui/loader"



export const RegisterForm = () => { 
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof RegisterValidation>>({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      email: "",
      password: ""
    },
  })

 
  function onSubmit(values: z.infer<typeof RegisterValidation>)  {
    setIsLoading(true)
    if(selectedFile!==null){
      handleFileUpload(selectedFile,values.email,values.password)
    }
    setSelectedFile(null)
    form.reset();
  }

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (file: File,email: string,password: string) => {
    console.log('Selected File:', file);
  
    const formData = new FormData();
    formData.append('email',email);
    formData.append('password',password)
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:8080/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({title:response.data,});
      setIsLoading(false)
      setSelectedFile(null)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setSelectedFile(null)
        setIsLoading(false)

        const axiosError = error as AxiosError;
  
        if (axiosError.response) {
          if (axiosError.response.status === 400 && 
            (axiosError.response.data === "ERP already Registered!" || 
            axiosError.response.data === "Email is already in use!")
            ) {
            toast({title:axiosError.response.data,})
            }
        }
      }
    }
    setSelectedFile(null)
  };

  

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <h2 className="h1-bold md:h1-bold">
          Create your account
        </h2>
        
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

      <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label" style={{color:'#2E0854'}}>Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" placeholder="user@example.com" {...field} />
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
                <FormLabel className="shad-form_label" style={{color:'#2E0854'}}>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" placeholder="********"{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

              <FormItem>
                <FormLabel className="shad-form_label" style={{color:'#2E0854'}}>Upload Transcript</FormLabel>
                <FormControl>
                <div>
                  {/* Use a custom-styled button or div to trigger file input click */}
                  <div onClick={openFileDialog} className="shad-input flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-light-4">
                  <p className="p-2">{selectedFile?.name ? <p style={{color:'white'}}>{selectedFile.name}</p> : 'transcript.pdf'}</p>
                  </div>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
                </FormControl>
                <FormMessage />
              </FormItem>

          <Button type="submit" className="shad-button_primary" style={{backgroundColor:'#2E0854'}}>
                  {isLoading ? (
                      <div className="flex-center gap-2">
                        <Loader /> Loading...
                      </div>
                    ) : (
                      "Sign Up"
                    )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/login"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        
      </form>
      </div>
    </Form>
  )
}

export default RegisterForm
