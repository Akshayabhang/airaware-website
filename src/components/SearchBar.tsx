"use client";

import { Search, MapPin } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
    onSearch: (city: string) => void;
    onLocate: () => void;
    isLoading?: boolean;
}

export default function SearchBar({ onSearch, onLocate, isLoading = false }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="relative flex items-center w-full">
                {/* Search Icon */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                    <Search className="w-5 h-5" />
                </div>

                {/* Input Field */}
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a city globally (e.g., London, Tokyo, Delhi)..."
                    className="w-full pl-12 pr-16 py-4 rounded-2xl border border-neutral-200 bg-white text-neutral-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow text-lg"
                    disabled={isLoading}
                />

                {/* Location Button */}
                <button
                    type="button"
                    onClick={onLocate}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors disabled:opacity-50"
                    title="Use my location"
                >
                    <MapPin className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
