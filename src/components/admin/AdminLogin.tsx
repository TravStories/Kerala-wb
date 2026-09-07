import React, { useState } from 'react';
import { Lock, Mail, Compass, AlertCircle, ArrowLeft, ShieldCheck, Key } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [email, setEmail] = useState('sales.travstories@gmail.com');
  const [password, setPassword] = useState('Admin@TravStories2026');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid admin credentials');
      }

      localStorage.setItem('travstories_admin_token', data.token);
      onLoginSuccess(data.token);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 selection:bg-emerald-600 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Top Branding Banner */}
        <div className="bg-emerald-950 text-white p-8 text-center relative overflow-hidden">
          <button
            onClick={onBackToWebsite}
            className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white mx-auto flex items-center justify-center mb-3 shadow-md">
            <Compass className="w-6 h-6 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-white tracking-tight">
            TravStories CMS
          </h2>
          <p className="text-xs text-neutral-300 mt-1">
            Private Admin Panel & Lead Management
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          
          {error && (
            <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3.5 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                placeholder="admin@travstories.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {/* Quick Pre-fill helper box for review testing */}
          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
            <div className="font-bold text-neutral-800 flex items-center gap-1">
              <Key className="w-3 h-3 text-emerald-700" />
              <span>Demo Admin Credentials</span>
            </div>
            <div>Email: <code className="text-emerald-800 font-mono">sales.travstories@gmail.com</code></div>
            <div>Password: <code className="text-emerald-800 font-mono">Admin@TravStories2026</code></div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isLoading ? 'Signing In...' : 'Sign In to Admin CMS'}</span>
          </button>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure session authentication • Encrypted passwords</span>
          </div>

        </form>

      </div>
    </div>
  );
};
