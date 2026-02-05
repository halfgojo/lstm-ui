import { Link, useLocation } from 'react-router-dom';
import { Battery, Home, BarChart3, BookOpen } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
        { path: '/analysis', label: 'Analysis', icon: BarChart3 },
        { path: '/methodology', label: 'Methodology', icon: BookOpen },
    ];

    return (
        <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                        <Battery className="w-6 h-6 text-blue-400" />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            BatteryGuard
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive(item.path)
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-300 hover:bg-slate-800'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden md:inline">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
