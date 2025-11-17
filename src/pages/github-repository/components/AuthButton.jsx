import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, User, Menu, X } from 'lucide-react';
import authService from 'services/authService';

const AuthButton = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (authService.isAuthenticated()) {
      const userData = authService.getUser();
      setUser(userData);
    }
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const authUrl = await authService.getGitHubAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to initiate login. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setMenuOpen(false);
    window.location.reload();
  };

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        disabled={loading}
        className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30 disabled:opacity-50"
      >
        <LogIn className="w-5 h-5" />
        <span className="font-medium">{loading ? 'Loading...' : 'Login with GitHub'}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-colors border border-white/30"
      >
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.username} className="w-6 h-6 rounded-full" />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="font-medium">{user.username}</span>
        {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20">
            <div className="px-4 py-3 border-b border-slate-200">
              <p className="text-sm font-medium text-slate-900">{user.username}</p>
              {user.email && <p className="text-xs text-slate-600 mt-1">{user.email}</p>}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthButton;
