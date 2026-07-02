import { useQuery } from "@tanstack/react-query";
import type { ProjectList } from "../supabase/dataTypes";
import {
  useCreateListTask,
  useGetListTasks,
} from "../services/listTaskService";
import { PanelLayout } from "../components/PanelLayout";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { DisplayDiv } from "../components/DisplayDiv";
import { X } from "lucide-react";
import { FormBox } from "../components/FormBox";
import { useParams } from "react-router";
import {
  useDeleteProjectList,
  useUpdateProjectList,
} from "../services/projectListsService";

export const TaskPanel = ({ list }: { list: ProjectList }) => {
  const { projectId } = useParams();
  const { data: tasks, isLoading } = useQuery(useGetListTasks(list.id));
  const { mutate: deleteList, isPending: deletePending } = useDeleteProjectList(
    projectId!
  );
  const { mutate: update, isPending: updatePending } = useUpdateProjectList(
    list.id,
    projectId!
  );
  const { mutate, isPending } = useCreateListTask(list.id);
  const [create, setCreate] = useState(false);
  const [open, setOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [activeDrop, setActiveDrop] = useState<null | string>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [assignedTo, setAssignedTo] = useState<string | null>(null);

  const updateList = (e: SyntheticEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!list || listName === list.name) return;
    update(listName, {
      onSuccess: () => {
        setOpen(false);
      },
      onError: () => {
        setOpen(true);
      },
    });
  };

  const createTask = (e: SyntheticEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!taskName.trim() || !taskDesc.trim()) return;

    mutate(
      { taskName, taskDesc, assignedTo },
      {
        onSuccess: () => {
          setTaskName("");
          setTaskDesc("");
          setAssignedTo(null);
        },
        onError: () => {
          setTaskName("");
          setTaskDesc("");
          setAssignedTo(null);
        },
      }
    );
  };

  const onClose = () => {
    if (list) {
      setOpen(false);
      setListName(list.name);
    }
  };

  useEffect(() => {
    if (!list) return;
    const updateState = () => {
      setListName(list.name);
    };
    updateState();
  }, [list]);

  return (
    <PanelLayout
      listName={list?.name}
      variant="Create Tasks"
      isIsLoading={isLoading}
      loadingMessage="Tasks are loading.."
      isCreate={create}
      isSetCreate={setCreate}
      buttonRef={buttonRef}
      isSetActivedrop={setActiveDrop}
      formElement={
        <div className="flex-1" ref={formRef}>
          <FormBox
            formRef={formRef}
            buttonRef={buttonRef}
            onSubmit={createTask}
            iOneType="text"
            iOneName="task"
            iOnePlace="Task Name"
            iOne={taskName}
            setIOne={setTaskName}
            iTwoType="text"
            iTwoName="tdesc"
            iTwoPlace="Description"
            iTwo={taskDesc}
            setITwo={setTaskDesc}
            isPending={isPending}
            onClose={() => {
              setCreate(false);
              setTaskName("");
              setTaskDesc("");
            }}
          />
        </div>
      }
      displayElement={
        <div className="relative">
          <DisplayDiv
            display="List"
            id={list.id}
            name={list.name}
            isActiveDrop={activeDrop}
            isSetActiveDrop={setActiveDrop}
            toDelete={deleteList}
            deletePending={deletePending}
            toUpdate={setOpen}
          />
          {open && (
            <div
              ref={formRef}
              className="absolute bg-white top-full right-0 mt-1 border p-2 rounded border-neutral-300 z-10 flex gap-2 items-center justify-between"
            >
              <FormBox
                formRef={formRef}
                onSubmit={updateList}
                iOneType="text"
                iOneName="changelist"
                iOnePlace="Change List Name"
                iOne={listName}
                setIOne={setListName}
                onClose={onClose}
                isPending={updatePending}
              />
              <button
                onClick={onClose}
                className="hover:cursor-pointer mbe-auto"
                type="button"
              >
                <X strokeWidth={1} size={25} />
              </button>
            </div>
          )}
        </div>
      }
    >
      {tasks?.map((task) => (
        <div key={task.id}>{task.name}</div>
      ))}
    </PanelLayout>
  );
};
