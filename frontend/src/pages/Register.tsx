import { Component, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { register } from "../Services/LoginService.js";
import GlassCard from "../components/GlassCard.jsx";

const Register: Component = () => {
  const navigate = useNavigate();
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const handleRegister = async () => {
    if (!username() || !password() || !confirmPassword()) {
      setError("Please fill in all fields");
      return;
    }

    if (password() !== confirmPassword()) {
      setError("Passwords do not match");
      return;
    }

    if (password().length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register(username(), password());
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <div class="text-center mb-8 animate-fade-in-down">
          <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span class="text-3xl">🌟</span>
          </div>
          <h1 class="text-4xl font-bold gradient-text mb-2">Join DevTasks</h1>
          <p class="text-white/70">Create your account and start organizing</p>
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
                placeholder="Choose a username"
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
                placeholder="Create a password"
                disabled={isLoading()}
              />
            </div>

            {/* Confirm Password Input */}
            <div class="space-y-2">
              <label class="block text-white font-medium text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                class="input-modern w-full"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                placeholder="Confirm your password"
                disabled={isLoading()}
              />
            </div>

            {/* Register Button */}
            <button
              onclick={handleRegister}
              disabled={isLoading()}
              class={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isLoading()
                  ? "bg-gray-500 cursor-not-allowed opacity-50"
                  : "btn-success hover:scale-105"
              }`}
            >
              {isLoading() ? (
                <div class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                <div class="flex items-center justify-center gap-2">
                  <span>✨</span>
                  Create Account
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
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <button
              onclick={() => navigate("/login")}
              class="w-full py-3 rounded-xl font-medium text-white/80 hover:text-white transition-colors duration-300 hover:bg-white/10"
            >
              Sign in instead
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

export default Register;
