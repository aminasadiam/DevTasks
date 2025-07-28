import { Component, createSignal, onMount } from "solid-js";
import GlassCard from "../components/GlassCard.jsx";
import { checkAuth, login, logout } from "../Services/LoginService.js";
import { A } from "@solidjs/router";

const Login: Component = () => {
    const [username, setUsername] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [error, setError] = createSignal('');
    const [loggedIn, setLoggedIn] = createSignal(false); // Initialize with false

    onMount(async () => {
        const isAuthenticated = await checkAuth();
        setLoggedIn(isAuthenticated);
    });

    const handleSubmit = async () => {
        try {
        const response = await login(username(), password());
        console.log('Login successful:', response);
        setLoggedIn(true);
        setError('');
        localStorage.setItem('username', username());
        } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
        setLoggedIn(false);
        }
    };

    return (
        <div class="flex items-center justify-center min-h-screen">
        <GlassCard>
            <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-center mb-8 animate-pulse">
                DevTasks
            </h1>
            {error() && (
                <div class="text-red-500 text-center mb-4">{error()}</div>
            )}
            {loggedIn() ? (
                <div class="space-y-4">
                    <p class="text-white text-center">Welcome, {username()}!</p>
                    <A href="/" class="bg-sky-600 text-gray-300 py-2 px-4 rounded-md m-auto">Home Page</A>
                </div>
            ) : (
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
            )}
        </GlassCard>
        </div>
    );
};

export default Login;