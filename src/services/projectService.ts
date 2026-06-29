import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../supabase/supabaseClient";
import type { Project } from "../supabase/dataTypes";

const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("id,name")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch projects");

  return data;
};

export const useGetProjects = () => {
  return queryOptions({
    queryKey: ["Projects"],
    queryFn: fetchProjects,
    refetchOnWindowFocus: false,
  });
};

const insertProject = async (newProject: string): Promise<Project> => {
  const { data, error } = await supabase
    .from("projects")
    .insert({ name: newProject })
    .select("id,name")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to create new project");

  return data;
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertProject,

    onSuccess: (createdProject) => {
      queryClient.setQueryData<Project[]>(["Projects"], (oldProjects) =>
        oldProjects ? [createdProject, ...oldProjects] : oldProjects
      );
    },
  });
};
