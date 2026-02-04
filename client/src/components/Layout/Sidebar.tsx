import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Home,
    Package,
    Truck,
    BarChart3,
    Settings,
    Users,
    FileText,
    ChevronDown,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, selectIsAdmin, selectUser } from '../../store/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path?: string;
    children?: MenuItem[];
    adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/' },
    { id: 'shipments', label: 'Shipments', icon: <Package size={20} />, path: '/shipments' },
    {
        id: 'tracking',
        label: 'Tracking',
        icon: <Truck size={20} />,
        children: [
            { id: 'live-tracking', label: 'Live Tracking', icon: <></>, path: '/tracking/live' },
            { id: 'history', label: 'History', icon: <></>, path: '/tracking/history' },
        ]
    },
    {
        id: 'reports',
        label: 'Reports',
        icon: <BarChart3 size={20} />,
        children: [
            { id: 'analytics', label: 'Analytics', icon: <></>, path: '/reports/analytics' },
            { id: 'export', label: 'Export Data', icon: <></>, path: '/reports/export' },
        ]
    },
    {
        id: 'management',
        label: 'Management',
        icon: <Users size={20} />,
        adminOnly: true,
        children: [
            { id: 'users', label: 'Users', icon: <></>, path: '/management/users' },
            { id: 'carriers', label: 'Carriers', icon: <></>, path: '/management/carriers' },
        ]
    },
    { id: 'documents', label: 'Documents', icon: <FileText size={20} />, path: '/documents' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
];

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = useAppSelector(selectIsAdmin);
    const user = useAppSelector(selectUser);

    const toggleExpand = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleNavigation = (path?: string) => {
        if (path) {
            navigate(path);
            if (window.innerWidth < 1024) {
                onToggle();
            }
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onToggle}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: isOpen ? 0 : -280,
                    width: 280
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`fixed left-0 top-0 h-full z-50 glass-dark shadow-glow-md flex flex-col
          lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-sm">
                            <Truck size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gradient">TMS</h1>
                            <p className="text-xs text-dark-400">Transport Management</p>
                        </div>
                    </div>
                    <button
                        onClick={onToggle}
                        className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* User info */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center">
                            <span className="text-white font-semibold">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-dark-400 truncate">{user?.role || 'Guest'}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {filteredMenuItems.map((item) => (
                        <div key={item.id}>
                            <button
                                onClick={() => item.children ? toggleExpand(item.id) : handleNavigation(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${location.pathname === item.path
                                        ? 'bg-gradient-primary text-white shadow-glow-sm'
                                        : 'hover:bg-white/10 text-dark-300 hover:text-white'
                                    }`}
                            >
                                {item.icon}
                                <span className="flex-1 text-left font-medium">{item.label}</span>
                                {item.children && (
                                    <motion.div
                                        animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown size={16} />
                                    </motion.div>
                                )}
                            </button>

                            {/* Submenu */}
                            <AnimatePresence>
                                {item.children && expandedItems.includes(item.id) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-10 py-1 space-y-1">
                                            {item.children.map((child) => (
                                                <button
                                                    key={child.id}
                                                    onClick={() => handleNavigation(child.path)}
                                                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200
                            ${location.pathname === child.path
                                                            ? 'bg-white/10 text-primary-400'
                                                            : 'text-dark-400 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    <ChevronRight size={14} />
                                                    {child.label}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </nav>

                {/* Logout button */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Mobile menu button */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="fixed left-4 top-4 z-40 p-3 rounded-xl glass shadow-glow-sm lg:hidden"
                >
                    <Menu size={24} />
                </button>
            )}
        </>
    );
};

export default Sidebar;
