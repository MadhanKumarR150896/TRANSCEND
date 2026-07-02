import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../supabase/supabaseClient";
import type { Project, ProjectId, ProjectP } from "../supabase/dataTypes";
import type { Privacy } from "../components/DisplayDiv";

const fetchProjects = async (): Promise<ProjectP[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("id,name,privacy")
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

const createProject = async (newProject: string): Promise<Project> => {
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
    mutationFn: createProject,

    onSuccess: (createdProject) => {
      queryClient.setQueryData<Project[]>(["Projects"], (oldProjects) =>
        oldProjects ? [createdProject, ...oldProjects] : oldProjects
      );
    },
  });
};

const deleteProject = async (
  projectId: string | undefined
): Promise<ProjectId> => {
  if (!projectId) throw new Error("Invalid Project Id");
  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .select("id")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to delete Project");

  return data;
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (deletedProject) => {
      queryClient.setQueryData<ProjectP[]>(["Projects"], (oldProjects) =>
        oldProjects?.filter((project) => project.id !== deletedProject.id)
      );
    },
  });
};

type ProjectNP = {
  projectName: string;
  projectPrivacy: Privacy;
  projectId: string;
};

const updateProject = async ({
  projectName,
  projectPrivacy,
  projectId,
}: ProjectNP) => {
  const { data, error } = await supabase
    .from("projects")
    .update({ name: projectName, privacy: projectPrivacy })
    .eq("id", projectId)
    .select("id,name,privacy")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to update Project");

  return data;
};

export const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectName,
      projectPrivacy,
    }: {
      projectName: string;
      projectPrivacy: Privacy;
    }) => updateProject({ projectName, projectPrivacy, projectId }),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData<ProjectP[]>(["Projects"], (oldProjects) =>
        oldProjects?.map((project) =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
    },
  });
};
