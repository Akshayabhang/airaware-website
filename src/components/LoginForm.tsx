import React, { useState } from "react";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleSubmit: () => Promise<void>;
  loading: boolean;
}

export default function LoginForm({ onSubmit, onGoogleSubmit, loading }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Field validation states
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || loading) return;
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      {/* Email input */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Mail size={16} />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={loading}
            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:bg-white/10 transition-all duration-300 ${
              errors.email
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-white/10 focus:ring-emerald-500/30"
            }`}
          />
        </div>
        {errors.email && (
          <div className="flex items-center gap-1 mt-1 text-xs text-red-400 font-medium">
            <AlertCircle size={12} />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {/* Password input */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 mb-1.5 uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Lock size={16} />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            className={`w-full pl-10 pr-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:bg-white/10 transition-all duration-300 ${
              errors.password
                ? "border-red-500/50 focus:ring-red-500/30"
                : "border-white/10 focus:ring-emerald-500/30"
            }`}
          />
        </div>
        {errors.password && (
          <div className="flex items-center gap-1 mt-1 text-xs text-red-400 font-medium">
            <AlertCircle size={12} />
            <span>{errors.password}</span>
          </div>
        )}
      </div>

      {/* Remember me & Forgot Password */}
      <div className="flex items-center justify-between text-xs font-medium">
        <label className="flex items-center gap-2 cursor-pointer text-neutral-300 select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-0 cursor-pointer"
          />
          Remember me
        </label>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-amber-400 hover:text-amber-300 transition-colors"
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button - AQI scale gradient (Green -> Amber -> Red) */}
      <button
        type="submit"
        disabled={loading}
        className="relative w-full py-3 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden"
      >
        {/* Subtle hover glow layer */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <LogIn size={16} />
            <span>Sign In</span>
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Or Continue With
        </span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      {/* Google Sign In */}
      <button
        type="button"
        onClick={onGoogleSubmit}
        disabled={loading}
        className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all duration-300 text-white font-medium flex items-center justify-center gap-2.5"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        <span>Google</span>
      </button>
    </form>
  );
}
