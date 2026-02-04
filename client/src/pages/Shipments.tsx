import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@apollo/client';
import {
    Plus,
    Search,
    Filter,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Loader2,
    X
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { GET_SHIPMENTS, DELETE_SHIPMENT, TOGGLE_SHIPMENT_FLAG } from '../graphql/queries';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    setShipments,
    setLoading,
    setSelectedShipment,
    closeDetailModal,
    setViewMode,
    setFilter,
    setSort,
    setPage,
    updateShipment,
    removeShipment,
    selectShipments,
    selectSelectedShipment,
    selectViewMode,
    selectIsLoading,
    selectPagination,
    selectFilter,
    selectSort,
    selectIsDetailModalOpen
} from '../store/slices/shipmentsSlice';
import { selectIsAdmin } from '../store/slices/authSlice';
import {
    ShipmentTile,
    ShipmentGrid,
    ShipmentDetail,
    ViewToggle
} from '../components/Shipments';
import { Shipment, ShipmentStatus, Priority, ViewMode } from '../types';

const Shipments: React.FC = () => {
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<ShipmentStatus | ''>('');
    const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');

    const shipments = useAppSelector(selectShipments);
    const selectedShipment = useAppSelector(selectSelectedShipment);
    const viewMode = useAppSelector(selectViewMode);
    const isLoading = useAppSelector(selectIsLoading);
    const pagination = useAppSelector(selectPagination);
    const filter = useAppSelector(selectFilter);
    const sort = useAppSelector(selectSort);
    const isDetailModalOpen = useAppSelector(selectIsDetailModalOpen);
    const isAdmin = useAppSelector(selectIsAdmin);

    const { refetch, loading } = useQuery(GET_SHIPMENTS, {
        variables: {
            filter: {
                ...filter,
                searchTerm: searchTerm || undefined,
                status: statusFilter || undefined,
                priority: priorityFilter || undefined
            },
            pagination: { page: pagination.page, limit: pagination.limit },
            sort
        },
        onCompleted: (data) => {
            dispatch(setShipments(data.shipments));
        },
        fetchPolicy: 'cache-and-network'
    });

    const [deleteShipmentMutation] = useMutation(DELETE_SHIPMENT, {
        onCompleted: (_, { variables }) => {
            if (variables?.id) {
                dispatch(removeShipment(variables.id));
            }
        }
    });

    const [toggleFlagMutation] = useMutation(TOGGLE_SHIPMENT_FLAG, {
        onCompleted: (data) => {
            dispatch(updateShipment(data.toggleShipmentFlag));
        }
    });

    useEffect(() => {
        dispatch(setLoading(loading));
    }, [loading, dispatch]);

    const handleViewShipment = (shipment: Shipment) => {
        dispatch(setSelectedShipment(shipment));
    };

    const handleCloseDetail = () => {
        dispatch(closeDetailModal());
    };

    const handleEditShipment = (shipment: Shipment) => {
        // In a full implementation, this would open an edit modal
        console.log('Edit shipment:', shipment.id);
    };

    const handleDeleteShipment = async (shipment: Shipment) => {
        if (window.confirm('Are you sure you want to delete this shipment?')) {
            await deleteShipmentMutation({ variables: { id: shipment.id } });
        }
    };

    const handleToggleFlag = async (shipment: Shipment) => {
        await toggleFlagMutation({ variables: { id: shipment.id } });
    };

    const handleViewModeChange = (mode: ViewMode) => {
        dispatch(setViewMode(mode));
    };

    const handleSort = (field: string) => {
        dispatch(setSort({
            field,
            order: sort.field === field && sort.order === 'ASC' ? 'DESC' : 'ASC'
        }));
    };

    const handlePageChange = (newPage: number) => {
        dispatch(setPage(newPage));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setPriorityFilter('');
        dispatch(setFilter({}));
        refetch();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Shipments</h1>
                    <p className="text-dark-400">{pagination.totalCount} total shipments</p>
                </div>

                <div className="flex items-center gap-3">
                    <ViewToggle viewMode={viewMode} onViewChange={handleViewModeChange} />

                    {isAdmin && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-white font-medium shadow-glow-sm hover:shadow-glow-md transition-all"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add Shipment</span>
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by tracking number, shipper, carrier..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl glass border border-white/10 
              text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 
              focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                </form>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all
              ${isFilterOpen || statusFilter || priorityFilter
                                ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                                : 'glass border-white/10 text-dark-300 hover:text-white'}`}
                    >
                        <Filter size={18} />
                        <span className="hidden sm:inline">Filters</span>
                    </button>

                    <button
                        onClick={() => refetch()}
                        className="p-3 rounded-xl glass border border-white/10 text-dark-300 hover:text-white transition-all"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Filter panel */}
            {isFilterOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass rounded-2xl p-4"
                >
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs text-dark-500 uppercase mb-2">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | '')}
                                className="w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-white/10 
                  text-white focus:outline-none focus:border-primary-500/50 transition-all"
                            >
                                <option value="">All Statuses</option>
                                {Object.values(ShipmentStatus).map(status => (
                                    <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs text-dark-500 uppercase mb-2">Priority</label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
                                className="w-full px-4 py-2.5 rounded-xl bg-dark-800/50 border border-white/10 
                  text-white focus:outline-none focus:border-primary-500/50 transition-all"
                            >
                                <option value="">All Priorities</option>
                                {Object.values(Priority).map(priority => (
                                    <option key={priority} value={priority}>{priority}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                onClick={() => refetch()}
                                className="px-4 py-2.5 rounded-xl bg-gradient-primary text-white font-medium"
                            >
                                Apply
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2.5 rounded-xl border border-white/10 text-dark-300 hover:text-white transition-all"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Content */}
            {isLoading && shipments.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={40} className="animate-spin text-primary-500" />
                </div>
            ) : shipments.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-dark-400 text-lg">No shipments found</p>
                    <p className="text-dark-500 text-sm mt-2">Try adjusting your search or filters</p>
                </div>
            ) : viewMode === 'tile' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {shipments.map((shipment, index) => (
                        <ShipmentTile
                            key={shipment.id}
                            shipment={shipment}
                            index={index}
                            onView={handleViewShipment}
                            onEdit={isAdmin ? handleEditShipment : undefined}
                            onDelete={isAdmin ? handleDeleteShipment : undefined}
                            onToggleFlag={handleToggleFlag}
                        />
                    ))}
                </div>
            ) : (
                <ShipmentGrid
                    shipments={shipments}
                    sort={sort}
                    onSort={handleSort}
                    onView={handleViewShipment}
                    onEdit={isAdmin ? handleEditShipment : undefined}
                    onDelete={isAdmin ? handleDeleteShipment : undefined}
                    onToggleFlag={handleToggleFlag}
                />
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-dark-400">
                        Page {pagination.page} of {pagination.totalPages}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={!pagination.hasPrevPage}
                            className="p-2 rounded-xl glass border border-white/10 text-dark-300 hover:text-white 
                transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const pageNum = pagination.page - 2 + i;
                            if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-10 h-10 rounded-xl font-medium transition-all
                    ${pagination.page === pageNum
                                            ? 'bg-gradient-primary text-white shadow-glow-sm'
                                            : 'glass border border-white/10 text-dark-300 hover:text-white'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={!pagination.hasNextPage}
                            className="p-2 rounded-xl glass border border-white/10 text-dark-300 hover:text-white 
                transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Detail modal */}
            <ShipmentDetail
                shipment={selectedShipment}
                isOpen={isDetailModalOpen}
                onClose={handleCloseDetail}
                onEdit={isAdmin ? handleEditShipment : undefined}
                onDelete={isAdmin ? handleDeleteShipment : undefined}
                onToggleFlag={handleToggleFlag}
            />
        </div>
    );
};

export default Shipments;
