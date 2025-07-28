import { Component, createSignal, onMount } from "solid-js";
import GlassCard from "../components/GlassCard.jsx";
import { A, useNavigate } from "@solidjs/router";
import { checkAuth } from "../Services/LoginService.js";

const Register: Component = () => {
  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = createSignal(false); // Initialize with false

  onMount(async () => {
    const usrname = localStorage.getItem("username") || "";
    const isAuthenticated = await checkAuth(usrname);
    setLoggedIn(isAuthenticated);
  });

  const handleRegister = async (e: Event) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("username", username());
      formData.append("email", email());
      formData.append("password", password());

      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        setError(await response.text());
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Registration failed.");
    }
  };

  return (
    <div class="flex items-center justify-center min-h-screen">
      <GlassCard>
        <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-center mb-8 animate-pulse">
          DevTasks
        </h1>
        {error() && <div class="text-red-500 text-center mb-4">{error()}</div>}

        {loggedIn() ? (
          <div class="space-y-4">
            <p class="text-white text-center">Welcome, {username()}!</p>
            <A
              href="/"
              class="bg-sky-600 text-gray-300 py-2 px-4 rounded-md m-auto"
            >
              Home Page
            </A>
          </div>
        ) : (
          <div class="space-y-4">
            <div>
              <label class="block text-white mb-1" for="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                class="w-full p-2 rounded bg-gray-900 bg-opacity-50 text-white border border-gray-700 focus:outline-none focus:border-blue-400 transition"
                value={username()}
                onInput={(e) => setUsername(e.currentTarget.value)}
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label class="block text-white mb-1" for="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                class="w-full p-2 rounded bg-gray-900 bg-opacity-50 text-white border border-gray-700 focus:outline-none focus:border-blue-400 transition"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="Enter your Email"
              />
            </div>
            <div>
              <label class="block text-white mb-1" for="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                class="w-full p-2 rounded bg-gray-900 bg-opacity-50 text-white border border-gray-700 focus:outline-none focus:border-blue-400 transition"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                placeholder="Enter your password"
              />
            </div>
            <button
              onClick={handleRegister}
              class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Register
            </button>

            <A href="/login" class="text-gray-400">
              Already have an account? Login
            </A>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Register;
