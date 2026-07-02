import { useParams } from "react-router";
import { ProjectHeader } from "./ProjectHeader";
import { useQuery } from "@tanstack/react-query";
import { useGetProjectLists } from "../services/projectListsService";
import { TaskPanel } from "../panels/TaskPanel";

export const ProjectContainer = () => {
  const { projectId } = useParams();
  const { data: lists } = useQuery(useGetProjectLists(projectId));
  return (
    <>
      <ProjectHeader />
      <div className="flex-1 flex flex-wrap gap-4 min-h-0 overflow-y-auto">
        {lists?.map((list) => (
          <TaskPanel key={list.id} list={list} />
        ))}
      </div>
    </>
  );
};
