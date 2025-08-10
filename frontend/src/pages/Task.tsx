import { Component, createSignal, onMount, Show } from "solid-js";
import GlassCard from "../components/GlassCard.jsx";
import { useNavigate, useParams } from "@solidjs/router";
import {
  getTaskById,
  updateTask,
  deleteTask,
  type Task,
} from "../Services/ProjectService.js";

const Task: Component = () => {
  const params = useParams();
  const username: string = localStorage.getItem("username") || "";
  const navigate = useNavigate();

  const [task, setTask] = createSignal<Task | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [isEditing, setIsEditing] = createSignal(false);
  const [isUpdating, setIsUpdating] = createSignal(false);
  const [isDeleting, setIsDeleting] = createSignal(false);

  // Edit form state
  const [editTitle, setEditTitle] = createSignal("");
  const [editDescription, setEditDescription] = createSignal("");

  const loadTask = async () => {
    try {
      setIsLoading(true);
      setError("");
      console.log("Loading task with ID:", params.id, "for user:", username);
      const taskData = await getTaskById(params.id, username);
      console.log("Task data received:", taskData);
      setTask(taskData);
      setEditTitle(taskData.Title);
      setEditDescription(taskData.Description || "");
    } catch (err) {
      console.error("Error loading task:", err);
      setError(err instanceof Error ? err.message : "Failed to load task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!editTitle().trim()) {
      setError("Title is required");
      return;
    }

    try {
      setIsUpdating(true);
      setError("");
      const updatedTask = await updateTask(
        params.id,
        username,
        editTitle(),
        editDescription()
      );
      setTask(updatedTask);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this task? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");
      await deleteTask(params.id, username);
      navigate(`/project/${params.project_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleString();
  };

  onMount(() => {
    console.log("Task component mounted with params:", params);
    console.log("Task ID:", params.id);
    console.log("Project ID:", params.project_id);
    loadTask();
  });

  return (
    <div class="min-h-screen p-6">
      <div class="max-w-4xl mx-auto">
        <Show
          when={!isLoading()}
          fallback={
            <div class="text-center py-12">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p class="text-white/70">Loading task...</p>
            </div>
          }
        >
          <Show
            when={task()}
            fallback={
              <div class="text-center py-12">
                <div class="text-red-400 text-4xl mb-4">⚠️</div>
                <p class="text-red-300 text-xl">Task not found</p>
              </div>
            }
          >
            <div class="animate-fade-in-up">
              {/* Header */}
              <div class="text-center mb-8">
                <div class="flex justify-center items-center gap-4 mb-6">
                  <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                    <span class="text-2xl">📝</span>
                  </div>
                  <h1 class="text-4xl font-bold gradient-text">Task Details</h1>
                </div>

                <div class="flex justify-center gap-4 mb-8">
                  <button
                    onclick={() => navigate("/")}
                    class="btn-secondary flex items-center gap-2"
                  >
                    <span class="text-lg">🏠</span>
                    Home
                  </button>
                  <button
                    onclick={() => navigate(`/project/${params.project_id}`)}
                    class="btn-primary flex items-center gap-2"
                  >
                    <span class="text-lg">⬅️</span>
                    Back to Project
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error() && (
                <div class="mb-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm animate-fade-in-up">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">⚠️</span>
                    {error()}
                  </div>
                </div>
              )}

              <GlassCard>
                <Show
                  when={!isEditing()}
                  fallback={
                    /* Edit Form */
                    <div class="space-y-6">
                      <h2 class="text-2xl font-bold gradient-text-secondary mb-6">
                        Edit Task
                      </h2>

                      <div class="space-y-4">
                        <div>
                          <label class="block text-white font-medium text-sm mb-2">
                            Title
                          </label>
                          <input
                            type="text"
                            class="input-modern w-full"
                            value={editTitle()}
                            onInput={(e) => setEditTitle(e.currentTarget.value)}
                            placeholder="Enter task title"
                          />
                        </div>

                        <div>
                          <label class="block text-white font-medium text-sm mb-2">
                            Description
                          </label>
                          <textarea
                            class="input-modern w-full min-h-[120px] resize-none"
                            value={editDescription()}
                            onInput={(e) =>
                              setEditDescription(e.currentTarget.value)
                            }
                            placeholder="Enter task description"
                          />
                        </div>
                      </div>

                      <div class="flex gap-4">
                        <button
                          onclick={handleUpdateTask}
                          disabled={isUpdating()}
                          class={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            isUpdating()
                              ? "bg-gray-500 cursor-not-allowed opacity-50"
                              : "btn-success hover:scale-105"
                          }`}
                        >
                          {isUpdating() ? (
                            <div class="flex items-center justify-center gap-2">
                              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Updating...
                            </div>
                          ) : (
                            <div class="flex items-center justify-center gap-2">
                              <span>💾</span>
                              Save Changes
                            </div>
                          )}
                        </button>

                        <button
                          onclick={() => setIsEditing(false)}
                          disabled={isUpdating()}
                          class="flex-1 py-3 rounded-xl font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  }
                >
                  {/* View Mode */}
                  <div class="space-y-6">
                    <div class="flex justify-between items-start">
                      <h2 class="text-2xl font-bold text-white">
                        {task()?.Title}
                      </h2>
                      <div class="flex gap-2">
                        <button
                          onclick={() => setIsEditing(true)}
                          class="btn-primary flex items-center gap-2"
                        >
                          <span>✏️</span>
                          Edit
                        </button>
                        <button
                          onclick={handleDeleteTask}
                          disabled={isDeleting()}
                          class={`btn-danger flex items-center gap-2 ${
                            isDeleting() ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {isDeleting() ? (
                            <div class="flex items-center gap-2">
                              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Deleting...
                            </div>
                          ) : (
                            <div class="flex items-center gap-2">
                              <span>🗑️</span>
                              Delete
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    <div class="bg-white/5 rounded-xl p-6">
                      <h3 class="text-lg font-semibold text-white mb-3">
                        Description
                      </h3>
                      <p class="text-white/80 leading-relaxed">
                        {task()?.Description || "No description provided"}
                      </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="bg-white/5 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-3">
                          Created
                        </h3>
                        <p class="text-white/80">
                          {formatDate(task()?.created_at)}
                        </p>
                      </div>

                      <div class="bg-white/5 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-white mb-3">
                          Last Updated
                        </h3>
                        <p class="text-white/80">
                          {formatDate(task()?.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Show>
              </GlassCard>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
};

export default Task;
