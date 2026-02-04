import { v4 as uuidv4 } from 'uuid';
import { Shipment, ShipmentStatus } from '../types';

// Realistic carrier names
const carriers = [
    'FedEx', 'UPS', 'DHL Express', 'USPS', 'Amazon Logistics',
    'XPO Logistics', 'J.B. Hunt', 'Schneider', 'Swift Transportation',
    'Werner Enterprises', 'Old Dominion', 'Estes Express', 'YRC Freight',
    'Saia LTL Freight', 'ABF Freight'
];

// Realistic shipper company names
const shippers = [
    'Tech Solutions Inc.', 'Global Electronics Ltd.', 'Prime Manufacturing Co.',
    'Summit Industries', 'Pacific Trade Corp.', 'Atlantic Imports LLC',
    'Mountain View Supplies', 'Sunrise Distribution', 'Metro Logistics Group',
    'Continental Goods Inc.', 'Apex Trading Co.', 'Liberty Exports',
    'Gateway Enterprises', 'Pioneer Products', 'Stellar Commodities'
];

// Realistic locations
const locations = [
    { city: 'New York', state: 'NY', address: '123 Broadway Ave' },
    { city: 'Los Angeles', state: 'CA', address: '456 Sunset Blvd' },
    { city: 'Chicago', state: 'IL', address: '789 Michigan Ave' },
    { city: 'Houston', state: 'TX', address: '321 Main St' },
    { city: 'Phoenix', state: 'AZ', address: '654 Desert Rd' },
    { city: 'Philadelphia', state: 'PA', address: '987 Liberty Ave' },
    { city: 'San Antonio', state: 'TX', address: '147 Alamo Plaza' },
    { city: 'San Diego', state: 'CA', address: '258 Harbor Dr' },
    { city: 'Dallas', state: 'TX', address: '369 Commerce St' },
    { city: 'San Jose', state: 'CA', address: '741 Tech Park Way' },
    { city: 'Austin', state: 'TX', address: '852 Congress Ave' },
    { city: 'Jacksonville', state: 'FL', address: '963 Ocean Blvd' },
    { city: 'Seattle', state: 'WA', address: '159 Pike St' },
    { city: 'Denver', state: 'CO', address: '357 Mountain View Rd' },
    { city: 'Boston', state: 'MA', address: '468 Harbor Walk' },
    { city: 'Atlanta', state: 'GA', address: '579 Peachtree St' },
    { city: 'Miami', state: 'FL', address: '680 Biscayne Blvd' },
    { city: 'Portland', state: 'OR', address: '791 Pearl District Way' },
    { city: 'Las Vegas', state: 'NV', address: '802 Strip Ave' },
    { city: 'Minneapolis', state: 'MN', address: '913 Nicollet Mall' }
];

const statuses = Object.values(ShipmentStatus);
const priorities: Array<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const currencies = ['USD', 'EUR', 'GBP', 'CAD'];

// Generate random date within range
const randomDate = (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate tracking number
const generateTrackingNumber = (): string => {
    const prefix = ['TRK', 'SHP', 'PKG', 'FRT'][Math.floor(Math.random() * 4)];
    const numbers = Math.random().toString().slice(2, 14);
    return `${prefix}${numbers}`;
};

// Format location
const formatLocation = (loc: typeof locations[0]): string => {
    return `${loc.address}, ${loc.city}, ${loc.state}`;
};

// Generate shipments
const generateShipments = (count: number): Shipment[] => {
    const shipments: Shipment[] = [];
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const oneMonthAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < count; i++) {
        const pickupLoc = locations[Math.floor(Math.random() * locations.length)];
        let deliveryLoc = locations[Math.floor(Math.random() * locations.length)];
        while (deliveryLoc === pickupLoc) {
            deliveryLoc = locations[Math.floor(Math.random() * locations.length)];
        }

        const pickupDate = randomDate(threeMonthsAgo, now);
        const deliveryDate = randomDate(pickupDate, oneMonthAhead);
        const createdAt = randomDate(threeMonthsAgo, pickupDate);

        const shipment: Shipment = {
            id: uuidv4(),
            shipperName: shippers[Math.floor(Math.random() * shippers.length)],
            carrierName: carriers[Math.floor(Math.random() * carriers.length)],
            pickupLocation: formatLocation(pickupLoc),
            deliveryLocation: formatLocation(deliveryLoc),
            pickupDate: pickupDate.toISOString(),
            deliveryDate: deliveryDate.toISOString(),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            trackingNumber: generateTrackingNumber(),
            weight: Math.round((Math.random() * 5000 + 10) * 100) / 100,
            dimensions: `${Math.floor(Math.random() * 100 + 10)}x${Math.floor(Math.random() * 100 + 10)}x${Math.floor(Math.random() * 100 + 10)} cm`,
            rate: Math.round((Math.random() * 5000 + 100) * 100) / 100,
            currency: currencies[Math.floor(Math.random() * currencies.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            flagged: Math.random() > 0.85,
            notes: Math.random() > 0.7 ? 'Handle with care - Fragile contents' : null,
            createdAt: createdAt.toISOString(),
            updatedAt: createdAt.toISOString()
        };

        shipments.push(shipment);
    }

    // Sort by creation date descending
    return shipments.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

// Generate 50 shipments
const shipments: Shipment[] = generateShipments(50);

// Data access functions
export const getAllShipments = (): Shipment[] => [...shipments];

export const getShipmentById = (id: string): Shipment | undefined =>
    shipments.find(s => s.id === id);

export const addShipment = (shipment: Shipment): Shipment => {
    shipments.unshift(shipment);
    return shipment;
};

export const updateShipment = (id: string, updates: Partial<Shipment>): Shipment | null => {
    const index = shipments.findIndex(s => s.id === id);
    if (index === -1) return null;

    shipments[index] = {
        ...shipments[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };
    return shipments[index];
};

export const deleteShipment = (id: string): boolean => {
    const index = shipments.findIndex(s => s.id === id);
    if (index === -1) return false;

    shipments.splice(index, 1);
    return true;
};

export default shipments;
