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
import { ProjectValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import Loader from "../ui/loader";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandInput, CommandItem } from "../ui/command";

import { ChevronsUpDown, Check } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";

type ProjectFormProps = {
  id: number | null;
  course_code: string | null;
  name: string | null;
  size: number | null
  action: "Create" | "Update";
};

function ProjectForm({ course_code, name, size, action }: ProjectFormProps) {
    const navigate = useNavigate();
    const { toast } = useToast();

    type course = {
        courseCode: string;
        courseTitle: string;
    };



    const [courses, setCourses] = useState<course[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            const formData = new FormData();
            formData.append('erp', localStorage.getItem('erp') || "0");
            try {
                const response = await axios.post('/courses/enrolled', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setCourses(response.data);
                console.log(courses);
                console.log(response.data[0].courseCode);
            } catch (error) {
                console.error('Error fetching courses:', error);
                // Handle errors appropriately (e.g., show an error message)
            }
        };

        fetchCourses();
    }, []);


    const form = useForm<z.infer<typeof ProjectValidation>>({
        resolver: zodResolver(ProjectValidation),
        defaultValues: {
            course: course_code ? course_code : "",
            name: name ? name : "",
            size: size ? size.toString() : ""
        },
    });


    const sortedCourses = [...courses].sort((a, b) => a.courseTitle.localeCompare(b.courseTitle)
    );

    const languages = sortedCourses.map(course => ({
        label: course.courseTitle,
        value: course.courseCode,
    })) || [];


    const handleSubmit = async (value: z.infer<typeof ProjectValidation>) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('erp', localStorage.getItem('erp') || "0");
        formData.append('name', value.name);
        formData.append('courseCode', value.course);
        formData.append('size', value.size);

        try {
            const response = await axios.post('/project/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast({ title: response.data, });
            setLoading(false);
            form.reset();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setLoading(false);
                toast({
                    title: error.response?.data
                });
            }
        }

    };

    return (

        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-7 w-full  max-w-5xl">

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Group Name</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" placeholder="e.g DB Project" {...field} disabled={action==="Update"} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Course</FormLabel>
                            <div> </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            role="combobox"
                                            disabled={action==="Update"}
                                            className={cn(
                                                "w-[275px] justify-between",
                                                !field && "text-muted-foreground"
                                            ) }
                                        >
                                            <div className="text-light-4 pt-1 justify-start">
                                                {field.value
                                                    ? <div style={{ color: 'white' }}>
                                                        {languages.find(
                                                            (language) => language.value === field.value
                                                        )?.label}
                                                    </div>
                                                    : "Select Course"}
                                            </div>

                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-full flex-col p-0" style={{ backgroundColor: 'black' }}>
                                    <Command>
                                        <CommandInput className="w-full flex-row p-0" placeholder="Search course..." />
                                        <CommandGroup>
                                            {languages.map((language) => (
                                                <CommandItem 
                                                    value={language.label}
                                                    key={language.value}
                                                    onSelect={() => {
                                                        form.setValue("course", language.value);
                                                    } }
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            language.value === field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )} />
                                                    {language.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )} />

                <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Size</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" placeholder="e.g 5" {...field} disabled={action==="Update"} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />


                <div className="flex gap-4 items-center justify-end">
                {action==='Create'?(<Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)} style={{backgroundColor:'#2E0854'}}>
            Cancel
          </Button>) : ("")}
                   {action==="Create" ? ( <Button
                        type="submit"
                        className="shad-button_primary whitespace-nowrap"
                        disabled={isLoading} style={{ backgroundColor: '#2E0854' }}>
                        {(isLoading) && <Loader />}
                        {action} Project
                    </Button>) : ("")}
                </div>
            </form>
        </Form>
    );
}

export default ProjectForm;