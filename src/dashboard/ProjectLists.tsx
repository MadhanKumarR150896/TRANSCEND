import { useParams } from "react-router";
import { useGetProjectLists } from "../services/projectListsService";
import { useQuery } from "@tanstack/react-query";
import { TaskPanel } from "../panels/TaskPanel";

export const ProjectLists = () => {
  const { projectId } = useParams();
  const { data: lists } = useQuery(useGetProjectLists(projectId));

  return (
    <div className="flex-1 flex gap-4 flex-wrap min-h-0 overflow-y-auto">
      {lists?.map((list) => (
        <TaskPanel key={list.id} list={list} />
      ))}
    </div>
  );
};
