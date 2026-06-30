import { useParams } from "react-router";
import { ProjectContainer } from "./ProjectContainer";
import { SidePanel } from "./SidePanel";

export const Dashboard = () => {
  const { projectId } = useParams();

  return (
    <div className="flex-1 min-h-150 flex flex-col lg:flex-row gap-2 text-xs md:text-sm">
      <div className="w-full flex-2 md:flex-1 lg:flex-none lg:w-[clamp(400px,30vw,450px)] flex flex-col md:flex-row lg:flex-col gap-2 min-h-0">
        <SidePanel />
      </div>
      <div className="flex-1 border rounded bg-white border-neutral-300">
        {projectId ? (
          <ProjectContainer />
        ) : (
          <div className="h-full flex items-center justify-center text-sm md:text-base">
            <p>
              Please select a <b>Project</b> from the <b>Project's</b> panel!!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
