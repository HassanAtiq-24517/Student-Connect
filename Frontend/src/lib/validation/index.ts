import * as z from "zod"


export const RegisterValidation = z.object({
    email: z.string().email({message:'Invalid email address'}),
    password: z.string().min(8,"Password must be 8 characters"),
  })

export const PostValidation = z.object({
  course: z.string({
    required_error: "Please select a course.",
  }),
  description: z.string().min(5, { message: "Minimum 5 characters." }).max(200, { message: "Maximum 200 characters" }),
});

export const ProjectValidation = z.object({
  name: z.string().max(20,{message:"Max 20 characters"}),
  course: z.string({
    required_error: "Please select a course.",
  }),
  size: z.string({
    required_error: "Required."
  })
});