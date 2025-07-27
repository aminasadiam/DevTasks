import { createSignal, ParentProps, type Component } from 'solid-js';
import Background from './components/Background.jsx';
import Login from './pages/Login.jsx';

const App: Component = (props: ParentProps) => {
  return (
    <div class='relative min-h-screen'>
      <Background />
      <div class="relative z-10">
        {props.children}
      </div>
    </div>
  );
};

export default App;
