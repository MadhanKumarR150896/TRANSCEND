import { useParams } from "react-router";
import { MemberPanel } from "../panels/MemberPanel";
import { ProjectPanel } from "../panels/ProjectPanel";
import { ListPanel } from "../panels/ListPanel";
import { ProjectMembersPanel } from "../panels/ProjectMembersPanel";

export const SidePanel = () => {
  const { projectId } = useParams();
  return (
    <>
      {projectId ? (
        <>
          <ProjectMembersPanel />
          <ListPanel />
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
