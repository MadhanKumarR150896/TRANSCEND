import { useRef, useState, type SyntheticEvent } from "react";
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
  const { mutate: deleteList, isPending: deletePending } = useDeleteProjectList(
    projectId!
  );
  const [create, setCreate] = useState(false);
  const [activeDrop, setActiveDrop] = useState<null | string>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createList = (e: SyntheticEvent<HTMLFormElement, Event>) => {
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
      buttonRef={buttonRef}
      loadingMessage="Project Lists are loading..."
      isCreate={create}
      isSetCreate={setCreate}
      isSetActivedrop={setActiveDrop}
      formElement={
        <div className="flex-1" ref={formRef}>
          <FormBox
            formRef={formRef}
            buttonRef={buttonRef}
            onSubmit={createList}
            iOneType="text"
            iOneName="listname"
            iOnePlace="List Name"
            iOne={listName}
            setIOne={setListName}
            isPending={isPending}
            onClose={() => {
              setCreate(false);
              setListName("");
            }}
          />
        </div>
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
          deletePending={deletePending}
        />
      ))}
    </PanelLayout>
  );
};
