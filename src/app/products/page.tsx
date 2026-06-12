"use client";

import Navbar from "@/components/Navbar";
import React from "react";
import { Wrench, Sparkles, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0a0f18] flex flex-col transition-colors duration-300">
            <Navbar onSearch={() => { }} onLocate={() => { }} />

            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 max-w-3xl w-full flex flex-col items-center text-center space-y-8 animate-fade-in-up">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-sm border border-blue-200 dark:border-blue-800/50">
                        <Sparkles className="w-4 h-4" />
                        <span>Something awesome is brewing</span>
                    </div>

                    {/* Heading */}
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Our Products are
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 pb-2">
                                Coming Soon
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            We're working hard in the lab to bring you powerful new tools for environmental tracking and analysis. Stay tuned for the launch!
                        </p>
                    </div>

                    {/* Features/Teasers grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-8">
                        <div className="flex flex-col items-center p-6 bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <h3 className="text-slate-900 dark:text-white font-semibold mb-2">Advanced Analytics</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Deep dive into historical and real-time environmental data trends.</p>
                        </div>

                        <div className="flex flex-col items-center p-6 bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            </div>
                            <h3 className="text-slate-900 dark:text-white font-semibold mb-2">Smart Alerts</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Custom notifications for critical air quality and weather changes.</p>
                        </div>

                        <div className="flex flex-col items-center p-6 bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="text-slate-900 dark:text-white font-semibold mb-2">Mobile Integration</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Seamless tracking on the go with our upcoming mobile companion.</p>
                        </div>
                    </div>

                    {/* Air Purifiers Hardware Teaser */}
                    <div className="w-full mt-12 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#0f172a] dark:to-[#020617] rounded-3xl p-8 md:p-12 text-left relative overflow-hidden shadow-2xl border border-slate-700 dark:border-slate-800">
                        <div className="absolute top-0 right-0 p-8 h-full opacity-10 pointer-events-none">
                            <svg className="h-full w-auto text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M14.25 2.25v2.25m-4.5-2.25v2.25M6.75 6a3 3 0 013-3h4.5a3 3 0 013 3v13.5a3 3 0 01-3 3h-4.5a3 3 0 01-3-3V6zm2.25 10.5h6m-6-3h6m-6-3h6" /></svg>
                        </div>

                        <div className="relative z-10 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 dark:bg-slate-900 text-slate-300 text-xs font-semibold border border-slate-700 mb-6">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Hardware Series
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Air Purifiers</span>
                            </h2>
                            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                Experience the next level of indoor air perfection. Our proprietary hardware seamlessly connects to your dashboard to physically cleanse the air based on real-time external conditions.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    HEPA Integration
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Auto-Climate Sync
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Whisper Quiet
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-8 flex flex-col sm:flex-row gap-4 items-center">
                        <Link href="/" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 transition-all hover:shadow-lg flex items-center gap-2">
                            Return to Dashboard
                        </Link>
                        <Link href="/liveweather-ranking" className="px-8 py-3 bg-white dark:bg-[#1f2937] hover:bg-slate-50 dark:hover:bg-[#374151] text-slate-700 dark:text-white font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-2">
                            View Live Rankings <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                </div>
            </div>
        </main>
    );
}
