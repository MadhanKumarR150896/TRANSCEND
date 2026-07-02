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
    .select(`id,name,description,assigned_to:members(id,name),list_id`)
    .eq("list_id", listId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch Lists");

  const typedData = data.map((task) => ({
    id: task.id,
    name: task.name,
    list_id: task.list_id,
    description: task.description,
    assigned_to: task.assigned_to?.id ?? null,
    assignedName: task.assigned_to?.name ?? null,
  }));

  return typedData;
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
  listId: string;
};

const createListTask = async ({
  taskName,
  taskDesc,
  listId,
}: TaskA): Promise<Task> => {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ name: taskName, description: taskDesc, list_id: listId })
    .select("id,name,description,assigned_to:members(id,name),list_id")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to create new project");

  return {
    id: data.id,
    name: data.name,
    list_id: data.list_id,
    description: data.description,
    assigned_to: data.assigned_to?.id ?? null,
    assignedName: data.assigned_to?.name ?? null,
  };
};

export const useCreateListTask = (listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskName,
      taskDesc,
    }: {
      taskName: string;
      taskDesc: string;
    }) => createListTask({ taskName, taskDesc, listId }),

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

type TaskU = {
  taskName: string;
  taskId: string;
  desc: string | null;
  listId: string;
  assignedto: string | null;
};

const updateTask = async ({
  taskName,
  desc,
  listId,
  assignedto,
  taskId,
}: TaskU): Promise<Task> => {
  const { data, error } = await supabase
    .from("tasks")
    .update({
      name: taskName,
      description: desc,
      list_id: listId,
      assigned_to: assignedto,
    })
    .eq("id", taskId)
    .select("id,name,description,assigned_to:members(id,name),list_id")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to update Project");

  return {
    id: data.id,
    name: data.name,
    list_id: data.list_id,
    description: data.description,
    assigned_to: data.assigned_to?.id ?? null,
    assignedName: data.assigned_to?.name ?? null,
  };
};

export const useUpdateListTask = (taskId: string, listId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskName,
      desc,
      assignedto,
      listId,
    }: {
      taskName: string;
      desc: string | null;
      listId: string;
      assignedto: string | null;
    }) => updateTask({ taskName, desc, taskId, listId, assignedto }),
    onSuccess: (updatedtask) => {
      if (listId === updatedtask.list_id) {
        queryClient.setQueryData<Task[]>(["List Tasks", listId], (oldTasks) =>
          oldTasks?.map((task) =>
            task.id === updatedtask.id ? updatedtask : task
          )
        );
      } else {
        queryClient.setQueryData<Task[]>(["List Tasks", listId], (oldTasks) =>
          oldTasks?.filter((task) => task.id !== updatedtask.id)
        );

        queryClient.setQueryData<Task[]>(
          ["List Tasks", updatedtask.list_id],
          (old) => (old ? [updatedtask, ...old] : [updatedtask])
        );
      }
    },
  });
};
