/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App.jsx";
import { Navigate, Route, Router } from "@solidjs/router";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AddProject from "./pages/AddProject.jsx";
import ProjectDetails from "./pages/Project.jsx";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router root={App}>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />

      <Route path={"/project/new"} component={AddProject} />
      <Route path={"/project/:id"} component={ProjectDetails} />

      <Route path="*" component={() => <Navigate href="/login" />} />
    </Router>
  ),
  root!
);
