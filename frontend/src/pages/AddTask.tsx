import { Component, createSignal } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { addTask } from "../Services/ProjectService.js";
import GlassCard from "../components/GlassCard.jsx";

const AddTask: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";
  const [title, setTitle] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async () => {
    if (!title().trim()) {
      setError("Task title is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await addTask(username, params.project_id, title(), description());
      console.log(
        "Task created successfully, navigating to project:",
        params.project_id
      );
      // Small delay to ensure task creation is fully processed
      setTimeout(() => {
        navigate(`/project/${params.project_id}`);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
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
          <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span class="text-3xl">📝</span>
          </div>
          <h1 class="text-4xl font-bold gradient-text mb-2">New Task</h1>
          <p class="text-white/70">Add a new task to your project</p>
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

            {/* Task Title Input */}
            <div class="space-y-2">
              <label class="block text-white font-medium text-sm">
                Task Title *
              </label>
              <input
                type="text"
                class="input-modern w-full"
                value={title()}
                onInput={(e) => setTitle(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter task title"
                disabled={isLoading()}
              />
            </div>

            {/* Task Description Input */}
            <div class="space-y-2">
              <label class="block text-white font-medium text-sm">
                Description
              </label>
              <textarea
                class="input-modern w-full min-h-[120px] resize-none"
                value={description()}
                onInput={(e) => setDescription(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter task description (optional)"
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
                    Create Task
                  </div>
                )}
              </button>

              <button
                onclick={() => navigate(`/project/${params.project_id}`)}
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

export default AddTask;
