import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/AuthService';
import { LoginCredentials, AuthUser } from '../models/Auth';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      await authService.login(credentials);
      await checkAuthStatus();
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in."
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  }, [toast]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    refreshAuth: checkAuthStatus
  };
};