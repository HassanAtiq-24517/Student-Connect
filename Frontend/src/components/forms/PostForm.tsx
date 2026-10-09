import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import Loader from "../ui/loader";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandInput, CommandItem } from "../ui/command";

import { ChevronsUpDown, Check } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type PostFormProps = {
  id: number | null;
  course_code: string | null;
  content: string | null;
  action: "Create" | "Update" | "View";
};

const PostForm = ({ id, course_code, content, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  type course = {
    courseCode: string;
    courseTitle: string;
  }

  

  const [courses, setCourses] = useState<course[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [mcourses, setMCourses] = useState<course[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
        const formData = new FormData();
        formData.append('erp',localStorage.getItem('erp')||"0");
        try {
          const response = await axios.post('http://localhost:8080/courses/enrolled', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });        
        setCourses(response.data);
        console.log(courses)
        console.log(response.data[0].courseCode)
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Handle errors appropriately (e.g., show an error message)
      }
    };

    const fetchMentorCourses = async () => {
      const formData = new FormData();
      formData.append('erp',localStorage.getItem('erp')||"0");
      try {
        const response = await axios.post('http://localhost:8080/courses/mentor', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });        
      setMCourses(response.data);
      console.log(courses)
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };


    fetchMentorCourses();
    fetchCourses();
  }, []);


  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      course: course_code ? course_code : "",
      description: content ? content : "",
    },
  });

  const sortedMCourses = [...mcourses].sort((a, b) =>
    a.courseTitle.localeCompare(b.courseTitle)
  );


  const McourseList = sortedMCourses.map(course => ({
    label: course.courseTitle,
    value: course.courseCode,
  })) || [];


  const sortedCourses = [...courses].sort((a, b) =>
    a.courseTitle.localeCompare(b.courseTitle)
  );

  const languages = sortedCourses.map(course => ({
    label: course.courseTitle,
    value: course.courseCode,
  })) || [];


  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    setLoading(true)
    const formData = new FormData();
    formData.append('content',value.description)
    var endpoint:string;

    if(action==='Update'){
      formData.append('id',id?.toString()||'0')
      endpoint = 'update'
    }
    else{
      endpoint = 'create'
      formData.append('erp',localStorage.getItem('erp')||"")
      formData.append('courseCode',value.course);
    }
      
  
    try {
      const response = await axios.post('http://localhost:8080/learning/'+endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({title:response.data,});
      setLoading(false)
      if(action==='Create'){
      form.reset()}else{
        navigate(0)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setLoading(false)
      }
    }
    
  };

  return (

          <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">

        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Course</FormLabel>
              <Popover >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      role="combobox"
                      className={cn(
                        "w-[275px] justify-between",
                        !field && "text-muted-foreground"
                      )}
                      disabled={action==='Update' || action==='View'}
                    >
                        <div className="text-light-4 pt-1">
                        {field.value
                        ? <div style={{color:'white'}}>
                        {action==="View" ? (McourseList.find(
                            (language) => language.value === field.value
                          )?.label
                        ) : (languages.find(
                            (language) => language.value === field.value
                          )?.label
                        )}
                          </div>
                        : "Select Course"}
                        </div>
                      
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[275px] p-0" style={{backgroundColor:'black'}}>
                <Command>
                    <CommandInput placeholder="Search course..." />
                    <CommandGroup>
                      {action==='View' ? (McourseList.map((language) => (
                        <CommandItem
                          value={language.label}
                          key={language.value}
                          onSelect={() => {
                            form.setValue("course", language.value)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              language.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {language.label}
                        </CommandItem>
                      ))) : (
                      languages.map((language) => (
                        <CommandItem
                          value={language.label}
                          key={language.value}
                          onSelect={() => {
                            form.setValue("course", language.value)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              language.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {language.label}
                        </CommandItem>
                      )))}

                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Description</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar placeholder:text-light-4 "
                  {...field}
                  placeholder="tell us what you want to learn, and we'll help you out!"
                  disabled={action==="View"}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          {action==='Create'?(<Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)} style={{backgroundColor:'#2E0854'}}>
            Cancel
          </Button>) : ("")}
          {(action==='Create'||action==='Update')?(
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoading} style={{backgroundColor:'#2E0854'}}>
            {(isLoading) && <Loader />}
            {action} Post
          </Button>) : ("")}
        </div>
      </form>
    </Form>
  );
};

export default PostForm;