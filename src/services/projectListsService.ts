import type {
  ListId,
  NewList,
  Project,
  ProjectList,
} from "../supabase/dataTypes";
import { supabase } from "../supabase/supabaseClient";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const fetchProjectLists = async (projectId: string): Promise<ProjectList[]> => {
  const { data, error } = await supabase
    .from("lists")
    .select(`id,name`)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch Project Members");

  return data;
};

export const useGetProjectLists = (projectId: string | undefined) => {
  if (!projectId) throw new Error("Invalid Project ID");
  return queryOptions({
    queryKey: ["Project Lists", projectId],
    queryFn: () => fetchProjectLists(projectId),
    enabled: !!projectId,
  });
};

type List = {
  listName: string;
  projectId: string;
};

const createProjectList = async ({
  listName,
  projectId,
}: List): Promise<NewList> => {
  const { data, error } = await supabase
    .from("lists")
    .insert({ name: listName, project_id: projectId })
    .select("id,name")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to create new project");

  return data;
};

export const useCreateProjectList = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listName: string) =>
      createProjectList({ listName, projectId }),

    onSuccess: (createdList) => {
      queryClient.setQueryData<ProjectList[]>(
        ["Project Lists", projectId],
        (oldLists) => (oldLists ? [createdList, ...oldLists] : oldLists)
      );
    },
  });
};

const deleteProjectList = async (listId: string): Promise<ListId> => {
  const { data, error } = await supabase
    .from("lists")
    .delete()
    .eq("id", listId)
    .select("id")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to delete List");

  return data;
};

export const useDeleteProjectList = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectList,
    onSuccess: (deletedList) => {
      queryClient.setQueryData<ProjectList[]>(
        ["Project Lists", projectId],
        (oldLists) => oldLists?.filter((list) => list.id !== deletedList.id)
      );
    },
  });
};

type ListU = {
  listName: string;
  listId: string;
};

const updateList = async ({ listName, listId }: ListU) => {
  const { data, error } = await supabase
    .from("lists")
    .update({ name: listName })
    .eq("id", listId)
    .select("id,name")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to update Project");

  return data;
};

export const useUpdateProjectList = (listId: string, projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listName: string) => updateList({ listName, listId }),
    onSuccess: (updatedList) => {
      queryClient.setQueryData<Project[]>(
        ["Project Lists", projectId],
        (oldLists) =>
          oldLists?.map((list) =>
            list.id === updatedList.id ? updatedList : list
          )
      );
    },
  });
};
