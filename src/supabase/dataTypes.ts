import type { Database as dataTypes } from "./database.types";

export type Projects = dataTypes["public"]["Tables"]["projects"]["Row"];
export type Members = dataTypes["public"]["Tables"]["members"]["Row"];

export type Project = Omit<Projects, "created_at" | "privacy">;
export type Member = Pick<Members, "name" | "id">;

export type NewMember = Pick<Members, "name" | "email">;
