import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User as UserIcon, AlertCircle, Info } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { loginSchema } from '../utils/validationSchemas';
import Button from '../components/Button';
import Input from '../components/Input';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, isMockMode, setMockMode, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on load
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: any) => {
    const success = await login(data.username, data.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-slate-950 to-black p-4 relative overflow-hidden select-none">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>

      {/* Main Container */}
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        
        {/* Logo / Header */}
        <div className="flex items-center space-x-2.5 mb-8">
          <div className="p-2.5 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-600/30">
            <ShieldCheck size={28} />
          </div>
          <span className="text-2xl font-heading font-black text-white tracking-wider uppercase">
            Preproute
          </span>
        </div>

        {/* Login Card */}
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
          
          <div className="mb-6 text-center">
            <h2 className="text-xl font-heading font-extrabold text-white">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Sign in to manage your online tests
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <AlertCircle className="text-rose-400 shrink-0 mt-0.5" size={16} />
              <div className="text-xs font-semibold text-rose-200">
                {error}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <Input
                label="Username / User ID"
                placeholder="Enter username"
                error={errors.username?.message}
                {...register('register' in register ? 'username' : 'username')}
                className="pl-11 bg-slate-950/40 border-slate-800 text-white focus:border-primary-600 focus:bg-slate-950/60"
              />
              <div className="absolute left-4 top-10.5 text-slate-500">
                <UserIcon size={16} />
              </div>
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                error={errors.password?.message}
                {...register('password')}
                className="pl-11 bg-slate-950/40 border-slate-800 text-white focus:border-primary-600 focus:bg-slate-950/60"
              />
              <div className="absolute left-4 top-10.5 text-slate-500">
                <Lock size={16} />
              </div>
            </div>

            {/* Mode Selector Option */}
            <div className="flex items-center justify-between pt-1 text-xs select-none">
              <span className="text-slate-400 font-medium">Connect using Offline Mock Mode?</span>
              <button
                type="button"
                onClick={() => setMockMode(!isMockMode)}
                className={`px-3 py-1 rounded-full font-bold border transition-all duration-200 ${
                  isMockMode 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isMockMode ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3.5 text-sm uppercase tracking-wider mt-4"
            >
              Sign In
            </Button>
          </form>

          {/* Credentials Info Panel */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex gap-3 text-left">
            <Info className="text-primary-400 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-xxs font-heading font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Staging Credentials
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Username: <code className="text-primary-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono text-xxs select-all">vedant-admin</code><br />
                Password: <code className="text-primary-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono text-xxs select-all">vedant123</code>
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
