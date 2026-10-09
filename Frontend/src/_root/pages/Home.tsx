import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios, { AxiosError } from "axios"
import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import UpdatePost from "./UpdatePost"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import Loader from "@/components/ui/loader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Home = () => {

  type course = {
    courseCode: string;
    courseTitle: string;
  }

  type learning = {
    id: number,
    erp: number,
    course_code: string,
    content: string
  }

  type status = {
    id: number,
    flag:boolean
  }

  type mentor = {
    name: string,
    email: string,
    program: string,
    cgpa: number,
    grade: string
}


  const [courses, setCourses] = useState<course[]>([]);
  const [learnings, setLearning] = useState<learning[]>([]);
  const [mLearnings, setMLearnings] = useState<learning[]>([])
  const [code,setCode] = useState("")
  const [pcode,setpCode] = useState("")
  const [deleting, isDeleting] = useState<status>({"id":-1,"flag":false})
  const [s,setS] = useState<mentor>({"name":"","email":"","program":"","cgpa":0.0,"grade":""})
  const nav = useNavigate()
  const {toast} = useToast()



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
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchRequests = async () => {
      const formData = new FormData();
      formData.append('erp',localStorage.getItem('erp')||"0");
      try {
        const response = await axios.post('http://localhost:8080/learning/user', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });        
      setLearning(response.data);
      console.log(response.data)
      console.log(learnings)
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

const fetchRecords = async () => {
  const formData = new FormData();
  formData.append('erp',localStorage.getItem('erp')||"0");
  try {
    const response = await axios.post('http://localhost:8080/learning/records', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });        
  setMLearnings(response.data);
  console.log(response.data)
  console.log(learnings)
} catch (error) {
  console.error('Error fetching requests:', error);
}
};

    fetchCourses();
    fetchRequests();
    fetchRecords()
  }, []);

  const sortedCourses = [...courses].sort((a, b) =>
    a.courseTitle.localeCompare(b.courseTitle)
  );


  const courseList = sortedCourses.map(course => ({
    label: course.courseTitle,
    value: course.courseCode,
  })) || [];

  const requestList = [...learnings].map(learning => ({
    id: learning.id,
    course: learning.course_code,
    content: learning.content
  }))

  const recordList = [...mLearnings].map(learning => ({
    id: learning.id,
    erp: learning.erp,
    course: learning.course_code,
    content: learning.content
  }))

  const handleDelete = async (id: number) => {
    isDeleting({
      "id": id,"flag":true
    })
    const formData = new FormData();
      formData.append('id',id.toString());
      try {
        const response = await axios.post('http://localhost:8080/learning/delete', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }); 
      
      isDeleting({
        "id":-1,
        "flag":false
      })
      toast({title:response.data})
      nav(0)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        isDeleting({
          "id":-1,
          "flag":false
        })
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          if (axiosError.response.status === 400 && axiosError.response.data==="Learning Request Not Found"){
            toast({title:axiosError.response.data})
          }
    }
  }

  }
}


  const selectCourse = (course1ist: any[]) => {
    return(

    <>
      <SelectTrigger className="w-full flex-auto gap-5 bg-dark-4 placeholder:text-light-4 ">
        <SelectValue placeholder="All Courses" className="placeholder:text-light-4 "/>
      </SelectTrigger>
      <SelectContent className="w-full flex-auto bg-dark-4">
        <SelectItem value={"All"}>{"All Courses"}</SelectItem>
        {course1ist.map((index)=>(
          <SelectItem value={index.value}>{index.label}</SelectItem>
        ))}
      </SelectContent>
      </>
    )
  }

  const findInfo = async (erp:number, code:string) => {
    const formData = new FormData();
    formData.append('erp',erp.toString());
    formData.append('courseCode',code)
    try {
      const response = await axios.post('http://localhost:8080/mentor/info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });        
    setS(response.data);
    console.log(response.data)
    console.log(s)
  } catch (error) {
    console.error('Error fetching requests:', error);
  }
  };

  const Info = (erp:number,code:string) =>{
    findInfo(erp,code);
    return <div className="flex flex-1">
    <div className="common-container">
      <div className="max-w-5xl flex-start gap-3 justify-start w-full">
        <img
          src="/assets/icons/people.svg"
          width={36}
          height={36}
          alt="add"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Mentor Information</h2>
      </div>
      <div className="flex flex-col w-full  max-w-5xl">
          <Label htmlFor="name" className="shad_form-label pb-3 text-left">
            Name
          </Label>
          <Input
            id="name"
            defaultValue={s.name}
            className="shad-input col-span-3"
            disabled={true}
          />
          <div className="flex flex-row gap-3 py-3">
          <div className="flex flex-col gap-2">
          <Label  className="shad_form-label text-left">
            ERP
          </Label>
          <Input
            id="name"
            defaultValue={erp}
            className=" shad-input col-span-3"
            disabled={true}
          />
          </div>
              <div className="flex flex-col gap-2" >
          <Label  className="shad_form-label text-left">
            Program
          </Label>
          <Input
            id="name"
            defaultValue={s.program}
            className="shad-input col-span-3"
            disabled={true}
          />
          </div>
          </div>
          <div className="flex flex-row gap-3 py-3">
          <div className="flex flex-col gap-2">
          <Label  className="shad_form-label text-left">
            CGPA
          </Label>
          <Input
            id="name"
            defaultValue={s.cgpa}
            className=" shad-input col-span-3"
            disabled={true}
          />
          </div>
              <div className="flex flex-col gap-2" >
          <Label  className="shad_form-label text-left">
            Grade
          </Label>
          <Input
            id="name"
            defaultValue={s.grade}
            className="shad-input col-span-3"
            disabled={true}
          />
          </div>
          </div>
          <Label htmlFor="name" className="shad_form-label pb-3 text-left">
            Email
          </Label>
          <Input
            id="name"
            defaultValue={s.email}
            className="shad-input col-span-3"
            disabled={true}
          />
  </div>
    </div>
  </div>
  }

  const viewInfo = (erp:number, code: string) => {
    const I = Info(erp,code);
    return(
      <DialogContent className="w-full flex-auto bg-black">
        <ScrollArea className="h-full w-full justify-evenly items-center">
            {I}
        </ScrollArea>
      </DialogContent>
    )
  }



  const handelSubmit = (id:number,content:string,code:string,action:string) => {
    const update = UpdatePost(id,content,code,action)
    return(
      <DialogContent className="h-[90%] w-full flex-auto bg-black">
        <ScrollArea className="h-full w-full justify-evenly items-center">
        {update}
        </ScrollArea>
      </DialogContent>
    )
  }

  return (
    <div className="flex flex-auto">

      <div className="common-container">

        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/home.svg"
            width={45}
            height={45}
            alt="add"
          />
          <h2 className="flex-row h1-bold md:h2-bold text-left gap-0 ">Home </h2>
        </div >
        
        <div className="flex flex-auto w-full h-full gap-5 " >
        <Card className="w-full h-full" style={{backgroundColor:'#2E0854'}}>
          <CardHeader>
            <CardTitle style={{color:"white"}} >Posts</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-[95%]">
          <Select onValueChange={setCode}>
            {selectCourse(courseList)}
          </Select>
          <Separator className="my-3"/>
      <ScrollArea className="h-[72%] bg-dark-3 w-full justify-center rounded-md border items-center">
      <Table className="bg-dark-3">
      <TableHeader>
        <TableRow className="flex-col">
          <TableHead>Course Name</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody key={code}>
        {requestList.map((course) =>  {
            const cor =courseList.find(course2 => (course2.value === course.course))
            const courseTitle = cor ? cor.label : 'Unknown Title';
          return (
          <TableRow key={course.course}>
            {(code==="" || code==="All" || (code!=="" && course.course===code)) ? (<>
            <TableCell>{courseTitle}</TableCell>
            <TableCell className="text-right">
              <Dialog >
              <DialogTrigger asChild>
              <Button type="submit"
                    className="shad-button_primary whitespace-nowrap"
                    style={{backgroundColor:'#2E0854'}}
                    >Edit</Button>
              </DialogTrigger>
                {handelSubmit(course.id,course.content,course.course,"Update")}
              </Dialog>
            </TableCell>
            <TableCell><Button type="submit"
                    className="shad-button_primary whitespace-nowrap"
                    style={{backgroundColor:'red'}}
                    disabled={deleting.flag}
                    onClick={() => {handleDelete(course.id)}}
                    > {(deleting.flag && deleting.id===course.id) && <Loader />}
                      Delete</Button></TableCell></>
                      ):(<></>)}
            
          </TableRow>
        )})}
      </TableBody>
    </Table>

      </ScrollArea>
        </CardContent>
        </Card>

        <Card className="w-full h-full " style={{backgroundColor:'#2E0854'}}>

          <CardHeader>
            <CardTitle >Records</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-[95%]">

          <Select onValueChange={setpCode} >
            {selectCourse(courseList)}
          </Select>

          <Separator className="my-3"/>
      <ScrollArea className="h-[72%] bg-dark-3 w-full justify-center rounded-md border items-center">
      <Table className="bg-dark-3">
      <TableHeader>
        <TableRow className="flex-col">
          <TableHead>Course Name</TableHead>
          <TableHead></TableHead>
          <TableHead className="text-left">Information</TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody key={pcode}>
        {recordList.map((course) =>  {
            const cor = courseList.find(course2 => (course2.value === course.course))
            const courseTitle = cor ? cor.label : 'Unknown Title';
          return (
            <TableRow key={course.course}>
            {(pcode==="" || pcode==="All" || (pcode!=="" && course.course===pcode)) ? (<>
            <TableCell>{courseTitle}</TableCell>
            <TableCell className="text-right">
              <Dialog >
              <DialogTrigger asChild>
              <Button type="submit"
                    className="shad-button_primary whitespace-nowrap"
                    style={{backgroundColor:'#2E0854'}}
                    >View</Button>
              </DialogTrigger>
                {handelSubmit(course.id,course.content,course.course,"View")}
              </Dialog>
            </TableCell>
            <TableCell><Dialog >
              <DialogTrigger asChild>
              <Button type="submit"
                    className="shad-button_primary whitespace-nowrap bg-dark-4"
                    >More</Button>
              </DialogTrigger>
                {viewInfo(course.erp,course.course)}
              </Dialog></TableCell></>
                      ):(<></>)}
            
          </TableRow>
        )})}
      </TableBody>
    </Table>
    
      </ScrollArea>

            

        </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}

export default Home