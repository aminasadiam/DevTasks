import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { addProject } from "../Services/ProjectService.js";
import GlassCard from "../components/GlassCard.jsx";

const AddProject: Component = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async () => {
    if (!name().trim()) {
      setError("Project name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await addProject(username, name(), description());
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="text-center mb-8 animate-fade-in-down">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span class="text-3xl">📁</span>
          </div>
          <h1 class="text-4xl font-bold gradient-text mb-2">New Project</h1>
          <p class="text-white/70">
            Create a new project to organize your tasks
          </p>
        </div>

        <GlassCard>
          <div class="space-y-6">
            {/* Error Display */}
            {error() && (
              <div class="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm animate-fade-in-up">
                <div class="flex items-center gap-2">
                  <span class="text-lg">⚠️</span>
                  {error()}
                </div>
              </div>
            )}

            {/* Project Name Input */}
            <div class="space-y-2">
              <label class="block text-white font-medium text-sm">
                Project Name *
              </label>
              <input
                type="text"
                class="input-modern w-full"
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter project name"
                disabled={isLoading()}
              />
            </div>

            {/* Project Description Input */}
            <div class="space-y-2">
              <label class="block text-white font-medium text-sm">
                Description
              </label>
              <textarea
                class="input-modern w-full min-h-[120px] resize-none"
                value={description()}
                onInput={(e) => setDescription(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter project description (optional)"
                disabled={isLoading()}
              />
            </div>

            {/* Action Buttons */}
            <div class="flex gap-4">
              <button
                onclick={handleSubmit}
                disabled={isLoading()}
                class={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  isLoading()
                    ? "bg-gray-500 cursor-not-allowed opacity-50"
                    : "btn-success hover:scale-105"
                }`}
              >
                {isLoading() ? (
                  <div class="flex items-center justify-center gap-2">
                    <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  <div class="flex items-center justify-center gap-2">
                    <span>✨</span>
                    Create Project
                  </div>
                )}
              </button>

              <button
                onclick={() => navigate("/")}
                disabled={isLoading()}
                class="flex-1 py-4 rounded-xl font-semibold text-lg bg-gray-600 text-white hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AddProject;
