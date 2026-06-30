import type {
  Member,
  MembershipId,
  ProjectMember,
} from "../supabase/dataTypes";
import { supabase } from "../supabase/supabaseClient";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const fetchAllMembers = async (value: string): Promise<Member[]> => {
  const { data, error } = await supabase
    .from("members")
    .select("id,name")
    .or(`name.ilike.%${value}%,email.ilike.%${value}%`);

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch members");

  return data;
};

export const useGetAllMembers = (value: string) => {
  return queryOptions({
    queryKey: ["All Members", value],
    queryFn: () => fetchAllMembers(value),
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
