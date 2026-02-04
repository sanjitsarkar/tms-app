import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    MapPin,
    Calendar,
    Weight,
    DollarSign,
    Package,
    Truck,
    Flag,
    Clock,
    FileText,
    Ruler,
    Edit,
    Trash2
} from 'lucide-react';
import { Shipment, ShipmentStatus, Priority } from '../../types';
import { useAppSelector } from '../../store/hooks';
import { selectIsAdmin } from '../../store/slices/authSlice';

interface ShipmentDetailProps {
    shipment: Shipment | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (shipment: Shipment) => void;
    onDelete?: (shipment: Shipment) => void;
    onToggleFlag?: (shipment: Shipment) => void;
}

const statusColors: Record<ShipmentStatus, { bg: string; text: string; glow: string }> = {
    [ShipmentStatus.PENDING]: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
    [ShipmentStatus.PICKED_UP]: { bg: 'bg-blue-500/20', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    [ShipmentStatus.IN_TRANSIT]: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    [ShipmentStatus.OUT_FOR_DELIVERY]: { bg: 'bg-purple-500/20', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
    [ShipmentStatus.DELIVERED]: { bg: 'bg-green-500/20', text: 'text-green-400', glow: 'shadow-green-500/20' },
    [ShipmentStatus.CANCELLED]: { bg: 'bg-red-500/20', text: 'text-red-400', glow: 'shadow-red-500/20' },
    [ShipmentStatus.ON_HOLD]: { bg: 'bg-orange-500/20', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
};

const priorityInfo: Record<Priority, { label: string; color: string }> = {
    [Priority.LOW]: { label: 'Low Priority', color: 'text-dark-400' },
    [Priority.MEDIUM]: { label: 'Medium Priority', color: 'text-blue-400' },
    [Priority.HIGH]: { label: 'High Priority', color: 'text-orange-400' },
    [Priority.URGENT]: { label: 'Urgent', color: 'text-red-400' },
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
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

const ShipmentDetail: React.FC<ShipmentDetailProps> = ({
    shipment,
    isOpen,
    onClose,
    onEdit,
    onDelete,
    onToggleFlag
}) => {
    const isAdmin = useAppSelector(selectIsAdmin);

    if (!shipment) return null;

    const statusStyle = statusColors[shipment.status];
    const priorityStyle = priorityInfo[shipment.priority];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
              md:w-full md:max-w-3xl md:max-h-[85vh] z-50 glass-dark rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="relative p-6 border-b border-white/10">
                            <div className={`absolute inset-0 ${statusStyle.bg} opacity-30`} />
                            <div className="relative flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                            {shipment.status.replace(/_/g, ' ')}
                                        </span>
                                        <span className={`text-sm font-medium ${priorityStyle.color}`}>
                                            {priorityStyle.label}
                                        </span>
                                        {shipment.flagged && (
                                            <span className="flex items-center gap-1 text-red-400 text-sm">
                                                <Flag size={14} />
                                                Flagged
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{shipment.trackingNumber}</h2>
                                    <p className="text-dark-400">{shipment.shipperName}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-white/10 transition-colors text-dark-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Carrier info */}
                            <div className="glass rounded-2xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                                        <Truck size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-dark-500 uppercase tracking-wider">Carrier</p>
                                        <p className="text-lg font-semibold text-white">{shipment.carrierName}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Locations */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="glass rounded-2xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <MapPin size={20} className="text-green-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Pickup Location</p>
                                            <p className="text-sm text-white">{shipment.pickupLocation}</p>
                                            <div className="flex items-center gap-1 mt-2 text-dark-400">
                                                <Calendar size={12} />
                                                <span className="text-xs">{formatDate(shipment.pickupDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass rounded-2xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                            <MapPin size={20} className="text-red-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Delivery Location</p>
                                            <p className="text-sm text-white">{shipment.deliveryLocation}</p>
                                            <div className="flex items-center gap-1 mt-2 text-dark-400">
                                                <Calendar size={12} />
                                                <span className="text-xs">{formatDate(shipment.deliveryDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="glass rounded-xl p-4 text-center">
                                    <Weight size={24} className="mx-auto mb-2 text-primary-400" />
                                    <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Weight</p>
                                    <p className="text-lg font-semibold text-white">{shipment.weight} kg</p>
                                </div>

                                <div className="glass rounded-xl p-4 text-center">
                                    <Ruler size={24} className="mx-auto mb-2 text-accent-400" />
                                    <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Dimensions</p>
                                    <p className="text-lg font-semibold text-white">{shipment.dimensions}</p>
                                </div>

                                <div className="glass rounded-xl p-4 text-center">
                                    <DollarSign size={24} className="mx-auto mb-2 text-green-400" />
                                    <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Rate</p>
                                    <p className="text-lg font-semibold text-white">{formatCurrency(shipment.rate, shipment.currency)}</p>
                                </div>

                                <div className="glass rounded-xl p-4 text-center">
                                    <Package size={24} className="mx-auto mb-2 text-cyan-400" />
                                    <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Currency</p>
                                    <p className="text-lg font-semibold text-white">{shipment.currency}</p>
                                </div>
                            </div>

                            {/* Notes */}
                            {shipment.notes && (
                                <div className="glass rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText size={16} className="text-dark-500" />
                                        <p className="text-xs text-dark-500 uppercase tracking-wider">Notes</p>
                                    </div>
                                    <p className="text-sm text-dark-300">{shipment.notes}</p>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="flex items-center justify-between text-xs text-dark-500 pt-4 border-t border-white/10">
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>Created: {formatDate(shipment.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>Updated: {formatDate(shipment.updatedAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div className="p-6 border-t border-white/10 flex items-center justify-between gap-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl border border-white/20 text-dark-300 hover:text-white hover:bg-white/10 transition-all font-medium"
                            >
                                Close
                            </button>

                            <div className="flex items-center gap-2">
                                {onToggleFlag && (
                                    <button
                                        onClick={() => onToggleFlag(shipment)}
                                        className={`p-2.5 rounded-xl transition-all ${shipment.flagged
                                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                : 'border border-white/20 text-dark-400 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <Flag size={20} />
                                    </button>
                                )}

                                {isAdmin && onEdit && (
                                    <button
                                        onClick={() => onEdit(shipment)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-white font-medium shadow-glow-sm hover:shadow-glow-md transition-all"
                                    >
                                        <Edit size={18} />
                                        Edit Shipment
                                    </button>
                                )}

                                {isAdmin && onDelete && (
                                    <button
                                        onClick={() => onDelete(shipment)}
                                        className="p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShipmentDetail;
