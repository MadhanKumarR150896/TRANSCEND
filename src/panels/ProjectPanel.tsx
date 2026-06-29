import { useQuery } from "@tanstack/react-query";
import { useState, type SyntheticEvent } from "react";
import { useCreateProject, useGetProjects } from "../services/projectService";
import { Link } from "react-router";
import { PanelLayout } from "../components/PanelLayout";

export const ProjectPanel = () => {
  const [projectName, setProjectName] = useState("");
  const [create, setCreate] = useState(false);
  const { data: projects, isLoading } = useQuery(useGetProjects());
  const { mutate, isPending } = useCreateProject();

  const createProject = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    mutate(projectName, {
      onSuccess: () => {
        setProjectName("");
        setCreate(false);
      },
      onError: () => {
        setProjectName("");
      },
    });
  };
  return (
    <PanelLayout
      title="Project"
      isCreate={create}
      isSetCreate={setCreate}
      isIsLoading={isLoading}
      loadingMessage="Your Projects are arriving..."
      formElement={
        <form className="flex items-center gap-2" onSubmit={createProject}>
          <fieldset name="project" className="flex items-center gap-2">
            <label htmlFor="project">Name</label>
            <input
              id="project"
              name="project"
              type="text"
              placeholder="Project Name"
              className="outline-none rounded bg-neutral-200 p-1"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </fieldset>
          <button
            className="bg-neutral-200 py-1 px-2 rounded hover:cursor-pointer "
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Creating" : "Submit"}
          </button>
        </form>
      }
    >
      {projects?.map((project) => (
        <Link key={project.id} to={`/dashboard/project/${project.id}`}>
          <div className="bg-neutral-600 text-white text-sm font-bold rounded px-2 py-1">
            <span>{project.name}</span>
          </div>
        </Link>
      ))}
    </PanelLayout>
  );
};
