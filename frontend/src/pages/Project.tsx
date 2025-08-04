import { useNavigate, useParams } from "@solidjs/router";
import { Component, createSignal, onMount } from "solid-js";
import {
  getProjectTasks,
  getProjectViaID,
  Project,
  Task,
} from "../Services/ProjectService.js";
import GlassCard from "../components/GlassCard.jsx";

const ProjectDetails: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const id = Number(params.id);
  const username = localStorage.getItem("username") || "";
  const [project, setProject] = createSignal<Project | null>(null);
  const [tasks, setTasks] = createSignal<Task[]>([]);
  const [error, setError] = createSignal("");

  onMount(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectViaID(id.toString(), username);
        setProject(data);
        const taskData = await getProjectTasks(id.toString(), username);
        setTasks(taskData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load project or tasks"
        );
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

            <div class="col-auto">
              <button
                class="bg-green-600 py-2 px-3 text-gray-300 rounded-md cursor-pointer"
                onClick={() => navigate(`/project/${project()?.ID}/task/new`)}
              >
                New Task
              </button>

              {tasks().length > 0 ? (
                tasks().map((task: Task) => (
                  <div
                    class="bg-gray-700 flex text-gray-300 my-3 p-4 rounded-md cursor-pointer hover:scale-105 duration-300"
                    onClick={() =>
                      navigate(`/project/${project()?.ID}/task/${task.ID}`)
                    }
                  >
                    <h2 class="font-bold">{task.Title}</h2>
                    <span class="m-auto">{task.Description}</span>
                  </div>
                ))
              ) : (
                <div class="text-gray-400 mt-3">No tasks found.</div>
              )}
            </div>
          </GlassCard>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default ProjectDetails;
