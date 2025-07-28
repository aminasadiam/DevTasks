import { ParentProps, Show, type Component } from 'solid-js';
import Background from './components/Background.jsx';
import { Navigate, useLocation } from '@solidjs/router';
import { checkAuth } from './Services/LoginService.js';

import { createSignal, onCleanup } from 'solid-js';

const ProtectedRoute: Component<ParentProps> = (props: ParentProps) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);

  const check = async () => {
    const currentUsername = localStorage.getItem("username") || '';
    const result = await checkAuth(currentUsername);
    setIsAuthenticated(result);
  };

  check(); // Initial check

  const interval = setInterval(check, 1000);

  onCleanup(() => clearInterval(interval));

  return (
    <Show when={isAuthenticated() || location.pathname === '/login'} fallback={<Navigate href="/login" />}>
      {props.children}
    </Show>
  );
}

const App: Component = (props: ParentProps) => {
  return (
    <div class='relative min-h-screen'>
      <Background />
      <div class="relative z-10">
        <ProtectedRoute>
          {props.children}
        </ProtectedRoute>
      </div>
    </div>
  );
};

export default App;
