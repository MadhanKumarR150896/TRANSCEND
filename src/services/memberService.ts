import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "../supabase/supabaseClient";
import type { Member, NewMember } from "../supabase/dataTypes";

const fetchMembers = async (): Promise<Member[]> => {
  const { data, error } = await supabase
    .from("members")
    .select("id,name")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) throw new Error("Unable to fetch members");

  return data;
};

export const useGetMembers = () => {
  return queryOptions({
    queryKey: ["Members"],
    queryFn: fetchMembers,
    refetchOnWindowFocus: false,
  });
};

const insertMember = async (newMember: NewMember): Promise<Member> => {
  const { data, error } = await supabase
    .from("members")
    .insert({ name: newMember.name, email: newMember.email })
    .select("id,name")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Unable to create new member");

  return data;
};

export const useCreateMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: insertMember,
    onSuccess: (createdMember) => {
      queryClient.setQueryData<Member[]>(["Members"], (oldMembers) =>
        oldMembers ? [createdMember, ...oldMembers] : oldMembers
      );
    },
  });
};
