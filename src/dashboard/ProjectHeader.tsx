import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  useDeleteProject,
  useGetProjects,
  useUpdateProject,
} from "../services/projectService";
import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { DisplayDiv, type Privacy } from "../components/DisplayDiv";
import { FormBox } from "../components/FormBox";
import { X } from "lucide-react";

export const ProjectHeader = () => {
  const { projectId } = useParams();
  const { data: projects } = useQuery(useGetProjects());
  const project = projects?.find((project) => project.id === projectId);
  const [activeDrop, setActiveDrop] = useState<string | null>(null);
  const { mutate: update, isPending: updatePending } = useUpdateProject(
    projectId!
  );
  const { mutate, isPending } = useDeleteProject();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [projectPrivacy, setProjectPrivacy] = useState<Privacy>("Public");
  const formRef = useRef<HTMLDivElement>(null);

  const updateProject = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (projectName === project?.name && projectPrivacy === project?.privacy)
      return;
    update(
      { projectName, projectPrivacy },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
        onError: () => {
          setIsOpen(true);
        },
      }
    );
  };

  const deleteProject = () => {
    mutate(projectId, {
      onSuccess: () => {
        navigate("/dashboard", { replace: true });
      },
    });
  };

  const onClose = () => {
    if (project) {
      setIsOpen(false);
      setProjectName(project.name);
      setProjectPrivacy(project.privacy);
    }
  };

  useEffect(() => {
    if (!project) return;
    const updateState = () => {
      setProjectName(project.name);
      setProjectPrivacy(project.privacy);
    };
    updateState();
  }, [project]);

  if (!project) return null;
  return (
    <div className="relative">
      <DisplayDiv
        display="Project"
        id={project.id}
        name={project.name}
        privacy={project.privacy}
        isActiveDrop={activeDrop}
        isSetActiveDrop={setActiveDrop}
        toDelete={deleteProject}
        deletePending={isPending}
        toUpdate={setIsOpen}
      />
      {isOpen && (
        <div
          ref={formRef}
          className="absolute top-full right-0 mt-1 border p-2 rounded border-neutral-300 z-10 flex gap-2 items-center justify-between"
        >
          <FormBox
            formRef={formRef}
            onSubmit={updateProject}
            iOneType="text"
            iOneName="changeproject"
            iOnePlace="Change Project Name"
            iOne={projectName}
            setIOne={setProjectName}
            sName="changePrivacy"
            sValue={projectPrivacy}
            setSValue={setProjectPrivacy}
            onClose={onClose}
            isPending={updatePending}
          />
          <button
            onClick={onClose}
            className="hover:cursor-pointer mbe-auto"
            type="button"
          >
            <X strokeWidth={1} size={25} />
          </button>
        </div>
      )}
    </div>
  );
};
