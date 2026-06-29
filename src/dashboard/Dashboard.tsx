import { useParams } from "react-router";
import { ProjectContainer } from "./ProjectContainer";
import { SidePanel } from "./SidePanel";

export const Dashboard = () => {
  const { projectId } = useParams();

  return (
    <div className="flex-1 min-h-150 flex flex-col lg:flex-row gap-2">
      <div className="w-full flex-2 md:flex-1 lg:flex-none lg:w-[clamp(350px,30vw,450px)] flex flex-col md:flex-row lg:flex-col gap-2 min-h-0 text-sm md:text-base">
        <SidePanel />
      </div>
      <div className="flex-1 border rounded bg-white border-neutral-300">
        {projectId ? (
          <ProjectContainer />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className=" text-base md:text-xl">
              Please select a <b>Project</b> from the side panel!!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
