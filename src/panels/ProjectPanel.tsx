import { useQuery } from "@tanstack/react-query";
import { useRef, useState, type SyntheticEvent } from "react";
import { useCreateProject, useGetProjects } from "../services/projectService";
import { Link } from "react-router";
import { PanelLayout } from "../components/PanelLayout";
import { FormBox } from "../components/FormBox";

export const ProjectPanel = () => {
  const [projectName, setProjectName] = useState("");
  const [create, setCreate] = useState(false);
  const { data: projects, isLoading } = useQuery(useGetProjects());
  const { mutate, isPending } = useCreateProject();
  const formRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createProject = (e: SyntheticEvent<HTMLFormElement, Event>) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    mutate(projectName, {
      onSuccess: () => {
        setProjectName("");
      },
      onError: () => {
        setProjectName("");
      },
    });
  };
  return (
    <PanelLayout
      title="Projects"
      variant="Create Project"
      isCreate={create}
      buttonRef={buttonRef}
      isSetCreate={setCreate}
      isIsLoading={isLoading}
      loadingMessage="Your Projects are arriving..."
      formElement={
        <div ref={formRef} className="flex-1">
          <FormBox
            formRef={formRef}
            buttonRef={buttonRef}
            onSubmit={createProject}
            iOneType="text"
            iOneName="projectname"
            iOnePlace="Project Name"
            iOne={projectName}
            setIOne={setProjectName}
            isPending={isPending}
            onClose={() => {
              setCreate(false);
              setProjectName("");
            }}
          />
        </div>
      }
    >
      {projects?.map((project) => (
        <Link key={project.id} to={`/dashboard/project/${project.id}`}>
          <div className="bg-neutral-600 text-white font-bold rounded px-2 py-1">
            <span>{project.name}</span>
          </div>
        </Link>
      ))}
    </PanelLayout>
  );
};
