import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@apollo/client';
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Flag,
    TrendingUp,
    ArrowRight
} from 'lucide-react';
import { GET_SHIPMENT_STATS, GET_SHIPMENTS } from '../graphql/queries';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setStats, setShipments, selectStats } from '../store/slices/shipmentsSlice';
import { selectUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Shipment, ShipmentStatus } from '../types';

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const stats = useAppSelector(selectStats);
    const user = useAppSelector(selectUser);

    const { data: statsData } = useQuery(GET_SHIPMENT_STATS, {
        onCompleted: (data) => {
            dispatch(setStats(data.shipmentStats));
        }
    });

    const { data: shipmentsData } = useQuery(GET_SHIPMENTS, {
        variables: {
            pagination: { page: 1, limit: 5 },
            sort: { field: 'createdAt', order: 'DESC' }
        },
        onCompleted: (data) => {
            dispatch(setShipments(data.shipments));
        }
    });

    const statCards = [
        {
            label: 'Total Shipments',
            value: stats?.total || 0,
            icon: <Package size={24} />,
            color: 'from-primary-500 to-primary-600',
            textColor: 'text-primary-400',
            bgColor: 'bg-primary-500/20'
        },
        {
            label: 'In Transit',
            value: stats?.inTransit || 0,
            icon: <Truck size={24} />,
            color: 'from-cyan-500 to-cyan-600',
            textColor: 'text-cyan-400',
            bgColor: 'bg-cyan-500/20'
        },
        {
            label: 'Delivered',
            value: stats?.delivered || 0,
            icon: <CheckCircle size={24} />,
            color: 'from-green-500 to-green-600',
            textColor: 'text-green-400',
            bgColor: 'bg-green-500/20'
        },
        {
            label: 'Pending',
            value: stats?.pending || 0,
            icon: <Clock size={24} />,
            color: 'from-yellow-500 to-yellow-600',
            textColor: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20'
        },
        {
            label: 'Cancelled',
            value: stats?.cancelled || 0,
            icon: <XCircle size={24} />,
            color: 'from-red-500 to-red-600',
            textColor: 'text-red-400',
            bgColor: 'bg-red-500/20'
        },
        {
            label: 'Flagged',
            value: stats?.flagged || 0,
            icon: <Flag size={24} />,
            color: 'from-orange-500 to-orange-600',
            textColor: 'text-orange-400',
            bgColor: 'bg-orange-500/20'
        },
    ];

    const recentShipments = shipmentsData?.shipments?.shipments || [];

    const getStatusColor = (status: ShipmentStatus) => {
        const colors: Record<ShipmentStatus, string> = {
            [ShipmentStatus.PENDING]: 'bg-yellow-500/20 text-yellow-400',
            [ShipmentStatus.PICKED_UP]: 'bg-blue-500/20 text-blue-400',
            [ShipmentStatus.IN_TRANSIT]: 'bg-cyan-500/20 text-cyan-400',
            [ShipmentStatus.OUT_FOR_DELIVERY]: 'bg-purple-500/20 text-purple-400',
            [ShipmentStatus.DELIVERED]: 'bg-green-500/20 text-green-400',
            [ShipmentStatus.CANCELLED]: 'bg-red-500/20 text-red-400',
            [ShipmentStatus.ON_HOLD]: 'bg-orange-500/20 text-orange-400',
        };
        return colors[status];
    };

    return (
        <div className="space-y-8">
            {/* Welcome header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
                    </h1>
                    <p className="text-dark-400">Here's what's happening with your shipments today.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/shipments')}
                    className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold shadow-glow-sm hover:shadow-glow-md transition-all"
                >
                    <Package size={20} />
                    View All Shipments
                </motion.button>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="glass rounded-2xl p-5 hover-lift cursor-pointer"
                        onClick={() => navigate('/shipments')}
                    >
                        <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
                            <span className={stat.textColor}>{stat.icon}</span>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-sm text-dark-400">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent shipments and chart */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent shipments */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">Recent Shipments</h2>
                        <button
                            onClick={() => navigate('/shipments')}
                            className="flex items-center gap-1 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            View all
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {recentShipments.map((shipment: Shipment, index: number) => (
                            <motion.div
                                key={shipment.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 transition-colors cursor-pointer"
                                onClick={() => navigate('/shipments')}
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                                    <Package size={18} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{shipment.trackingNumber}</p>
                                    <p className="text-xs text-dark-400 truncate">{shipment.shipperName}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                                    {shipment.status.replace(/_/g, ' ')}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick actions and performance */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp size={24} className="text-primary-400" />
                        <h2 className="text-xl font-semibold text-white">Performance Overview</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Delivery rate */}
                        <div className="p-4 rounded-xl bg-dark-800/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-dark-400">Delivery Rate</span>
                                <span className="text-sm font-semibold text-green-400">
                                    {stats?.total ? ((stats.delivered / stats.total) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats?.total ? (stats.delivered / stats.total) * 100 : 0}%` }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                                />
                            </div>
                        </div>

                        {/* In transit rate */}
                        <div className="p-4 rounded-xl bg-dark-800/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-dark-400">In Transit</span>
                                <span className="text-sm font-semibold text-cyan-400">
                                    {stats?.total ? ((stats.inTransit / stats.total) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats?.total ? (stats.inTransit / stats.total) * 100 : 0}%` }}
                                    transition={{ delay: 0.6, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Pending rate */}
                        <div className="p-4 rounded-xl bg-dark-800/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-dark-400">Pending</span>
                                <span className="text-sm font-semibold text-yellow-400">
                                    {stats?.total ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats?.total ? (stats.pending / stats.total) * 100 : 0}%` }}
                                    transition={{ delay: 0.7, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Cancellation rate */}
                        <div className="p-4 rounded-xl bg-dark-800/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-dark-400">Cancellation Rate</span>
                                <span className="text-sm font-semibold text-red-400">
                                    {stats?.total ? ((stats.cancelled / stats.total) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats?.total ? (stats.cancelled / stats.total) * 100 : 0}%` }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
