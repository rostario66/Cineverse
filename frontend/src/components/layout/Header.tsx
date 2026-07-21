import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Search } from 'lucide-react';

export default function Header() {
    const { isAuthenticated, userName, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const isProfileActive = location.pathname === '/profile';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        setQuery('');
    };

    return (
        <header className="sticky top-0 z-40 h-16 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/5 flex items-center gap-4 px-10">
            {/* Поиск */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search movies, directors, or users..."
                    className="w-full bg-white/5 text-white placeholder-gray-500 pl-11 pr-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500/50 text-sm border border-white/10"
                />
            </form>

            {/* Профиль / авторизация */}
            <div className="flex items-center gap-3 ml-auto">
                {isAuthenticated ? (
                    <>
                        <Link
                            to="/profile"
                            className={`flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full transition-all border ${
                                isProfileActive
                                    ? 'bg-cyan-500/10 border-cyan-500/30'
                                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                            }`}
                        >
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                                <User size={16} className="text-cyan-400" />
                            </div>
                            <span className="text-white text-sm font-medium">{userName}</span>
                        </Link>

                        <button
                            onClick={logout}
                            aria-label="Logout"
                            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-red-400 border border-white/10 transition-all"
                        >
                            <LogOut size={16} />
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all border border-white/10"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}