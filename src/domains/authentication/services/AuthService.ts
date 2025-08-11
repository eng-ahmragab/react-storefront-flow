import { LoginCredentials, LoginResponse, AuthUser } from '../models/Auth';
import { userService } from '../../users/services/UserService';

class AuthService {
  private readonly baseUrl = 'https://fakestoreapi.com';
  private readonly TOKEN_STORAGE_KEY = 'ecommerce_token';
  private readonly USER_STORAGE_KEY = 'ecommerce_user';

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const result = await response.json();
      
      // Store token
      localStorage.setItem(this.TOKEN_STORAGE_KEY, result.token);
      
      // For demo purposes, we'll use a mock user based on username
      const mockUser: AuthUser = {
        id: 1,
        username: credentials.username,
        email: `${credentials.username}@example.com`,
        name: {
          firstname: 'John',
          lastname: 'Doe'
        }
      };
      
      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(mockUser));
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_STORAGE_KEY);
    localStorage.removeItem(this.USER_STORAGE_KEY);
  }

  getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_STORAGE_KEY);
  }

  getStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(this.USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const storedUser = this.getStoredUser();
    if (storedUser) {
      return storedUser;
    }

    // If no stored user but we have a token, try to fetch user data
    const token = this.getStoredToken();
    if (token) {
      try {
        // In a real app, you'd decode the JWT or call a /me endpoint
        // For demo, we'll return the stored user or null
        return this.getStoredUser();
      } catch (error) {
        console.error('Error fetching current user:', error);
        this.logout(); // Clear invalid token
        return null;
      }
    }

    return null;
  }

  // Demo users for testing (since API is limited)
  getDemoCredentials() {
    return [
      { username: 'mor_2314', password: '83r5^_' },
      { username: 'kevinryan', password: 'kev02937@' },
      { username: 'donero', password: 'ewedon' },
      { username: 'derek', password: 'jklg*_56' }
    ];
  }
}

export const authService = new AuthService();