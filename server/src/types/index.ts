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
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    flagged: boolean;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    createdAt: string;
}

export interface AuthPayload {
    token: string;
    user: Omit<User, 'password'>;
}

export interface Context {
    user: Omit<User, 'password'> | null;
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
    priority?: string;
    flagged?: boolean;
    searchTerm?: string;
}

export interface ShipmentsResponse {
    shipments: Shipment[];
    totalCount: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
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
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
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
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    flagged?: boolean;
    notes?: string;
}
