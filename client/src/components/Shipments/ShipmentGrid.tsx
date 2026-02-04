import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpDown,
    Flag,
    Edit,
    Trash2,
    Eye,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import { Shipment, ShipmentStatus, Priority, SortInput } from '../../types';
import { useAppSelector } from '../../store/hooks';
import { selectIsAdmin } from '../../store/slices/authSlice';

interface ShipmentGridProps {
    shipments: Shipment[];
    sort: SortInput;
    onSort: (field: string) => void;
    onView: (shipment: Shipment) => void;
    onEdit?: (shipment: Shipment) => void;
    onDelete?: (shipment: Shipment) => void;
    onToggleFlag?: (shipment: Shipment) => void;
}

const statusColors: Record<ShipmentStatus, string> = {
    [ShipmentStatus.PENDING]: 'bg-yellow-500/20 text-yellow-400',
    [ShipmentStatus.PICKED_UP]: 'bg-blue-500/20 text-blue-400',
    [ShipmentStatus.IN_TRANSIT]: 'bg-cyan-500/20 text-cyan-400',
    [ShipmentStatus.OUT_FOR_DELIVERY]: 'bg-purple-500/20 text-purple-400',
    [ShipmentStatus.DELIVERED]: 'bg-green-500/20 text-green-400',
    [ShipmentStatus.CANCELLED]: 'bg-red-500/20 text-red-400',
    [ShipmentStatus.ON_HOLD]: 'bg-orange-500/20 text-orange-400',
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
        day: 'numeric'
    });
};

const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
        minimumFractionDigits: 0
    }).format(amount);
};

interface SortHeaderProps {
    field: string;
    label: string;
    currentSort: SortInput;
    onSort: (field: string) => void;
    className?: string;
}

const SortHeader: React.FC<SortHeaderProps> = ({ field, label, currentSort, onSort, className = '' }) => {
    const isActive = currentSort.field === field;

    return (
        <th
            className={`px-4 py-3 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors ${className}`}
            onClick={() => onSort(field)}
        >
            <div className="flex items-center gap-1">
                {label}
                {isActive ? (
                    currentSort.order === 'ASC' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                ) : (
                    <ArrowUpDown size={14} className="opacity-50" />
                )}
            </div>
        </th>
    );
};

const ShipmentGrid: React.FC<ShipmentGridProps> = ({
    shipments,
    sort,
    onSort,
    onView,
    onEdit,
    onDelete,
    onToggleFlag
}) => {
    const isAdmin = useAppSelector(selectIsAdmin);

    return (
        <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                    <thead className="bg-dark-800/50">
                        <tr>
                            <SortHeader field="trackingNumber" label="Tracking #" currentSort={sort} onSort={onSort} />
                            <SortHeader field="shipperName" label="Shipper" currentSort={sort} onSort={onSort} />
                            <SortHeader field="carrierName" label="Carrier" currentSort={sort} onSort={onSort} />
                            <SortHeader field="status" label="Status" currentSort={sort} onSort={onSort} />
                            <SortHeader field="pickupLocation" label="Pickup" currentSort={sort} onSort={onSort} />
                            <SortHeader field="deliveryLocation" label="Delivery" currentSort={sort} onSort={onSort} />
                            <SortHeader field="pickupDate" label="Pickup Date" currentSort={sort} onSort={onSort} />
                            <SortHeader field="weight" label="Weight" currentSort={sort} onSort={onSort} />
                            <SortHeader field="rate" label="Rate" currentSort={sort} onSort={onSort} />
                            <SortHeader field="priority" label="Priority" currentSort={sort} onSort={onSort} />
                            <th className="px-4 py-3 text-right text-xs font-semibold text-dark-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {shipments.map((shipment, index) => (
                            <motion.tr
                                key={shipment.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.02 }}
                                className="hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => onView(shipment)}
                            >
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        {shipment.flagged && <Flag size={12} className="text-red-400" />}
                                        <span className="text-sm font-medium text-white">{shipment.trackingNumber}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-dark-300 max-w-[150px] truncate">
                                    {shipment.shipperName}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-dark-300 max-w-[120px] truncate">
                                    {shipment.carrierName}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[shipment.status]}`}>
                                        {shipment.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-dark-400 max-w-[150px] truncate" title={shipment.pickupLocation}>
                                    {shipment.pickupLocation.split(',')[0]}
                                </td>
                                <td className="px-4 py-4 text-sm text-dark-400 max-w-[150px] truncate" title={shipment.deliveryLocation}>
                                    {shipment.deliveryLocation.split(',')[0]}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-dark-400">
                                    {formatDate(shipment.pickupDate)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-dark-400">
                                    {shipment.weight} kg
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-dark-300 font-medium">
                                    {formatCurrency(shipment.rate, shipment.currency)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`text-xs font-medium ${priorityColors[shipment.priority]}`}>
                                        {shipment.priority}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onView(shipment);
                                            }}
                                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-dark-400 hover:text-white"
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {isAdmin && onEdit && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(shipment);
                                                }}
                                                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-dark-400 hover:text-white"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        )}
                                        {onToggleFlag && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onToggleFlag(shipment);
                                                }}
                                                className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${shipment.flagged ? 'text-red-400' : 'text-dark-400 hover:text-white'}`}
                                                title={shipment.flagged ? 'Unflag' : 'Flag'}
                                            >
                                                <Flag size={16} />
                                            </button>
                                        )}
                                        {isAdmin && onDelete && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(shipment);
                                                }}
                                                className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-dark-400 hover:text-red-400"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShipmentGrid;
