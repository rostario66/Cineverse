import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    TrendingUp,
    Film,
    Star,
    Users,
    List,
    PenSquare,
    Settings,
    HelpCircle,
} from 'lucide-react';

const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: Film, label: 'New Releases', path: '/new-releases' },
    { icon: Star, label: 'Reviews', path: '/reviews' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: List, label: 'Lists', path: '/lists' },
];

const bottomItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
];

export default function Sidebar() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="fixed left-0 top-0 h-screen w-44 bg-[#0d0d0d] border-r border-white/5 flex flex-col z-50">
            {/* Лого */}
            <div className="px-5 py-6">
                <Link to="/">
                    <span className="text-xl font-bold text-white">CineVerse</span>
                    <p className="text-xs text-gray-500 mt-0.5">Cinema Social Network</p>
                </Link>
            </div>

            {/* Основная навигация */}
            <nav className="flex-1 px-3 space-y-1">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                            isActive(path)
                                ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>

            {/* Write a Review */}
            {isAuthenticated && (
                <div className="px-4 py-4">
                    <Link
                        to="/reviews/new"
                        className="flex items-center gap-2 w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border border-cyan-500/30"
                    >
                        <PenSquare size={16} />
                        Write a Review
                    </Link>
                </div>
            )}

            {/* Нижняя навигация */}
            <div className="px-3 pb-6 space-y-1 border-t border-white/5 pt-4">
                {bottomItems.map(({ icon: Icon, label, path }) => (
                    <Link
                        key={path}
                        to={path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </Link>
                ))}
            </div>
        </aside>
    );
}