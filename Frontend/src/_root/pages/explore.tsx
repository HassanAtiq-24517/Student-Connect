import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import axios from "axios";
import UpdatePost from "./UpdatePost";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Explore = () => {

    const { toast } = useToast();
    const nav = useNavigate();

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

      type student = {
        name: string,
        email: string,
        program: string
    }

    type status = {
        id:number,
        flag:boolean
    }

        const [s,setS] = useState<student>({"name":"","email":"","program":""})

        const [mcourses, setMCourses] = useState<course[]>([])
        const [pcode,setpCode] = useState("")
        const [mLearnings, setMLearnings] = useState<learning[]>([])
        const [learnings, setLearning] = useState<learning[]>([]) 
        const [accepting,setAccepting] = useState<status>({
            "id":-1,"flag":false
        })

    useEffect(()=>{
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
            console.log(mcourses)
          } catch (error) {
            console.error('Error fetching courses:', error);
          }
        };
        const fetchRequests = async () => {
            const formData = new FormData();
            formData.append('erp',localStorage.getItem('erp')||"0");
            try {
              const response = await axios.post('http://localhost:8080/learning/search', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });        
            setMLearnings(response.data);
            console.log(response.data)
            console.log(mLearnings)
          } catch (error) {
            console.error('Error fetching requests:', error);
          }
          };

          const fetchRecords = async () => {
            const formData = new FormData();
            formData.append('erp',localStorage.getItem('erp')||"0");
            try {
              const response = await axios.post('http://localhost:8080/learning/mentor', formData, {
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
        
        fetchRequests();
        fetchRecords();
        fetchMentorCourses();

    },[])

    const sortedMCourses = [...mcourses].sort((a, b) =>
    a.courseTitle.localeCompare(b.courseTitle)
  );

  const mCourseList = sortedMCourses.map(course => ({
    label: course.courseTitle,
    value: course.courseCode,
  })) || [];

  const requestList = [...mLearnings].map(learning => ({
    id: learning.id,
    erp: learning.erp,
    course: learning.course_code,
    content: learning.content
  }))

  const recordList = [...learnings].map(learning => ({
    id: learning.id,
    erp: learning.erp,
    course: learning.course_code,
    content: learning.content
  }))




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

      const findInfo = async (erp:number) => {
        const formData = new FormData();
        formData.append('erp',erp.toString());
        try {
          const response = await axios.post('http://localhost:8080/student/info', formData, {
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

      const Info = (erp:number) =>{
        findInfo(erp);
        return <div className="flex flex-1">
        <div className="common-container">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img
              src="/assets/icons/people.svg"
              width={36}
              height={36}
              alt="add"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">Student Information</h2>
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

      const viewInfo = (erp:number) => {
        const I = Info(erp);
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

      const handleAccept = async (id:number,action:string) => {
        setAccepting({"id":id,"flag":true})
        const formData = new FormData();
      formData.append('id',id.toString());
        var url:string
        if(action==="Complete"){
            url = 'learning/delete'
        }else{
            url = 'mentor/accept'
            formData.append('erp',localStorage.getItem('erp')||"0")
        }
      try {
        const response = await axios.post('http://localhost:8080/'+url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }); 
      
      setAccepting({
        "id":-1,
        "flag":false
      })
      toast({title:response.data})
      nav(0)
    } catch (error) {
        setAccepting({
          "id":-1,
          "flag":false
        })
        }
      };


  return (
    <div className="flex flex-auto">

      <div className="common-container">

        <Tabs defaultValue="learning" className="w-full h-full flex-col">
        <div className="max-w-5xl flex-start gap-3 py-2 justify-start w-full">
          <img
            src="/assets/icons/wallpaper.svg"
            width={45}
            height={45}
            alt="add"
          />
          <h1 className="flex-row h1-bold md:h2-bold text-left gap-0 ">Explore </h1>
      <TabsList className="flex h-full w-full grid-cols-2 bg-dark-3" style={{flexDirection:"row"}}>
        <TabsTrigger value="learning" className= "shad-button_primary whitespace-nowrap flex-auto h3-bold aria-selected:bg-violet-800">Requests</TabsTrigger>
        <>|</>
        <TabsTrigger value="project" className="shad-button_primary whitespace-nowrap flex-auto h3-bold aria-selected:bg-violet-800">Records</TabsTrigger>
      </TabsList>
      </div >
      <TabsContent value="learning" className=" flex-col h-full w-full  max-w-5xl">


        <Card className="w-full h-full bg-dark-1">

          <CardHeader>
            <CardTitle >Learning Requests</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-full ">

          <Select onValueChange={setpCode} >
            {selectCourse(mCourseList)}
          </Select>

          <Separator className="my-3"/>
      <ScrollArea className="h-[72%] bg-dark-3 w-full justify-center rounded-md border items-center">
      <Table className="bg-dark-3 h-full">
      <TableHeader>
        <TableRow className="flex-col">
          <TableHead className="text-center">Course Code</TableHead>
          <TableHead>Course Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Information</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody key={pcode}>
        {requestList.map((course) =>  {
            const cor = mCourseList.find(course2 => (course2.value === course.course))
            const courseTitle = cor ? cor.label : 'Unknown Title';
          return (
            <TableRow key={course.course}>
            {(pcode==="" || pcode==="All" || (pcode!=="" && course.course===pcode)) ? (<>
            <TableCell className="text-center">{course.course}</TableCell>
            <TableCell className=" text-base ">{courseTitle}</TableCell>
            <TableCell className="text-center">
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
            <TableCell className="text-center">
              <Dialog >
              <DialogTrigger asChild>
              <Button type="submit"
                    className="shad-button_primary whitespace-nowrap bg-dark-4"
                    >More</Button>
              </DialogTrigger>
                {viewInfo(course.erp)}
              </Dialog>
            </TableCell>
            <TableCell><Button type="submit"
                    className="shad-button_primary whitespace-nowrap bg-emerald-950"
                    disabled={accepting.flag}
                    onClick={() => {handleAccept(course.id,"Accept")}}
                    > {(accepting.flag && course.id===accepting.id) && <Loader />}
                    Accept</Button></TableCell></>
                      ):(<></>)}
            
          </TableRow>
        )})}
      </TableBody>
    </Table>
    
      </ScrollArea>

            

        </CardContent>
        </Card></TabsContent>
        <TabsContent value="project" className="flex flex-col gap-0 w-full h-full  max-w-5xl" style={{top:2}}>

        <Card className="w-full h-full bg-dark-1">

          <CardHeader>
            <CardTitle >Mentor Records</CardTitle>
          </CardHeader>
          <CardContent className="w-full h-full ">

          <Select onValueChange={setpCode} >
            {selectCourse(mCourseList)}
          </Select>

          <Separator className="my-3"/>
      <ScrollArea className="h-[72%] bg-dark-3 w-full justify-center rounded-md border items-center">
      <Table className="bg-dark-3 h-full">
      <TableHeader>
        <TableRow className="flex-col">
          <TableHead className="text-center">Course Code</TableHead>
          <TableHead>Course Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Information</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody key={pcode}>
        {recordList.map((course) =>  {
            const cor = mCourseList.find(course2 => (course2.value === course.course))
            const courseTitle = cor ? cor.label : 'Unknown Title';
          return (
            <TableRow key={course.course}>
            {(pcode==="" || pcode==="All" || (pcode!=="" && course.course===pcode)) ? (<>
            <TableCell className="text-center">{course.course}</TableCell>
            <TableCell className=" text-base ">{courseTitle}</TableCell>
            <TableCell className="text-center">
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
            <TableCell className="text-center">
              <Dialog >
              <DialogTrigger asChild>
              <Button type="submit"
                    className="shad-button_primary whitespace-nowrap bg-dark-4"
                    >More</Button>
              </DialogTrigger>
                {viewInfo(course.erp)}
              </Dialog>
            </TableCell>
            <TableCell><Button type="submit"
                    className="shad-button_primary whitespace-nowrap bg-emerald-950"
                    disabled={accepting.flag}
                    onClick={() => {handleAccept(course.id,"Complete")}}
                    > {(accepting.flag && course.id===accepting.id) && <Loader />}
                   Complete</Button></TableCell></>
                      ):(<></>)}
          </TableRow>
        )})}
      </TableBody>
    </Table>
    
      </ScrollArea>

            

        </CardContent>
        </Card>




        </TabsContent>
    </Tabs>




        </div>
        </div>
  )
}

export default Explore