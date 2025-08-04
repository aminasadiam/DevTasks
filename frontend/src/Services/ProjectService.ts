import { isAuthenticated } from "./LoginService.js";

export interface Project {
  ID: string;
  Name: string;
  Description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  ID: string;
  Title: string;
  Description?: string;
  created_at?: string;
  updated_at?: string;
}

interface ProjectError {
  error: string;
}

export const getProjects = async (username: string): Promise<Project[]> => {
  if (!isAuthenticated()) {
    throw new Error('Not authenticated');
  }

  try {
    const formData = new URLSearchParams();
    formData.append('username', username);

    const csrf_token = getCookie('csrf_token');

    const response = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrf_token,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ProjectError = await response.json();
      throw new Error(errorData.error || 'Failed to fetch projects');
    }

    return await response.json() as Project[];
  } catch (error) {
    throw error instanceof Error ? error : new Error('Network error');
  }
};

export const addProject = async (username: string, name: string, description?: string) => {
  if (!isAuthenticated()) {
    throw new Error('Not authenticated');
  }

  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('name', name);
    if (description) formData.append('description', description);

    const csrf_token = getCookie('csrf_token');

    const response = await fetch('http://localhost:3000/api/add-project', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrf_token,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ProjectError = await response.json();
      throw new Error(errorData.error || 'Failed to add project');
    }

    return await response.json() as Project[];
  } catch (error) {
    throw error instanceof Error ? error : new Error('Network error');
  }
};

export const getProjectViaID = async (projectID: string, username: string): Promise<Project> => {
  if (!isAuthenticated()) {
    throw new Error('Not authenticated');
  }

  try {
    const csrf_token = getCookie('csrf_token');

    if (!projectID) {
      throw new Error('Project ID is required');
    }

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('project_id', projectID);

    const response = await fetch(`http://localhost:3000/api/project`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrf_token,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ProjectError = await response.json();
      throw new Error(errorData.error || 'Failed to fetch project');
    }

    return await response.json() as Project;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Network error');
  }
}

export const getProjectTasks = async (projectID: string, username: string): Promise<Task[]> => {
  if (!isAuthenticated()) {
    throw new Error('Not authenticated');
  }

  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('project_id', projectID);

    const csrf_token = getCookie('csrf_token');

    const response = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrf_token,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ProjectError = await response.json();
      throw new Error(errorData.error || 'Failed to fetch projects');
    }

    return await response.json() as Task[];
  } catch (error) {
    throw error instanceof Error ? error : new Error('Network error');
  }
}

export const addTask = async (username: string, projectId: string, title: string, description?: string) => {
  if (!isAuthenticated()) {
    throw new Error('Not authenticated');
  }

  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('project_id', projectId);
    formData.append('title', title);
    if (description) formData.append('description', description);

    const csrf_token = getCookie('csrf_token');

    const response = await fetch('http://localhost:3000/api/add-task', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrf_token,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: ProjectError = await response.json();
      throw new Error(errorData.error || 'Failed to add task');
    }

    return await response.json() as Task[];
  } catch (error) {
    throw error instanceof Error ? error : new Error('Network error');
  }
}

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
}