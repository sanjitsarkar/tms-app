import React from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Calendar,
    Weight,
    DollarSign,
    MoreVertical,
    Flag,
    Edit,
    Trash2,
    Eye,
    AlertTriangle
} from 'lucide-react';
import { Shipment, ShipmentStatus, Priority } from '../../types';
import { useAppSelector } from '../../store/hooks';
import { selectIsAdmin } from '../../store/slices/authSlice';

interface ShipmentTileProps {
    shipment: Shipment;
    index: number;
    onView: (shipment: Shipment) => void;
    onEdit?: (shipment: Shipment) => void;
    onDelete?: (shipment: Shipment) => void;
    onToggleFlag?: (shipment: Shipment) => void;
}

const statusColors: Record<ShipmentStatus, string> = {
    [ShipmentStatus.PENDING]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    [ShipmentStatus.PICKED_UP]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    [ShipmentStatus.IN_TRANSIT]: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    [ShipmentStatus.OUT_FOR_DELIVERY]: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    [ShipmentStatus.DELIVERED]: 'bg-green-500/20 text-green-400 border-green-500/30',
    [ShipmentStatus.CANCELLED]: 'bg-red-500/20 text-red-400 border-red-500/30',
    [ShipmentStatus.ON_HOLD]: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const priorityColors: Record<Priority, string> = {
    [Priority.LOW]: 'text-dark-400',
    [Priority.MEDIUM]: 'text-blue-400',
    [Priority.HIGH]: 'text-orange-400',
    [Priority.URGENT]: 'text-red-400',
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD'
    }).format(amount);
};

const ShipmentTile: React.FC<ShipmentTileProps> = ({
    shipment,
    index,
    onView,
    onEdit,
    onDelete,
    onToggleFlag
}) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const isAdmin = useAppSelector(selectIsAdmin);

    const handleAction = (action: () => void) => {
        setIsMenuOpen(false);
        action();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-5 hover-lift cursor-pointer relative group"
            onClick={() => onView(shipment)}
        >
            {/* Flag indicator */}
            {shipment.flagged && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Flag size={14} className="text-white" />
                </div>
            )}

            {/* Priority indicator */}
            {shipment.priority === Priority.URGENT && (
                <div className="absolute -top-2 -left-2">
                    <AlertTriangle size={20} className="text-red-400 animate-pulse" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-semibold text-white truncate">{shipment.shipperName}</h3>
                    <p className="text-sm text-dark-400 truncate">{shipment.trackingNumber}</p>
                </div>

                {/* Action menu button */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <MoreVertical size={18} className="text-dark-400" />
                    </button>

                    {/* Dropdown menu */}
                    {isMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(false);
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-0 top-full mt-1 w-40 glass-dark rounded-xl py-2 shadow-xl z-20"
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAction(() => onView(shipment));
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <Eye size={16} />
                                    View Details
                                </button>

                                {isAdmin && onEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAction(() => onEdit(shipment));
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                )}

                                {onToggleFlag && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAction(() => onToggleFlag(shipment));
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-300 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Flag size={16} className={shipment.flagged ? 'text-red-400' : ''} />
                                        {shipment.flagged ? 'Unflag' : 'Flag'}
                                    </button>
                                )}

                                {isAdmin && onDelete && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAction(() => onDelete(shipment));
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                )}
                            </motion.div>
                        </>
                    )}
                </div>
            </div>

            {/* Status badge */}
            <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[shipment.status]}`}>
                    {shipment.status.replace(/_/g, ' ')}
                </span>
            </div>

            {/* Carrier */}
            <div className="mb-3">
                <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Carrier</p>
                <p className="text-sm font-medium text-dark-200">{shipment.carrierName}</p>
            </div>

            {/* Locations */}
            <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-dark-400 line-clamp-1">{shipment.pickupLocation}</p>
                </div>
                <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-dark-400 line-clamp-1">{shipment.deliveryLocation}</p>
                </div>
            </div>

            {/* Footer info */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-dark-500" />
                    <span className="text-xs text-dark-400">{formatDate(shipment.pickupDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Weight size={12} className="text-dark-500" />
                    <span className="text-xs text-dark-400">{shipment.weight} kg</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <DollarSign size={12} className={priorityColors[shipment.priority]} />
                    <span className="text-xs text-dark-400">{formatCurrency(shipment.rate, shipment.currency)}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ShipmentTile;
