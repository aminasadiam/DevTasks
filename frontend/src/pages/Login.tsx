import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { login } from "../Services/LoginService.js";
import GlassCard from "../components/GlassCard.jsx";

const Login: Component = () => {
  const navigate = useNavigate();
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const handleLogin = async () => {
    if (!username() || !password()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Starting login process...");
      await login(username(), password());
      console.log("Login successful, navigating to home...");
      // Small delay to ensure authentication state is updated
      setTimeout(() => {
        navigate("/");
        console.log("Navigation called");
      }, 100);
    } catch (err) {
      console.error("Login error in component:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="text-center mb-8 animate-fade-in-down">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span class="text-3xl">🚀</span>
          </div>
          <h1 class="text-4xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p class="text-white/70">Sign in to continue to DevTasks</p>
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

            {/* Username Input */}
            <div class="space-y-2">
              <label class="block text-white font-medium text-sm">
                Username
              </label>
              <input
                type="text"
                class="input-modern w-full"
                value={username()}
                onInput={(e) => setUsername(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your username"
                disabled={isLoading()}
              />
            </div>

            {/* Password Input */}
            <div class="space-y-2">
              <label class="block text-white font-medium text-sm">
                Password
              </label>
              <input
                type="password"
                class="input-modern w-full"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                disabled={isLoading()}
              />
            </div>

            {/* Login Button */}
            <button
              onclick={handleLogin}
              disabled={isLoading()}
              class={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isLoading()
                  ? "bg-gray-500 cursor-not-allowed opacity-50"
                  : "btn-primary hover:scale-105"
              }`}
            >
              {isLoading() ? (
                <div class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                <div class="flex items-center justify-center gap-2">
                  <span>🔐</span>
                  Sign In
                </div>
              )}
            </button>

            {/* Divider */}
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-white/20"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-transparent text-white/50">
                  New to DevTasks?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <button
              onclick={() => navigate("/register")}
              class="w-full py-3 rounded-xl font-medium text-white/80 hover:text-white transition-colors duration-300 hover:bg-white/10"
            >
              Create an account
            </button>
          </div>
        </GlassCard>

        {/* Footer */}
        <div class="text-center mt-8 animate-fade-in-up">
          <p class="text-white/50 text-sm">
            © 2024 DevTasks. Built with ❤️ for productivity
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
