import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    Search,
    Sun,
    Moon,
    Settings,
    User,
    Package,
    Truck,
    BarChart3
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const horizontalMenuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: <BarChart3 size={18} /> },
    { id: 'shipments', label: 'Shipments', path: '/shipments', icon: <Package size={18} /> },
    { id: 'tracking', label: 'Tracking', path: '/tracking/live', icon: <Truck size={18} /> },
    { id: 'settings', label: 'Settings', path: '/settings', icon: <Settings size={18} /> },
];

const Header: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shipments?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="h-16 glass-dark border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Horizontal Menu */}
            <nav className="hidden md:flex items-center gap-1">
                {horizontalMenuItems.map((item) => (
                    <motion.button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${location.pathname === item.path
                                ? 'bg-gradient-primary text-white shadow-glow-sm'
                                : 'text-dark-300 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </motion.button>
                ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Search */}
                <form onSubmit={handleSearch} className="hidden sm:block relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search shipments..."
                        className="w-64 pl-10 pr-4 py-2 rounded-xl bg-dark-800/50 border border-white/10 
              text-sm placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 
              focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                </form>

                {/* Theme toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-dark-300 hover:text-white"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>

                {/* Notifications */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-dark-300 hover:text-white"
                >
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                </motion.button>

                {/* User avatar */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-full bg-gradient-accent flex items-center justify-center shadow-glow-sm"
                >
                    <User size={18} className="text-white" />
                </motion.button>
            </div>
        </header>
    );
};

export default Header;
