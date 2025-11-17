import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from 'services/authService';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        authService.setToken(token);
        authService.setUser(user);

        // Redirect to github repository page
        navigate('/github-repository');
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/');
      }
    } else {
      // No token, redirect to home
      navigate('/');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 font-medium">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
