import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { DisplayDiv } from "../components/DisplayDiv";
import type { Task } from "../supabase/dataTypes";
import {
  useDeleteListTask,
  useUpdateListTask,
} from "../services/listTaskService";
import { FormBox } from "../components/FormBox";
import { X } from "lucide-react";
import { useGetPMembers } from "../services/projectMembersService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useGetProjectLists } from "../services/projectListsService";

type TaskBoxProps = {
  task: Task;
};

export const TaskBox = ({ task }: TaskBoxProps) => {
  const { projectId } = useParams();
  const { mutate: deleteTask, isPending: deletePending } = useDeleteListTask(
    task.list_id
  );
  const { mutate: update, isPending: updatePending } = useUpdateListTask(
    task.id,
    task.list_id
  );
  const { data: assignees } = useQuery(useGetPMembers(projectId));
  const { data: lists } = useQuery(useGetProjectLists(projectId));
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [listId, setListId] = useState("");
  const [open, setOpen] = useState(false);
  const [activeDrop, setActiveDrop] = useState<null | string>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const updateTask = (e: SyntheticEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (
      !task ||
      (taskName === task.name &&
        taskDesc === task.description &&
        assignedTo === task.assigned_to &&
        listId === task.list_id)
    )
      return;

    const desc = taskDesc === "" ? null : taskDesc;
    const assignedto = assignedTo === "" ? null : assignedTo;

    update(
      { taskName, desc, assignedto, listId },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: () => {
          setOpen(true);
        },
      }
    );
  };

  const onClosed = () => {
    if (task) {
      setOpen(false);
      setTaskName(task.name);
      setTaskDesc(task.description ?? "");
      setAssignedTo(task.assigned_to ?? "");
      setListId(task.list_id);
    }
  };

  useEffect(() => {
    if (!task) return;
    const updateState = () => {
      setTaskName(task.name);
      setTaskDesc(task.description ?? "");
      setAssignedTo(task.assigned_to ?? "");
      setListId(task.list_id);
    };
    updateState();
  }, [task]);

  return (
    <div className="w-full flex flex-col gap-2 border p-2 rounded border-neutral-400 bg-neutral-200">
      <div className="flex justify-between items-center">
        <button className="bg-neutral-400 py-1 px-2 rounded font-semibold hover:cursor-pointer">
          {task.assigned_to ? task.assignedName : "Unasssigned"}
        </button>
        <div className="relative">
          <DisplayDiv
            display="List"
            id={task.id}
            name={task.name}
            isActiveDrop={activeDrop}
            isSetActiveDrop={setActiveDrop}
            toDelete={deleteTask}
            deletePending={deletePending}
            toUpdate={setOpen}
          />
          {open && (
            <div
              ref={formRef}
              className="absolute bg-white top-full right-0 mt-1 border p-2 rounded border-neutral-400 z-19 flex gap-2 items-center justify-between"
            >
              <FormBox
                formRef={formRef}
                onSubmit={updateTask}
                iOneType="text"
                iOneName="changetask"
                iOnePlace="Change Task Name"
                iOne={taskName}
                setIOne={setTaskName}
                iTwoType="text"
                iTwoName="changetaskdesc"
                iTwoPlace="Change Task Desc"
                iTwo={taskDesc}
                setITwo={setTaskDesc}
                onClose={onClosed}
                isPending={updatePending}
              >
                {
                  <div className="flex gap-2">
                    <div>
                      <label htmlFor="assignee">Assign</label>
                      <select
                        className="w-25 ps-1 ms-1 outline-0 bg-neutral-200 py-1 rounded truncate"
                        name="assignee"
                        id="assignee"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {assignees?.map((assignee) => (
                          <option id={assignee.id} value={assignee.id}>
                            {assignee.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="listId">List</label>
                      <select
                        className="w-25 ps-1 ms-1 outline-0 bg-neutral-200 py-1 rounded truncate"
                        name="listId"
                        id="listId"
                        value={listId}
                        onChange={(e) => setListId(e.target.value)}
                      >
                        {lists?.map((list) => (
                          <option key={list.id} value={list.id}>
                            {list.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                }
              </FormBox>
              <button
                onClick={onClosed}
                className="hover:cursor-pointer mbe-auto"
                type="button"
              >
                <X strokeWidth={1} size={25} />
              </button>
            </div>
          )}
        </div>
      </div>
      {task.description && (
        <div className="bg-neutral-200 py-1 px-2 border border-neutral-400 rounded whitespace-normal">
          {task.description}
        </div>
      )}
    </div>
  );
};
