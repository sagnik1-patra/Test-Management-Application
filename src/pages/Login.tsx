import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, AlertCircle, Info } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { loginSchema } from '../utils/validationSchemas';
import Button from '../components/Button';
import Input from '../components/Input';
import logoImg from '../assets/logo.png';

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
    <div className="min-h-screen flex items-center justify-center bg-white p-4 relative overflow-hidden select-none">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/5 rounded-full filter blur-3xl animate-pulse-slow delay-1000"></div>

      {/* Main Container */}
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        
        {/* Logo / Header */}
        <div className="flex items-center space-x-3.5 mb-8 animate-floating">
          <img 
            src={logoImg} 
            alt="Preproute Logo" 
            className="w-11 h-11 object-contain filter drop-shadow-[0_4px_12px_rgba(79,70,229,0.15)]" 
          />
          <span className="text-3xl font-heading font-black text-slate-900 tracking-widest uppercase bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text text-transparent">
            Preproute
          </span>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white border border-slate-100 rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] relative animate-slide-up">
          
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">
              Sign in to manage your online tests
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3">
              <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />
              <div className="text-xs font-semibold text-rose-700">
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
                {...register('username')}
                className="pl-11 bg-slate-50 border-slate-200 text-slate-900 focus:border-primary-600 focus:bg-white"
              />
              <div className="absolute left-4 top-10.5 text-slate-400">
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
                className="pl-11 bg-slate-50 border-slate-200 text-slate-900 focus:border-primary-600 focus:bg-white"
              />
              <div className="absolute left-4 top-10.5 text-slate-400">
                <Lock size={16} />
              </div>
            </div>

            {/* Mode Selector Option */}
            <div className="flex items-center justify-between pt-1 text-xs select-none">
              <span className="text-slate-500 font-medium">Connect using Offline Mock Mode?</span>
              <button
                type="button"
                onClick={() => setMockMode(!isMockMode)}
                className={`px-3 py-1 rounded-full font-bold border transition-all duration-200 ${
                  isMockMode 
                    ? 'bg-amber-50 border-amber-200 text-amber-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
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
          <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3 text-left">
            <Info className="text-primary-600 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-xxs font-heading font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Staging Credentials
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Username: <code className="text-primary-700 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded font-mono text-xxs select-all">vedant-admin</code><br />
                Password: <code className="text-primary-700 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded font-mono text-xxs select-all">vedant123</code>
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
