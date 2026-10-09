import PostForm from "@/components/forms/PostForm";
import ProjectForm from "@/components/forms/Project";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex flex-col w-full  max-w-5xl">
        <div className="max-w-5xl flex-start gap-3 py-3 justify-start w-full">
          <img
            src="/assets/icons/gallery-add.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>

    <Tabs defaultValue="learning" className="w-full flex-center flex-col">
      <div className="py-2 w-full flex-center flex-col ">
      <TabsList className="flex w-full grid-cols-2 bg-dark-3" style={{flexDirection:"row"}}>
        <TabsTrigger value="learning" className= "shad-button_primary h-full w-full whitespace-nowrap flex-auto body-medium aria-selected:bg-violet-800 ">Learning</TabsTrigger>
        <TabsTrigger value="project" className="shad-button_primary h-full w-full whitespace-nowrap flex-auto body-medium aria-selected:bg-violet-800">Project</TabsTrigger>
      </TabsList>
      </div>
      <TabsContent value="learning" className=" flex-col w-full  max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle >Learning</CardTitle>
          </CardHeader>
          <CardContent>

        <PostForm action="Create" course_code={null} content={null} id={null} />

        </CardContent>
        </Card></TabsContent>

      <TabsContent value="project" className="flex flex-col gap-0 w-full  max-w-5xl" style={{top:2}}>
        <Card>
          <CardHeader>
            <CardTitle>Project</CardTitle>
          </CardHeader>
          <CardContent>

         <ProjectForm id={null} course_code={null} name={null} size={null} action={"Create"} />
            
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
      </div>
    </div>
  );
};

export default CreatePost;