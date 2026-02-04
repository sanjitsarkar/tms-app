import { v4 as uuidv4 } from 'uuid';
import {
    getAllShipments,
    getShipmentById,
    addShipment,
    updateShipment,
    deleteShipment
} from '../data/shipments';
import { findUserByEmail, validatePassword } from '../data/users';
import {
    generateToken,
    isAdmin,
    isAuthenticated,
    AuthenticationError,
    AuthorizationError
} from '../middleware/auth';
import {
    Context,
    Shipment,
    ShipmentStatus,
    CreateShipmentInput,
    UpdateShipmentInput,
    ShipmentFilterInput,
    PaginationInput,
    SortInput,
    ShipmentsResponse
} from '../types';

// Helper function to apply filters
const applyFilters = (shipments: Shipment[], filter?: ShipmentFilterInput): Shipment[] => {
    if (!filter) return shipments;

    return shipments.filter(shipment => {
        if (filter.status && shipment.status !== filter.status) return false;
        if (filter.carrierName && !shipment.carrierName.toLowerCase().includes(filter.carrierName.toLowerCase())) return false;
        if (filter.shipperName && !shipment.shipperName.toLowerCase().includes(filter.shipperName.toLowerCase())) return false;
        if (filter.priority && shipment.priority !== filter.priority) return false;
        if (filter.flagged !== undefined && shipment.flagged !== filter.flagged) return false;
        if (filter.searchTerm) {
            const term = filter.searchTerm.toLowerCase();
            const searchableText = [
                shipment.shipperName,
                shipment.carrierName,
                shipment.trackingNumber,
                shipment.pickupLocation,
                shipment.deliveryLocation
            ].join(' ').toLowerCase();
            if (!searchableText.includes(term)) return false;
        }
        return true;
    });
};

// Helper function to apply sorting
const applySort = (shipments: Shipment[], sort?: SortInput): Shipment[] => {
    if (!sort) return shipments;

    return [...shipments].sort((a, b) => {
        const fieldA = a[sort.field as keyof Shipment];
        const fieldB = b[sort.field as keyof Shipment];

        if (fieldA === null || fieldA === undefined) return 1;
        if (fieldB === null || fieldB === undefined) return -1;

        let comparison = 0;
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
            comparison = fieldA.localeCompare(fieldB);
        } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
            comparison = fieldA - fieldB;
        } else {
            comparison = String(fieldA).localeCompare(String(fieldB));
        }

        return sort.order === 'DESC' ? -comparison : comparison;
    });
};

// Helper function to apply pagination
const applyPagination = (
    shipments: Shipment[],
    pagination?: PaginationInput
): { paginatedShipments: Shipment[]; page: number; totalPages: number } => {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const totalPages = Math.ceil(shipments.length / limit);

    return {
        paginatedShipments: shipments.slice(startIndex, startIndex + limit),
        page,
        totalPages
    };
};

const resolvers = {
    Query: {
        me: (_: unknown, __: unknown, context: Context) => {
            return context.user;
        },

        shipments: (
            _: unknown,
            args: {
                filter?: ShipmentFilterInput;
                pagination?: PaginationInput;
                sort?: SortInput
            },
            context: Context
        ): ShipmentsResponse => {
            if (!isAuthenticated(context.user)) {
                throw new AuthenticationError();
            }

            let shipments = getAllShipments();

            // Apply filters
            shipments = applyFilters(shipments, args.filter);

            // Apply sorting
            shipments = applySort(shipments, args.sort);

            const totalCount = shipments.length;

            // Apply pagination
            const { paginatedShipments, page, totalPages } = applyPagination(shipments, args.pagination);

            return {
                shipments: paginatedShipments,
                totalCount,
                page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            };
        },

        shipment: (_: unknown, args: { id: string }, context: Context): Shipment | null => {
            if (!isAuthenticated(context.user)) {
                throw new AuthenticationError();
            }

            const shipment = getShipmentById(args.id);
            return shipment || null;
        },

        shipmentStats: (_: unknown, __: unknown, context: Context) => {
            if (!isAuthenticated(context.user)) {
                throw new AuthenticationError();
            }

            const shipments = getAllShipments();

            return {
                total: shipments.length,
                pending: shipments.filter(s => s.status === ShipmentStatus.PENDING).length,
                inTransit: shipments.filter(s => s.status === ShipmentStatus.IN_TRANSIT).length,
                delivered: shipments.filter(s => s.status === ShipmentStatus.DELIVERED).length,
                cancelled: shipments.filter(s => s.status === ShipmentStatus.CANCELLED).length,
                flagged: shipments.filter(s => s.flagged).length
            };
        }
    },

    Mutation: {
        login: async (_: unknown, args: { email: string; password: string }) => {
            const user = findUserByEmail(args.email);

            if (!user) {
                throw new AuthenticationError('Invalid email or password');
            }

            const validPassword = await validatePassword(args.password, user.password);

            if (!validPassword) {
                throw new AuthenticationError('Invalid email or password');
            }

            const token = generateToken(user);
            const { password, ...userWithoutPassword } = user;

            return {
                token,
                user: userWithoutPassword
            };
        },

        createShipment: (
            _: unknown,
            args: { input: CreateShipmentInput },
            context: Context
        ): Shipment => {
            if (!isAuthenticated(context.user)) {
                throw new AuthenticationError();
            }

            if (!isAdmin(context.user)) {
                throw new AuthorizationError('Only admins can create shipments');
            }

            const now = new Date().toISOString();
            const newShipment: Shipment = {
                id: uuidv4(),
                ...args.input,
                dimensions: args.input.dimensions || '0x0x0 cm',
                currency: args.input.currency || 'USD',
                priority: args.input.priority || 'MEDIUM',
                status: ShipmentStatus.PENDING,
                trackingNumber: `TRK${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                flagged: false,
                notes: args.input.notes || null,
                createdAt: now,
                updatedAt: now
            };

            return addShipment(newShipment);
        },

        updateShipment: (
            _: unknown,
            args: { id: string; input: UpdateShipmentInput },
            context: Context
        ): Shipment => {
            if (!isAuthenticated(context.user)) {
                throw new AuthenticationError();
            }

            if (!isAdmin(context.user)) {
                throw new AuthorizationError('Only admins can update shipments');
            }

            const shipment = getShipmentById(args.id);

            if (!shipment) {
                throw new Error('Shipment not found');
            }

            const updated = updateShipment(args.id, args.input);

            if (!updated) {
                throw new Error('Failed to update shipment');
            }

            return updated;
        },

        deleteShipment: (_: unknown, args: { id: string }, context: Context): boolean => {
            if (!isAuthenticated(context.user)) {
                throw new AuthenticationError();
            }

            if (!isAdmin(context.user)) {
                throw new AuthorizationError('Only admins can delete shipments');
            }

            return deleteShipment(args.id);
        },

        toggleShipmentFlag: (_: unknown, args: { id: string }, context: Context): Shipment => {
            if (!isAuthenticated(context.user)) {
                throw new AuthenticationError();
            }

            const shipment = getShipmentById(args.id);

            if (!shipment) {
                throw new Error('Shipment not found');
            }

            const updated = updateShipment(args.id, { flagged: !shipment.flagged });

            if (!updated) {
                throw new Error('Failed to toggle flag');
            }

            return updated;
        }
    }
};

export default resolvers;
