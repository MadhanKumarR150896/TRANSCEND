import { useParams } from "react-router";
import { MemberPanel } from "../panels/MemberPanel";
import { ProjectPanel } from "../panels/ProjectPanel";
import { ListPanel } from "../panels/ListPanel";
import { TaskPanel } from "../panels/TaskPanel";

export const SidePanel = () => {
  const { projectId } = useParams();
  return (
    <>
      {projectId ? (
        <>
          <ListPanel />
          <TaskPanel />
        </>
      ) : (
        <>
          <ProjectPanel />
          <MemberPanel />
        </>
      )}
    </>
  );
};
