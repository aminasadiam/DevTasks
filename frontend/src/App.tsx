import { ParentProps, Show, type Component, onMount } from "solid-js";
import Background from "./components/Background.jsx";
import { Navigate, useLocation } from "@solidjs/router";
import { checkAuth } from "./Services/LoginService.js";
import { createSignal, onCleanup } from "solid-js";

const ProtectedRoute: Component<ParentProps> = (props: ParentProps) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [loading, setLoading] = createSignal(true);

  const check = async () => {
    setLoading(true);
    const currentUsername = localStorage.getItem("username") || "";
    const result = await checkAuth(currentUsername);
    setIsAuthenticated(result);
    setLoading(false);
  };

  onMount(() => {
    check(); // Only run once on mount
    // If you want periodic checks, uncomment below:
    // const interval = setInterval(check, 10000);
    // onCleanup(() => clearInterval(interval));
  });

  return (
    <Show
      when={!loading()}
      fallback={
        <div class="text-center text-white mt-10">
          Checking authentication...
        </div>
      }
    >
      <Show
        when={
          isAuthenticated() ||
          location.pathname === "/login" ||
          location.pathname === "/register"
        }
        fallback={<Navigate href="/login" />}
      >
        {props.children}
      </Show>
    </Show>
  );
};

const App: Component = (props: ParentProps) => {
  return (
    <div class="relative min-h-screen">
      <Background />
      <div class="relative z-10">
        <ProtectedRoute>{props.children}</ProtectedRoute>
      </div>
    </div>
  );
};

export default App;
