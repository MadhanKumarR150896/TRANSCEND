import type { Database as dataTypes } from "./database.types";

export type Projects = dataTypes["public"]["Tables"]["projects"]["Row"];
export type Members = dataTypes["public"]["Tables"]["members"]["Row"];
export type ProjectMembers =
  dataTypes["public"]["Tables"]["project_members"]["Row"];
export type Lists = dataTypes["public"]["Tables"]["lists"]["Row"];

export type Project = Omit<Projects, "created_at" | "privacy">;

export type Member = Pick<Members, "name" | "id">;
export type NewMember = Pick<Members, "name" | "email">;

export type ProjectMember = {
  membershipId: ProjectMembers["id"];
  memberName: Members["name"];
};

export type MembershipId = Pick<ProjectMembers, "id">;

export type ProjectList = Pick<Lists, "name" | "id">;
export type ListId = Pick<Lists, "id">;
export type NewList = Pick<Lists, "name" | "id">;
