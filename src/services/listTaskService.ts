import type { ListId, ProjectList, Task } from "../supabase/dataTypes";
import { supabase } from "../supabase/supabaseClient";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const fetchListTasks = async (listId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from("tasks")
    .select(`id,name,description,assigned_to`)
    .eq("list_id", listId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch Lists");

  return data;
};

export const useGetListTasks = (listId: string | undefined) => {
  if (!listId) throw new Error("Invalid Project ID");
  return queryOptions({
    queryKey: ["List Tasks", listId],
    queryFn: () => fetchListTasks(listId),
    enabled: !!listId,
  });
};

type TaskA = {
  taskName: string;
  taskDesc: string;
  assignedTo: string | null;
  listId: string;
};

const createListTask = async ({ taskName, taskDesc, listId }: TaskA) => {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ name: taskName, description: taskDesc, list_id: listId })
    .select("id,name,description,assigned_to")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to create new project");

  return data;
};

export const useCreateListTask = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskName,
      taskDesc,
      assignedTo,
    }: {
      taskName: string;
      taskDesc: string;
      assignedTo: string | null;
    }) => createListTask({ taskName, taskDesc, assignedTo, listId }),

    onSuccess: (createdTask) => {
      queryClient.setQueryData<Task[]>(["List Tasks", listId], (oldTasks) =>
        oldTasks ? [createdTask, ...oldTasks] : oldTasks
      );
    },
  });
};

const deleteListTask = async (taskId: string): Promise<ListId> => {
  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .select("id")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to delete Task");

  return data;
};

export const useDeleteListTask = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteListTask,
    onSuccess: (deletedTask) => {
      queryClient.setQueryData<ProjectList[]>(
        ["List Tasks", listId],
        (oldTasks) => oldTasks?.filter((task) => task.id !== deletedTask.id)
      );
    },
  });
};
