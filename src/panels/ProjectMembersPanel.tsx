import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import { PanelLayout } from "../components/PanelLayout";
import { useQuery } from "@tanstack/react-query";
import {
  useAddProjectMember,
  useDeleteProjectMember,
  useGetAllMembers,
  useGetProjectMembers,
} from "../services/projectMembersService";
import { useParams } from "react-router";
import { DisplayDiv } from "../components/DisplayDiv";
import { FormBox } from "../components/FormBox";
import { useDebounced } from "../utils/useDebounced";
import { createPortal } from "react-dom";

export const ProjectMembersPanel = () => {
  const { projectId } = useParams();
  const [newMember, setNewMember] = useState("");
  const [newMemberId, setNewMemberId] = useState("");
  const debouncedValue = useDebounced(newMember, 500);
  const { data: allMembers } = useQuery(useGetAllMembers(debouncedValue));
  const { data: projectMembers, isLoading } = useQuery(
    useGetProjectMembers(projectId)
  );
  const { mutate, isPending } = useAddProjectMember(projectId!);
  const { mutate: deletemembership } = useDeleteProjectMember(projectId!);
  const [create, setCreate] = useState(false);
  const [activeDrop, setActiveDrop] = useState<null | string>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const parentRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const clearState = () => {
    setNewMember("");
    setNewMemberId("");
  };

  const addMember = (e: SyntheticEvent<HTMLFormElement>) => {
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

  const updatePosition = useCallback(() => {
    if (!parentRef.current) return;
    const rect = parentRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 5,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useLayoutEffect(() => {
    updatePosition();
  }, [allMembers, updatePosition]);

  useEffect(() => {
    if (!newMember || newMemberId) return;

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [newMember, newMemberId, updatePosition]);

  useEffect(() => {
    const handleDrop = (e: MouseEvent) => {
      if (
        dropRef.current?.contains(e.target as Node) ||
        parentRef.current?.contains(e.target as Node)
      )
        return;

      setNewMemberId("a");
    };
    if (newMember && !newMemberId) {
      document.addEventListener("mousedown", handleDrop);
    }
    return () => document.removeEventListener("mousedown", handleDrop);
  }, [newMember, newMemberId]);

  return (
    <PanelLayout
      title="Project Members"
      variant="Add Member"
      isIsLoading={isLoading}
      loadingMessage="Project Members are loading..."
      isCreate={create}
      isSetCreate={setCreate}
      isSetActivedrop={setActiveDrop}
      formElement={
        <div ref={parentRef}>
          <FormBox
            onSubmit={addMember}
            iOneType="text"
            iOnePLace="Member Name"
            iOne={newMember}
            setIOne={setNewMember}
            extraOne={setNewMemberId}
            isPending={isPending}
          />
          {newMember &&
            !newMemberId &&
            Boolean(allMembers?.length) &&
            createPortal(
              <div
                ref={dropRef}
                className="fixed z-10 p-1.5 bg-white flex flex-col gap-1.5 rounded-md border border-neutral-400 text-xs md:text-sm"
                style={{
                  top: pos.top,
                  left: pos.left,
                  width: pos.width,
                }}
              >
                {allMembers?.map((member) => (
                  <div
                    onClick={() => {
                      setNewMember(member.name);
                      setNewMemberId(member.id);
                    }}
                    className="ps-2 py-0.5 pe-4 hover:cursor-pointer rounded-sm bg-neutral-500 text-white"
                    key={member.id}
                  >
                    {member.name}
                  </div>
                ))}
              </div>,
              document.body
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
        />
      ))}
    </PanelLayout>
  );
};
