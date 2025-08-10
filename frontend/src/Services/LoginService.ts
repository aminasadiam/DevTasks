import { createSignal } from "solid-js";

interface LoginResponse {
  csrfToken: string;
}

interface LoginError {
  error: string;
}

export const [isAuthenticated, setIsAuthenticated] = createSignal(false);

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('Attempting login for username:', username);
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    console.log('Login response status:', response.status);

    if (!response.ok) {
      const errorData: LoginError = await response.json();
      console.error('Login failed:', errorData);
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    console.log('Login response data:', data);
    
    const csrfToken = data.csrfToken || '';
    if (csrfToken) {
      document.cookie = `csrf_token=${csrfToken}; path=/;`;
      console.log('CSRF token set in cookie');
    }
    
    // Store username in localStorage for future use
    localStorage.setItem('username', username);
    console.log('Username stored in localStorage:', username);
    
    setIsAuthenticated(true);
    console.log('Login successful');
    return { csrfToken };
  } catch (error) {
    setIsAuthenticated(false);
    console.error('Login error:', error);
    throw error instanceof Error ? error : new Error('Network error');
  }
};

export const register = async (username: string, password: string): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    // Generate a simple email from username for now
    formData.append('email', `${username}@example.com`);

    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData: LoginError = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    
    // Registration successful, but don't store username yet since user needs to login
    console.log('Registration successful');
  } catch (error) {
    console.error('Registration error:', error);
    throw error instanceof Error ? error : new Error('Network error');
  }
};

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
}

export const checkAuth = async (username: string): Promise<boolean> => {
  try {
    const sessionToken = getCookie('session_token');
    const csrfToken = getCookie('csrf_token');

    if (!sessionToken) {
      setIsAuthenticated(false);
      return false;
    }

    const formData = new URLSearchParams();
    formData.append('username', username);

    const response = await fetch('http://localhost:3000/api/validate', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Validate failed:', await response.text());
      setIsAuthenticated(false);
      return false;
    }

    setIsAuthenticated(true);
    return true;
  } catch (error) {
    console.error('CheckAuth error:', error);
    setIsAuthenticated(false);
    return false;
  }
};

export const logout = async (username: string, navigate: (path: string) => void): Promise<void> => {
  try {
    const csrfToken = getCookie('csrf_token');

    const formData = new URLSearchParams();
    formData.append('username', username);

    const response = await fetch('http://localhost:3000/api/logout', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Logout response:', await response.text());
      throw new Error('Logout request failed');
    }
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    navigate('/login');
  }
};
