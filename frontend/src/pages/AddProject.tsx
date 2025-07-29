import { Component, createSignal } from "solid-js";
import GlassCard from "../components/GlassCard.jsx";
import { A, useNavigate } from "@solidjs/router";
import { addProject } from "../Services/ProjectService.js";

const AddProject: Component = () => {
  const username: string = localStorage.getItem("username") || "";
  const [name, setName] = createSignal<string>("");
  const [description, setDescription] = createSignal<string>("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleAddProject = async () => {
    try {
      await addProject(username, name(), description());
      setName("");
      setError("");
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add project");
    }
  };

  return (
    <div class="flex items-center justify-center min-h-screen">
      <GlassCard>
        <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-center mb-8 animate-pulse">
          New Project
        </h1>

        <div class="space-y-4">
          <div>
            <label class="block text-white mb-1" for="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              class="w-full p-2 rounded bg-gray-900 bg-opacity-50 text-white border border-gray-700 focus:outline-none focus:border-blue-400 transition"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="Enter Project Name"
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
              placeholder="Enter Project Description"
            />
          </div>
          <button
            class="w-full p-2 bg-green-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
            onclick={handleAddProject}
          >
            Create
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default AddProject;
