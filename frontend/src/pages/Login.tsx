import { Component, createSignal } from "solid-js";
import GlassCard from "../components/GlassCard.jsx";

const Login: Component = () => {
    const [username, setUsername] = createSignal('');
    const [password, setPassword] = createSignal('');

    const handleSubmit = () => {
        console.log('Login:', { username: username(), password: password() });
        // Add your login logic here
    };

    return (
        <div class="flex items-center justify-center min-h-screen">
        <GlassCard>
            <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-center mb-8 animate-pulse">
                DevTasks
            </h1>
            <div class="space-y-4">
            <div>
                <label class="block text-white mb-1" for="username">Username</label>
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
                <label class="block text-white mb-1" for="password">Password</label>
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
                class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={handleSubmit}
            >
                Log In
            </button>
            </div>
        </GlassCard>
        </div>
    );
};

export default Login;