import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Loader from "@/components/ui/loader"
import { useEffect, useState } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import ViewProject from "./ViewProject"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"

const ProjectGroups = () => {

  const {toast} = useToast();
  const nav = useNavigate();
 

  type course = {
    courseCode: string;
    courseTitle: string;
  }

  type group = {
    id: number,
    name: string,
    size: string,
    course_code: string
  }

  type student = {
    name: string,
    email: string,
    program: string
}

type status = {
  id:number,
  flag:boolean
}

  const [pcode,setpCode] = useState("")
  const [courses, setCourses] = useState<course[]>([]);
  const [groups,setGroups] = useState<group[]>([])
  const [sgroups,setSGroups] = useState<group[]>([])
  const [s,setS] = useState<student[]>([])
  const [leaving,setLeaving] = useState<status>({
    "id":-1,"flag":false
})


  useEffect(()=>{
        const fetchCourses = async () => {
          const formData = new FormData();
          formData.append('erp',localStorage.getItem('erp')||"0");
          try {
            const response = await axios.post('/courses/enrolled', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });        
          setCourses(response.data);
          console.log(courses)
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }

      const fetchGroups = async () =>{
        const formData = new FormData();
          formData.append('erp',localStorage.getItem('erp')||"0");
          try {
            const response = await axios.post('/project/user', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });        
          setGroups(response.data);
          console.log(groups)
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }

      const fetchSearchGroups = async () =>{
        const formData = new FormData();
          formData.append('erp',localStorage.getItem('erp')||"0");
          try {
            const response = await axios.post('/project/search', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });        
          setSGroups(response.data);
          console.log(sgroups)
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }



      fetchSearchGroups();
      fetchGroups();
      fetchCourses();
  },[])

  const sortedCourses = [...courses].sort((a, b) =>
    a.courseTitle.localeCompare(b.courseTitle)
  );


  const mCourseList = sortedCourses.map(course => ({
    label: course.courseTitle,
    value: course.courseCode,
  })) || [];

  


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

  const handleSubmit = (id:number,name:string,course:string,size:number) => {
    const update = ViewProject(id,name,course,size)
    return(
      <DialogContent className="h-[90%] w-full flex-auto bg-black">
        <ScrollArea className="h-full w-full justify-evenly items-center">
        {update}
        </ScrollArea>
      </DialogContent>
    )
  }

  const handleLeave = async (id:number,action:string) => {
    setLeaving({"id":id,"flag":true})
    const formData = new FormData();
  formData.append('id',id.toString());
  formData.append('erp',localStorage.getItem('erp')||"0")
    var url:string
    if(action==="Leaving"){
        url = 'delete/student/group'
    }else{
        url = 'join/student/group'
    }
  try {
    const response = await axios.post('/'+url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }); 
  
  setLeaving({
    "id":-1,
    "flag":false
  })
  toast({title:response.data})
  nav(0)
} catch (error) {
    setLeaving({
      "id":-1,
      "flag":false
    })
    }
  };

  const findInfo = async (id:number) =>{
    const formData = new FormData();
        formData.append('id',id.toString());
        try {
          const response = await axios.post('/project/students', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });        
        setS(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
  }

  const Info = (id:number) =>{
    findInfo(id);
    return(
      <div className="common-container">
      <div className="max-w-5xl flex-start gap-3 justify-start w-full">
        <img
          src="/assets/icons/people.svg"
          width={36}
          height={36}
          alt="add"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Member Information</h2>
      </div>
      <div className="flex flex-col w-full  max-w-5xl">
        {s.map((student) => {
          return(
            <Input
                id="name"
                defaultValue={student.name}
                className="shad-input col-span-3 py-2"
                disabled={true}
              />
          )
        })}
      </div>
      </div>
    )}

  const viewInfo = (id:number) => {
    const I = Info(id);
    return(
      <DialogContent className="w-full flex-auto bg-black">
        <ScrollArea className="h-full w-full justify-evenly items-center">
            {I}
        </ScrollArea>
      </DialogContent>
    )
  }



  return (
    <div className="flex flex-auto">

    <div className="common-container">
    <div className="flex flex-col w-full h-full  max-w-5xl">
    <div className="max-w-5xl flex-start gap-3 py-2 justify-start w-full">
          <img
            src="/assets/icons/people.svg"
            width={45}
            height={45}
            alt="add"
          />
          <h1 className="flex-row h1-bold md:h2-bold text-left gap-0 ">Project Groups </h1>
          </div >

    {<></>}
    <Tabs defaultValue="learning" className="w-full h-full flex-col">
    <div className="py-2 w-full flex-center flex-col  ">
      <TabsList className="flex h-full w-full grid-cols-2 bg-dark-3 " style={{flexDirection:"row"}}>
        <TabsTrigger value="learning" className='shad-button_primary whitespace-nowrap flex-auto body-medium aria-selected:bg-violet-800'>My Groups</TabsTrigger>
        <>|</>
        <TabsTrigger value="project" className="shad-button_primary whitespace-nowrap flex-auto body-medium aria-selected:bg-violet-800 ">Group Search</TabsTrigger>
      </TabsList>
      </div>
      <TabsContent value="learning" className=" flex-col h-full w-full  max-w-5xl">


        <Card className=" flex-col w-full h-full bg-dark-1">
          <CardHeader className="flex-row gap-3">
            <Select onValueChange={setpCode} >
            {selectCourse(mCourseList)} 
          </Select>
          </CardHeader>
          <CardContent className="w-full h-full flex-auto">
      <ScrollArea className="h-[77%] bg-dark-3 w-full justify-center rounded-md border items-center">
      <Table className="bg-dark-3 h-full">
      <TableHeader>
        <TableRow className="flex-col">
          <TableHead className="text-center">Group Name</TableHead>
          <TableHead>Course Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Information</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody key={pcode}>

      {groups.map((group) =>  {
            const cor = mCourseList.find(course2 => (course2.value === group.course_code))
            const courseTitle = cor ? cor.label : 'Unknown Title';
          return (
            <TableRow key={group.course_code}>
            {(pcode==="" || pcode==="All" || (pcode!=="" && group.course_code===pcode)) ? (<>
            <TableCell className="text-base text-center">{group.name}</TableCell>
            <TableCell className="text-base">{courseTitle}</TableCell>
            <TableCell className="text-center">
              <Dialog >
              <DialogTrigger asChild>
              <Button type="submit"
                    className="shad-button_primary whitespace-nowrap"
                    style={{backgroundColor:'#2E0854'}}
                    >View</Button>
              </DialogTrigger>
              {handleSubmit(group.id,group.name,group.course_code,parseInt(group.size))}
              </Dialog>
            </TableCell>
            <TableCell className="text-center">
              <Dialog >
              <DialogTrigger asChild>
              <Button type="submit"
                    className="shad-button_primary whitespace-nowrap bg-dark-4"
                    >More</Button>
              </DialogTrigger>
              {viewInfo(group.id)}
              </Dialog>
            </TableCell>
            <TableCell><Button type="submit"
                    className="shad-button_primary whitespace-nowrap" style={{backgroundColor:"red"}}
                    disabled={leaving.flag}
                    onClick={() => {handleLeave(group.id,"Leaving")}}
            >{(leaving.flag && group.id===leaving.id) && <Loader />}
                    Leave</Button></TableCell></>
                      ):(<></>)}
            
          </TableRow>
        )})}





      </TableBody>
    </Table>
      </ScrollArea>
            
        </CardContent>
        <CardFooter></CardFooter>
        </Card></TabsContent>
        <TabsContent value="project" className="flex flex-col gap-0 w-full h-full  max-w-5xl" style={{top:2}}>

        <Card className=" flex-col w-full h-full bg-dark-1">
          <CardHeader className="flex-row gap-3"> 
          
            <Select onValueChange={setpCode} >
            {selectCourse(mCourseList)} 
          </Select>
          </CardHeader>
          <CardContent className="w-full h-full flex-auto">
      <ScrollArea className="h-[77%] bg-dark-3 w-full justify-center rounded-md border items-center">
      <Table className="bg-dark-3 h-full">
      <TableHeader>
        <TableRow className="flex-col">
          <TableHead className="text-center">Group Name</TableHead>
          <TableHead>Course Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Information</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody key={pcode}>

      {sgroups.map((group) =>  {
            const cor = mCourseList.find(course2 => (course2.value === group.course_code))
            const courseTitle = cor ? cor.label : 'Unknown Title';
          return (
            <TableRow key={group.course_code}>
            {(pcode==="" || pcode==="All" || (pcode!=="" && group.course_code===pcode)) ? (<>
            <TableCell className="text-base text-center">{group.name}</TableCell>
            <TableCell className="text-base">{courseTitle}</TableCell>
            <TableCell className="text-center">
              <Dialog >
              <DialogTrigger asChild>
              <Button type="submit"
                    className="shad-button_primary whitespace-nowrap"
                    style={{backgroundColor:'#2E0854'}}
                    >View</Button>
              </DialogTrigger>
              {handleSubmit(group.id,group.name,group.course_code,parseInt(group.size))}
              </Dialog>
            </TableCell>
            <TableCell className="text-center">
              <Dialog >
              <DialogTrigger asChild>
              <Button type="submit"
                    className="shad-button_primary whitespace-nowrap bg-dark-4"
                    >More</Button>
              </DialogTrigger>
              {viewInfo(group.id)}
              </Dialog>
            </TableCell>
            <TableCell><Button type="submit"
                    className="shad-button_primary whitespace-nowrap bg-emerald-950"
                    disabled={leaving.flag}
                    onClick={() => {handleLeave(group.id,"Joining")}}
            >{(leaving.flag && group.id===leaving.id) && <Loader />}
                    Join</Button></TableCell></>
                      ):(<></>)}
            
          </TableRow>
        )})}





      </TableBody>
    </Table>
      </ScrollArea>
            
        </CardContent>
        <CardFooter></CardFooter>
        </Card>
        </TabsContent>
        
    </Tabs>


    </div>
        </div>
        </div>
  )
}

export default ProjectGroups