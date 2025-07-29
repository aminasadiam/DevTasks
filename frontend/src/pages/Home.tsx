import { Component, createSignal, onMount } from "solid-js";
import GlassCard from "../components/GlassCard.jsx";
import UserLogo from "../assets/Default.png";
import { logout } from "../Services/LoginService.js";
import { useNavigate } from "@solidjs/router";
import { getProjects, Project } from "../Services/ProjectService.js";

const Home: Component = () => {
  const [projects, setProjects] = createSignal<Project[]>([]);
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";
  onMount(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects(username);
        setProjects(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load projects"
        );
      }
    };
    fetchProjects();
    const interval = setInterval(fetchProjects, 5000);
    return () => clearInterval(interval);
  });

  const handleLogout = () => {
    logout(username, navigate);
  };

  return (
    <div class="flex items-center justify-center min-h-screen">
      <GlassCard>
        <div class="flex">
          <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
            DevTasks
          </h2>
          <button
            onclick={handleLogout}
            class="bg-red-950 text-gray-300 py-2 px-3 rounded-md ml-42 cursor-pointer duration-300 hover:scale-105"
          >
            Logout
          </button>
        </div>
        <hr class="text-gray-500 my-4" />
        <div class="col-auto">
          {projects().length > 0 ? (
            projects().map((project: Project) => (
              <div class="bg-gray-700 flex text-gray-300 my-3 p-4 rounded-md cursor-pointer hover:scale-105 duration-300">
                <h2 class="font-bold">{project.Name}</h2>
                <span class="m-auto">{project.Description}</span>
              </div>
            ))
          ) : (
            <div class="text-gray-400">No projects found.</div>
          )}
          {error() && <div class="text-red-500">{error()}</div>}
        </div>
        <button
          class="bg-green-700 text-gray-300 py-2 px-4 rounded-md mt-4 cursor-pointer duration-300 hover:scale-105"
          onclick={() => navigate("/project/new")}
        >
          New Project
        </button>
      </GlassCard>
    </div>
  );
};

export default Home;
