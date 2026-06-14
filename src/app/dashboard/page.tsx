"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, logout } from "@/lib/firebase";
import { Wind, LogOut, ShieldAlert, Award, Compass, Heart } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Redirect to auth page if not logged in
        router.push("/auth");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020617] text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-neutral-400">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#020617] via-[#0f172a] to-[#1e293b] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header navbar */}
      <header className="relative w-full max-w-6xl mx-auto flex items-center justify-between border-b border-white/5 pb-6 mb-12 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-amber-500 to-red-500 p-[1px] flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-emerald-400">
              <Wind size={20} />
            </div>
          </div>
          <span className="text-xl font-black tracking-tight">AirAware</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm font-bold active:scale-[0.98] transition-all duration-300"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Layout */}
      <main className="relative w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
        {/* Profile Card */}
        <section className="backdrop-blur-xl bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-white/10 flex items-center justify-center text-3xl font-black text-emerald-400 mb-4 shadow-inner">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "?"}
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {user?.displayName || "Member"}
          </h2>
          <p className="text-sm text-neutral-400 mb-6">{user?.email}</p>

          <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-left space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Account Status:</span>
              <span className="text-emerald-400 font-bold">Verified</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Provider:</span>
              <span className="text-amber-400 font-bold uppercase">
                {user?.providerData[0]?.providerId || "Email"}
              </span>
            </div>
          </div>
        </section>

        {/* Dashboard Placeholder Features */}
        <section className="md:col-span-2 space-y-6">
          <div className="backdrop-blur-xl bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-red-500/10 border border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                Welcome Back
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                Breathe Smarter, {user?.displayName ? user.displayName.split(" ")[0] : "Member"}!
              </h1>
              <p className="text-neutral-300 max-w-xl leading-relaxed text-sm">
                Your AirAware account is successfully configured. You are now logged in and have access to premium air quality metrics, local health advisories, and historical forecast trackers.
              </p>
            </div>
          </div>

          {/* Cards metrics mock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-lg">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit mb-4">
                <Compass size={20} />
              </div>
              <h3 className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-1">Interactive Map</h3>
              <p className="text-xl font-bold text-white">Full Access</p>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-lg">
              <div className="p-3 bg-red-500/10 text-red-400 rounded-xl w-fit mb-4">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-1">Pollutant Alerts</h3>
              <p className="text-xl font-bold text-white">Configured</p>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-lg">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-4">
                <Award size={20} />
              </div>
              <h3 className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-1">AQI Reports</h3>
              <p className="text-xl font-bold text-white">Daily</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative w-full max-w-6xl mx-auto text-center text-xs text-neutral-500 mt-20 border-t border-white/5 pt-6 z-10 flex items-center justify-between">
        <span>&copy; 2026 AirAware Inc. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Made with <Heart size={12} className="text-red-500 fill-red-500" /> for cleaner air.
        </span>
      </footer>
    </div>
  );
}
