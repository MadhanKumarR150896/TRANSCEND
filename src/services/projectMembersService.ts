import type {
  MemberE,
  MembershipId,
  ProjectMember,
} from "../supabase/dataTypes";
import { supabase } from "../supabase/supabaseClient";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const fetchAvailableMembers = async (
  value: string,
  projectId: string
): Promise<MemberE[]> => {
  const { data, error } = await supabase.rpc("get_available_members", {
    p_project_id: projectId,
    p_search: value,
  });

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch members");

  return data;
};

export const useGetAvailableMembers = (
  value: string,
  projectId: string | undefined
) => {
  if (!projectId) throw new Error("Invalid Project Id");
  return queryOptions({
    queryKey: ["Available Members", value],
    queryFn: () => fetchAvailableMembers(value, projectId),
    enabled: !!value,
  });
};

const fetchProjectMembers = async (
  projectId: string
): Promise<ProjectMember[]> => {
  const { data, error } = await supabase
    .from("project_members")
    .select(`id,name:members(name)`)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch Project Members");

  const typedData = data.map((projectMember) => ({
    membershipId: projectMember.id,
    memberName: projectMember.name.name,
  }));

  return typedData;
};

export const useGetProjectMembers = (projectId: string | undefined) => {
  if (!projectId) throw new Error("Invalid Project ID");
  return queryOptions({
    queryKey: ["Project Members", projectId],
    queryFn: () => fetchProjectMembers(projectId),
    enabled: !!projectId,
  });
};

type NewMember = {
  memberId: string;
  projectId: string;
};

const addProjectmember = async ({ memberId, projectId }: NewMember) => {
  const { data, error } = await supabase
    .from("project_members")
    .insert({ member_id: memberId, project_id: projectId })
    .select("id,name:members(name)")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to add Project Member");

  const typedData = {
    membershipId: data.id,
    memberName: data.name.name,
  };

  return typedData;
};

export const useAddProjectMember = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => addProjectmember({ memberId, projectId }),

    onSuccess: (addedMember) => {
      queryClient.setQueryData<ProjectMember[]>(
        ["Project Members", projectId],
        (oldMemberships) =>
          oldMemberships ? [addedMember, ...oldMemberships] : oldMemberships
      );
    },
  });
};

const deleteProjectMember = async (
  membershipId: string
): Promise<MembershipId> => {
  const { data, error } = await supabase
    .from("project_members")
    .delete()
    .eq("id", membershipId)
    .select("id")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch Project Members");

  return data;
};

export const useDeleteProjectMember = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectMember,
    onSuccess: (deletedMembership) => {
      queryClient.setQueryData<ProjectMember[]>(
        ["Project Members", projectId],
        (oldMemberships) =>
          oldMemberships?.filter(
            (membership) => membership.membershipId !== deletedMembership.id
          )
      );
    },
  });
};

type ProjectM = {
  id: string;
  name: string;
};

const projectMembers = async (projectId: string): Promise<ProjectM[]> => {
  const { data, error } = await supabase
    .from("project_members")
    .select(`members(id,name)`)
    .eq("project_id", projectId);

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch Project Mems");

  const typedData = data.map((projectMem) => ({
    id: projectMem.members.id,
    name: projectMem.members.name,
  }));

  return typedData;
};

export const useGetPMembers = (projectId: string | undefined) => {
  if (!projectId) throw new Error("Invalid Project ID");
  return queryOptions({
    queryKey: ["Project Mem", projectId],
    queryFn: () => projectMembers(projectId),
    enabled: !!projectId,
  });
};
