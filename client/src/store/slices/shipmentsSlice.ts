import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    Shipment,
    ViewMode,
    ShipmentFilterInput,
    SortInput,
    ShipmentStats
} from '../../types';

interface ShipmentsState {
    items: Shipment[];
    selectedShipment: Shipment | null;
    viewMode: ViewMode;
    isLoading: boolean;
    error: string | null;
    filter: ShipmentFilterInput;
    sort: SortInput;
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
    stats: ShipmentStats | null;
    isDetailModalOpen: boolean;
}

const initialState: ShipmentsState = {
    items: [],
    selectedShipment: null,
    viewMode: 'tile',
    isLoading: false,
    error: null,
    filter: {},
    sort: { field: 'createdAt', order: 'DESC' },
    pagination: {
        page: 1,
        limit: 12,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    stats: null,
    isDetailModalOpen: false,
};

const shipmentsSlice = createSlice({
    name: 'shipments',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setShipments: (state, action: PayloadAction<{
            shipments: Shipment[];
            totalCount: number;
            page: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        }>) => {
            state.items = action.payload.shipments;
            state.pagination = {
                ...state.pagination,
                totalCount: action.payload.totalCount,
                page: action.payload.page,
                totalPages: action.payload.totalPages,
                hasNextPage: action.payload.hasNextPage,
                hasPrevPage: action.payload.hasPrevPage,
            };
            state.isLoading = false;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        setViewMode: (state, action: PayloadAction<ViewMode>) => {
            state.viewMode = action.payload;
        },
        setSelectedShipment: (state, action: PayloadAction<Shipment | null>) => {
            state.selectedShipment = action.payload;
            state.isDetailModalOpen = action.payload !== null;
        },
        closeDetailModal: (state) => {
            state.isDetailModalOpen = false;
            state.selectedShipment = null;
        },
        setFilter: (state, action: PayloadAction<ShipmentFilterInput>) => {
            state.filter = action.payload;
            state.pagination.page = 1; // Reset to first page on filter change
        },
        setSort: (state, action: PayloadAction<SortInput>) => {
            state.sort = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.pagination.page = action.payload;
        },
        setLimit: (state, action: PayloadAction<number>) => {
            state.pagination.limit = action.payload;
            state.pagination.page = 1; // Reset to first page on limit change
        },
        setStats: (state, action: PayloadAction<ShipmentStats>) => {
            state.stats = action.payload;
        },
        updateShipment: (state, action: PayloadAction<Shipment>) => {
            const index = state.items.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
            if (state.selectedShipment?.id === action.payload.id) {
                state.selectedShipment = action.payload;
            }
        },
        addShipment: (state, action: PayloadAction<Shipment>) => {
            state.items.unshift(action.payload);
            state.pagination.totalCount += 1;
        },
        removeShipment: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(s => s.id !== action.payload);
            state.pagination.totalCount -= 1;
            if (state.selectedShipment?.id === action.payload) {
                state.selectedShipment = null;
                state.isDetailModalOpen = false;
            }
        },
        clearFilter: (state) => {
            state.filter = {};
            state.pagination.page = 1;
        },
    },
});

export const {
    setLoading,
    setShipments,
    setError,
    setViewMode,
    setSelectedShipment,
    closeDetailModal,
    setFilter,
    setSort,
    setPage,
    setLimit,
    setStats,
    updateShipment,
    addShipment,
    removeShipment,
    clearFilter,
} = shipmentsSlice.actions;

// Selectors
export const selectShipments = (state: { shipments: ShipmentsState }) => state.shipments.items;
export const selectSelectedShipment = (state: { shipments: ShipmentsState }) => state.shipments.selectedShipment;
export const selectViewMode = (state: { shipments: ShipmentsState }) => state.shipments.viewMode;
export const selectIsLoading = (state: { shipments: ShipmentsState }) => state.shipments.isLoading;
export const selectPagination = (state: { shipments: ShipmentsState }) => state.shipments.pagination;
export const selectFilter = (state: { shipments: ShipmentsState }) => state.shipments.filter;
export const selectSort = (state: { shipments: ShipmentsState }) => state.shipments.sort;
export const selectStats = (state: { shipments: ShipmentsState }) => state.shipments.stats;
export const selectIsDetailModalOpen = (state: { shipments: ShipmentsState }) => state.shipments.isDetailModalOpen;

export default shipmentsSlice.reducer;
