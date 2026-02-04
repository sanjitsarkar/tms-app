// Type definitions for the Transportation Management System

export enum ShipmentStatus {
    PENDING = 'PENDING',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    ON_HOLD = 'ON_HOLD'
}

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum UserRole {
    ADMIN = 'ADMIN',
    EMPLOYEE = 'EMPLOYEE'
}

export interface Shipment {
    id: string;
    shipperName: string;
    carrierName: string;
    pickupLocation: string;
    deliveryLocation: string;
    pickupDate: string;
    deliveryDate: string;
    status: ShipmentStatus;
    trackingNumber: string;
    weight: number;
    dimensions: string;
    rate: number;
    currency: string;
    priority: Priority;
    flagged: boolean;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: string;
}

export interface AuthPayload {
    token: string;
    user: User;
}

export interface ShipmentsResponse {
    shipments: Shipment[];
    totalCount: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface ShipmentStats {
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
    flagged: number;
}

export interface PaginationInput {
    page?: number;
    limit?: number;
}

export interface SortInput {
    field: string;
    order: 'ASC' | 'DESC';
}

export interface ShipmentFilterInput {
    status?: ShipmentStatus;
    carrierName?: string;
    shipperName?: string;
    priority?: Priority;
    flagged?: boolean;
    searchTerm?: string;
}

export interface CreateShipmentInput {
    shipperName: string;
    carrierName: string;
    pickupLocation: string;
    deliveryLocation: string;
    pickupDate: string;
    deliveryDate: string;
    weight: number;
    dimensions?: string;
    rate: number;
    currency?: string;
    priority?: Priority;
    notes?: string;
}

export interface UpdateShipmentInput {
    shipperName?: string;
    carrierName?: string;
    pickupLocation?: string;
    deliveryLocation?: string;
    pickupDate?: string;
    deliveryDate?: string;
    status?: ShipmentStatus;
    weight?: number;
    dimensions?: string;
    rate?: number;
    currency?: string;
    priority?: Priority;
    flagged?: boolean;
    notes?: string;
}

// View types
export type ViewMode = 'grid' | 'tile';

// Menu items
export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    path?: string;
    children?: MenuItem[];
}
