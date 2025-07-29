import { useNavigate, useParams } from "@solidjs/router";
import { Component, createSignal, onMount } from "solid-js";
import { getProjectViaID, Project } from "../Services/ProjectService.js";
import GlassCard from "../components/GlassCard.jsx";

const ProjectDetails: Component = () => {
  const params = useParams();
  const id = Number(params.id);
  const username = localStorage.getItem("username") || "";
  const [project, setProject] = createSignal<Project | null>(null);
  const [error, setError] = createSignal("");

  onMount(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectViaID(id.toString(), username);
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load project");
      }
    };
    fetchProject();
  });

  return (
    <>
      {error() ? (
        <p class="text-red-500">{error()}</p>
      ) : project() ? (
        <div class="flex items-center justify-center min-h-screen">
          <GlassCard>
            <div class="flex">
              <h2 class="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
                {project()?.Name}
              </h2>
            </div>
            <div class="flex items-center justify-center my-3">
              <span class="text-gray-300">{project()?.Description}</span>
            </div>
            <hr class="text-gray-500 my-4" />
          </GlassCard>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default ProjectDetails;
