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
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const data = await getProjectViaID(id.toString(), username);
        setProject(data);
        const taskData = await getProjectTasks(id.toString(), username);
        setTasks(taskData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load project or tasks"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  });

  return (
    <div class="min-h-screen p-6">
      <div class="max-w-6xl mx-auto">
        {error() ? (
          <div class="text-center py-12">
            <div class="text-red-400 text-4xl mb-4">⚠️</div>
            <p class="text-red-300 text-xl">{error()}</p>
          </div>
        ) : project() ? (
          <>
            {/* Header */}
            <div class="text-center mb-12 animate-fade-in-down">
              <div class="flex justify-center items-center gap-4 mb-6">
                <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                  <span class="text-2xl">📁</span>
                </div>
                <h1 class="text-4xl font-bold gradient-text">
                  {project()?.Name}
                </h1>
              </div>
              <p class="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {project()?.Description || "No description provided"}
              </p>

              <div class="flex justify-center gap-4 mb-8">
                <button
                  onclick={() => navigate("/")}
                  class="btn-secondary flex items-center gap-2"
                >
                  <span class="text-lg">🏠</span>
                  Home
                </button>
                <button
                  onclick={() => navigate(`/project/${project()?.ID}/task/new`)}
                  class="btn-success flex items-center gap-2"
                >
                  <span class="text-lg">✨</span>
                  New Task
                </button>
              </div>
            </div>

            {/* Tasks Section */}
            <div class="animate-fade-in-up">
              <h2 class="text-3xl font-bold gradient-text-secondary mb-8 text-center">
                Tasks ({tasks().length})
              </h2>

              {tasks().length > 0 ? (
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasks().map((task: Task, index) => (
                    <div
                      class="card-modern cursor-pointer group animate-fade-in-up"
                      style={`animation-delay: ${index * 0.1}s`}
                      onclick={() =>
                        navigate(`/project/${project()?.ID}/task/${task.ID}`)
                      }
                    >
                      <div class="relative">
                        {/* Task Icon */}
                        <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <span class="text-lg">📝</span>
                        </div>

                        {/* Task Info */}
                        <h3 class="text-lg font-bold text-white mb-2 group-hover:text-green-300 transition-colors line-clamp-1">
                          {task.Title}
                        </h3>
                        <p class="text-white/70 mb-4 line-clamp-2 text-sm">
                          {task.Description || "No description provided"}
                        </p>

                        {/* Task Meta */}
                        <div class="flex items-center justify-between text-xs text-white/50">
                          <span>
                            {task.created_at
                              ? new Date(task.created_at).toLocaleDateString()
                              : "Unknown"}
                          </span>
                          <span class="status-online"></span>
                        </div>

                        {/* Hover Effect */}
                        <div class="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Click Hint */}
                        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span class="text-xs text-white/60">
                            Click to view
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div class="text-center py-16 animate-fade-in-up">
                  <div class="w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span class="text-4xl">📝</span>
                  </div>
                  <h3 class="text-2xl font-bold text-white mb-4">
                    No Tasks Yet
                  </h3>
                  <p class="text-white/70 mb-8 max-w-md mx-auto">
                    Get started by creating your first task for this project.
                    Break down your work into manageable pieces!
                  </p>
                  <button
                    onclick={() =>
                      navigate(`/project/${project()?.ID}/task/new`)
                    }
                    class="btn-success text-lg px-8 py-4"
                  >
                    Create Your First Task 🚀
                  </button>
                </div>
              )}
            </div>

            {/* Project Stats */}
            {tasks().length > 0 && (
              <div class="mt-16 animate-fade-in-up">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="card-modern text-center">
                    <div class="text-3xl mb-2">📊</div>
                    <div class="text-2xl font-bold gradient-text">
                      {tasks().length}
                    </div>
                    <div class="text-white/70">Total Tasks</div>
                  </div>
                  <div class="card-modern text-center">
                    <div class="text-3xl mb-2">📅</div>
                    <div class="text-2xl font-bold gradient-text-secondary">
                      {
                        tasks().filter(
                          (t) =>
                            t.created_at &&
                            new Date(t.created_at).toDateString() ===
                              new Date().toDateString()
                        ).length
                      }
                    </div>
                    <div class="text-white/70">Created Today</div>
                  </div>
                  <div class="card-modern text-center">
                    <div class="text-3xl mb-2">⭐</div>
                    <div class="text-2xl font-bold gradient-text-accent">
                      {
                        tasks().filter(
                          (t) =>
                            t.updated_at &&
                            new Date(t.updated_at).toDateString() ===
                              new Date().toDateString()
                        ).length
                      }
                    </div>
                    <div class="text-white/70">Updated Today</div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div class="text-center py-12">
            {isLoading() ? (
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            ) : (
              <div class="text-red-400 text-4xl mb-4">⚠️</div>
            )}
            <p class="text-white/70">
              {isLoading() ? "Loading project..." : "Project not found"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
