import { useRef, useState, type SyntheticEvent } from "react";
import { PanelLayout } from "../components/PanelLayout";
import { useQuery } from "@tanstack/react-query";
import {
  useAddProjectMember,
  useDeleteProjectMember,
  useGetAvailableMembers,
  useGetProjectMembers,
} from "../services/projectMembersService";
import { useParams } from "react-router";
import { DisplayDiv } from "../components/DisplayDiv";
import { FormBox } from "../components/FormBox";
import { useDebounced } from "../utils/useDebounced";
import { DynamicDrop } from "../components/DynamicDrop";

export const ProjectMembersPanel = () => {
  const { projectId } = useParams();
  const [newMember, setNewMember] = useState("");
  const [newMemberId, setNewMemberId] = useState("");
  const debouncedValue = useDebounced(newMember, 500);
  const { data: availableMembers } = useQuery(
    useGetAvailableMembers(debouncedValue, projectId)
  );
  const { data: projectMembers, isLoading } = useQuery(
    useGetProjectMembers(projectId)
  );
  const { mutate, isPending } = useAddProjectMember(projectId!);
  const { mutate: deletemembership, isPending: deletePending } =
    useDeleteProjectMember(projectId!);
  const [create, setCreate] = useState(false);
  const [activeDrop, setActiveDrop] = useState<null | string>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const clearState = () => {
    setNewMember("");
    setNewMemberId("");
  };

  const addMember = (e: SyntheticEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!newMemberId) return;

    mutate(newMemberId, {
      onSuccess: () => {
        clearState();
      },
      onError: () => {
        clearState();
      },
    });
  };

  return (
    <PanelLayout
      title="Project Members"
      variant="Add Member"
      isIsLoading={isLoading}
      buttonRef={buttonRef}
      loadingMessage="Project Members are loading..."
      isCreate={create}
      isSetCreate={setCreate}
      isSetActivedrop={setActiveDrop}
      formElement={
        <div className="relative flex-1" ref={parentRef}>
          <FormBox
            formRef={parentRef}
            buttonRef={buttonRef}
            dropRef={dropRef}
            onSubmit={addMember}
            iOneType="text"
            iOneName="membership"
            iOnePlace="Member Name"
            iOne={newMember}
            setIOne={setNewMember}
            extraOne={setNewMemberId}
            isPending={isPending}
            onClose={() => {
              setCreate(false);
              setNewMember("");
              setNewMemberId("");
            }}
          />
          {newMember && !newMemberId && Boolean(availableMembers?.length) && (
            <DynamicDrop
              parentRef={parentRef}
              dropRef={dropRef}
              setInputValue={setNewMember}
              setInsertValue={setNewMemberId}
              results={availableMembers}
            />
          )}
        </div>
      }
    >
      {projectMembers?.map((projectMember) => (
        <DisplayDiv
          key={projectMember.membershipId}
          id={projectMember.membershipId}
          name={projectMember.memberName}
          isActiveDrop={activeDrop}
          isSetActiveDrop={setActiveDrop}
          toDelete={deletemembership}
          deletePending={deletePending}
        />
      ))}
    </PanelLayout>
  );
};
