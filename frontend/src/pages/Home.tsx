import { Component, createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { getProjects, type Project } from "../Services/ProjectService.js";
import GlassCard from "../components/GlassCard.jsx";

const Home: Component = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";
  const [projects, setProjects] = createSignal<Project[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  onMount(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await getProjects(username);
        setProjects(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load projects"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  });

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div class="min-h-screen p-6">
      <div class="max-w-7xl mx-auto">
        {/* Header */}
        <div class="text-center mb-12 animate-fade-in-down">
          <h1 class="text-5xl font-bold gradient-text mb-4 text-glow">
            Welcome, {username}! 👋
          </h1>
          <p class="text-xl text-white/80 mb-8">
            Manage your projects and tasks with ease
          </p>

          <div class="flex justify-center gap-4 mb-8">
            <button
              onclick={() => navigate("/project/new")}
              class="btn-success flex items-center gap-2"
            >
              <span class="text-xl">✨</span>
              New Project
            </button>
            <button
              onclick={handleLogout}
              class="btn-secondary flex items-center gap-2"
            >
              <span class="text-xl">🚪</span>
              Logout
            </button>
          </div>
        </div>

        {/* Projects Section */}
        <div class="animate-fade-in-up">
          <h2 class="text-3xl font-bold gradient-text-secondary mb-6 text-center">
            Your Projects
          </h2>

          {isLoading() ? (
            <div class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p class="text-white/70">Loading your projects...</p>
            </div>
          ) : error() ? (
            <div class="text-center py-12">
              <div class="text-red-400 text-xl mb-4">⚠️</div>
              <p class="text-red-300">{error()}</p>
            </div>
          ) : projects().length > 0 ? (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects().map((project, index) => (
                <div
                  class="card-modern cursor-pointer group animate-fade-in-up"
                  style={`animation-delay: ${index * 0.1}s`}
                  onclick={() => navigate(`/project/${project.ID}`)}
                >
                  <div class="relative">
                    {/* Project Icon */}
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span class="text-2xl">📁</span>
                    </div>

                    {/* Project Info */}
                    <h3 class="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {project.Name}
                    </h3>
                    <p class="text-white/70 mb-4 line-clamp-2">
                      {project.Description || "No description provided"}
                    </p>

                    {/* Project Meta */}
                    <div class="flex items-center justify-between text-sm text-white/50">
                      <span>
                        Created:{" "}
                        {project.created_at
                          ? new Date(project.created_at).toLocaleDateString()
                          : "Unknown"}
                      </span>
                      <span class="status-online"></span>
                    </div>

                    {/* Hover Effect */}
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div class="text-center py-16 animate-fade-in-up">
              <div class="w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-4xl">📂</span>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">
                No Projects Yet
              </h3>
              <p class="text-white/70 mb-8 max-w-md mx-auto">
                Get started by creating your first project. Organize your tasks
                and boost your productivity!
              </p>
              <button
                onclick={() => navigate("/project/new")}
                class="btn-primary text-lg px-8 py-4"
              >
                Create Your First Project 🚀
              </button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        {projects().length > 0 && (
          <div class="mt-16 animate-fade-in-up">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="card-modern text-center">
                <div class="text-3xl mb-2">📊</div>
                <div class="text-2xl font-bold gradient-text">
                  {projects().length}
                </div>
                <div class="text-white/70">Total Projects</div>
              </div>
              <div class="card-modern text-center">
                <div class="text-3xl mb-2">📅</div>
                <div class="text-2xl font-bold gradient-text-secondary">
                  {
                    projects().filter(
                      (p) =>
                        p.created_at &&
                        new Date(p.created_at).toDateString() ===
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
                    projects().filter(
                      (p) =>
                        p.updated_at &&
                        new Date(p.updated_at).toDateString() ===
                          new Date().toDateString()
                    ).length
                  }
                </div>
                <div class="text-white/70">Updated Today</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
