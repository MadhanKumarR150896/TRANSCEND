import { useState, type SyntheticEvent } from "react";
import { PanelLayout } from "../components/PanelLayout";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { DisplayDiv } from "../components/DisplayDiv";
import {
  useCreateProjectList,
  useDeleteProjectList,
  useGetProjectLists,
} from "../services/projectListsService";
import { FormBox } from "../components/FormBox";

export const ListPanel = () => {
  const { projectId } = useParams();
  const [listName, setListName] = useState("");
  const { data: projectLists, isLoading } = useQuery(
    useGetProjectLists(projectId)
  );
  const { mutate, isPending } = useCreateProjectList(projectId!);
  const { mutate: deleteList } = useDeleteProjectList(projectId!);
  const [create, setCreate] = useState(false);
  const [activeDrop, setActiveDrop] = useState<null | string>(null);

  const createList = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!listName.trim()) return;

    mutate(listName, {
      onSuccess: () => {
        setListName("");
      },
      onError: () => {
        setListName("");
      },
    });
  };

  return (
    <PanelLayout
      title="Lists"
      variant="Create List"
      isIsLoading={isLoading}
      loadingMessage="Project Lists are loading..."
      isCreate={create}
      isSetCreate={setCreate}
      isSetActivedrop={setActiveDrop}
      formElement={
        <FormBox
          onSubmit={createList}
          iOneType="text"
          iOnePLace="List Name"
          iOne={listName}
          setIOne={setListName}
          isPending={isPending}
        />
      }
    >
      {projectLists?.map((projectList) => (
        <DisplayDiv
          key={projectList.id}
          id={projectList.id}
          name={projectList.name}
          isActiveDrop={activeDrop}
          isSetActiveDrop={setActiveDrop}
          toDelete={deleteList}
        />
      ))}
    </PanelLayout>
  );
};
