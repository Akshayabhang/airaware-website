"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, AlertCircle, CheckCircle2 } from "lucide-react";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import {
  signUpWithEmail,
  loginWithEmail,
  signInWithGoogle,
} from "@/lib/firebase";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();

  // Clear toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleEmailSignup = async (email: string, password: string, name: string) => {
    setLoading(true);
    setToast(null);
    try {
      await signUpWithEmail(email, password, name);
      setToast({ type: "success", message: "Sign up successful! Redirecting..." });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      let friendlyMessage = "An error occurred during sign up.";
      if (error.code === "auth/email-already-in-use") {
        friendlyMessage = "This email is already registered.";
      } else if (error.code === "auth/weak-password") {
        friendlyMessage = "Password is too weak.";
      } else if (error.message) {
        friendlyMessage = error.message;
      }
      setToast({ type: "error", message: friendlyMessage });
      setLoading(false);
    }
  };

  const handleEmailLogin = async (email: string, password: string) => {
    setLoading(true);
    setToast(null);
    try {
      await loginWithEmail(email, password);
      setToast({ type: "success", message: "Login successful! Redirecting..." });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      let friendlyMessage = "An error occurred during sign in.";
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        friendlyMessage = "Incorrect email or password.";
      } else if (error.code === "auth/too-many-requests") {
        friendlyMessage = "Too many failed attempts. Try again later.";
      } else if (error.message) {
        friendlyMessage = error.message;
      }
      setToast({ type: "error", message: friendlyMessage });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setToast(null);
    try {
      await signInWithGoogle();
      setToast({ type: "success", message: "Signed in with Google! Redirecting..." });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      setToast({
        type: "error",
        message: error.message || "Google Authentication failed.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-[#020617] via-[#0f172a] to-[#1e293b] overflow-hidden px-4 py-8">
      {/* Decorative background glow circles */}
      <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-80 h-80 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

      {/* Floating Animated Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border backdrop-blur-md shadow-2xl ${
              toast.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
                : "bg-red-950/80 border-red-500/30 text-red-300"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Centered glassmorphic card */}
      <div className="relative w-full max-w-[440px] z-10">
        <div className="w-full backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-[32px] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Card subtle lighting border overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[32px]" />

          {/* Logo & Tagline */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 via-amber-400 to-red-400 p-[1.5px] shadow-[0_8px_25px_-5px_rgba(16,185,129,0.3)] mb-3">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                <Wind size={28} className="animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent tracking-tight">
              AirAware
            </h1>
            <p className="text-xs font-semibold text-neutral-400 tracking-widest uppercase mt-1">
              Breathe Smarter. Know Your Air.
            </p>
          </div>

          {/* Sliding Tabs Switcher */}
          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 mb-8 relative">
            <button
              onClick={() => {
                if (!loading) setActiveTab("login");
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl relative transition-colors duration-300 z-10 ${
                activeTab === "login" ? "text-slate-950" : "text-neutral-400 hover:text-white"
              }`}
            >
              {activeTab === "login" && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-white rounded-lg shadow-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-20">Sign In</span>
            </button>
            <button
              onClick={() => {
                if (!loading) setActiveTab("signup");
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl relative transition-colors duration-300 z-10 ${
                activeTab === "signup" ? "text-slate-950" : "text-neutral-400 hover:text-white"
              }`}
            >
              {activeTab === "signup" && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-white rounded-lg shadow-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-20">Sign Up</span>
            </button>
          </div>

          {/* Form Views Render with slide transitions */}
          <div className="relative overflow-hidden min-h-[380px]">
            <AnimatePresence mode="wait">
              {activeTab === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <LoginForm
                    onSubmit={handleEmailLogin}
                    onGoogleSubmit={handleGoogleSignIn}
                    loading={loading}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <SignupForm
                    onSubmit={handleEmailSignup}
                    onGoogleSubmit={handleGoogleSignIn}
                    loading={loading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
