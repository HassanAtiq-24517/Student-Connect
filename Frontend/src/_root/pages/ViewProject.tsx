import ProjectForm from "@/components/forms/Project";


const ViewProject = (id:number,name:string,course_code:string,size:number) => {

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/people.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Project Description</h2>
        </div>
        <div className="flex flex-col w-full  max-w-5xl">

        <ProjectForm id={id} course_code={course_code} name={name} size={size} action={"Update"}  />
    </div>
      </div>
    </div>
  );
};

export default ViewProject;