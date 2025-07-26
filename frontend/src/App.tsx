import { createSignal, type Component } from 'solid-js';
import Background from './components/Background.jsx';
import Login from './pages/Login.jsx';

const App: Component = () => {
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Login:', { username: username(), password: password() });
    // Add your login logic here
  };
  
  return (
    <div class='relative min-h-screen'>
      <Background />
      <div class="relative z-10">
        <Login />
      </div>
    </div>
  );
};

export default App;
