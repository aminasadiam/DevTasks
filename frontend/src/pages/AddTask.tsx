import { Component, createSignal } from "solid-js";
import GlassCard from "../components/GlassCard.jsx";
import { useNavigate, useParams } from "@solidjs/router";
import { addTask } from "../Services/ProjectService.js";

const AddTask: Component = () => {
  const params = useParams();
  const username: string = localStorage.getItem("username") || "";
  const [title, setTitle] = createSignal<string>("");
  const [description, setDescription] = createSignal<string>("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleAddTask = async () => {
    try {
      await addTask(username, params.project_id, title(), description());
      setTitle("");
      setDescription("");
      setError("");
      navigate(`/project/${params.project_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task");
    }
  };

  return (
    <div class="flex items-center justify-center min-h-screen">
      <GlassCard>
        <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-center mb-8 animate-pulse">
          New Task
        </h1>

        <div class="space-y-4">
          <div>
            <label class="block text-white mb-1" for="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              class="w-full p-2 rounded bg-gray-900 bg-opacity-50 text-white border border-gray-700 focus:outline-none focus:border-blue-400 transition"
              value={title()}
              onInput={(e) => setTitle(e.currentTarget.value)}
              placeholder="Enter Task Title"
            />
          </div>
          <div>
            <label class="block text-white mb-1" for="description">
              Description
            </label>
            <textarea
              id="description"
              rows={10}
              class="w-full p-2 rounded bg-gray-900 bg-opacity-50 text-white border border-gray-700 focus:outline-none focus:border-blue-400 transition"
              value={description()}
              onInput={(e) => setDescription(e.currentTarget.value)}
              placeholder="Enter Task Description"
            />
          </div>
          <button
            class="w-full p-2 bg-green-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
            onclick={handleAddTask}
          >
            Create
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default AddTask;
