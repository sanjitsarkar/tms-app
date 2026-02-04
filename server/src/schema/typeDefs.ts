const typeDefs = `#graphql
  enum ShipmentStatus {
    PENDING
    PICKED_UP
    IN_TRANSIT
    OUT_FOR_DELIVERY
    DELIVERED
    CANCELLED
    ON_HOLD
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  enum UserRole {
    ADMIN
    EMPLOYEE
  }

  enum SortOrder {
    ASC
    DESC
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Shipment {
    id: ID!
    shipperName: String!
    carrierName: String!
    pickupLocation: String!
    deliveryLocation: String!
    pickupDate: String!
    deliveryDate: String!
    status: ShipmentStatus!
    trackingNumber: String!
    weight: Float!
    dimensions: String!
    rate: Float!
    currency: String!
    priority: Priority!
    flagged: Boolean!
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type ShipmentsResponse {
    shipments: [Shipment!]!
    totalCount: Int!
    page: Int!
    totalPages: Int!
    hasNextPage: Boolean!
    hasPrevPage: Boolean!
  }

  input PaginationInput {
    page: Int
    limit: Int
  }

  input SortInput {
    field: String!
    order: SortOrder!
  }

  input ShipmentFilterInput {
    status: ShipmentStatus
    carrierName: String
    shipperName: String
    priority: Priority
    flagged: Boolean
    searchTerm: String
  }

  input CreateShipmentInput {
    shipperName: String!
    carrierName: String!
    pickupLocation: String!
    deliveryLocation: String!
    pickupDate: String!
    deliveryDate: String!
    weight: Float!
    dimensions: String
    rate: Float!
    currency: String
    priority: Priority
    notes: String
  }

  input UpdateShipmentInput {
    shipperName: String
    carrierName: String
    pickupLocation: String
    deliveryLocation: String
    pickupDate: String
    deliveryDate: String
    status: ShipmentStatus
    weight: Float
    dimensions: String
    rate: Float
    currency: String
    priority: Priority
    flagged: Boolean
    notes: String
  }

  type Query {
    # Get current authenticated user
    me: User

    # Get all shipments with optional filtering, pagination, and sorting
    shipments(
      filter: ShipmentFilterInput
      pagination: PaginationInput
      sort: SortInput
    ): ShipmentsResponse!

    # Get a single shipment by ID
    shipment(id: ID!): Shipment

    # Get shipment statistics (admin only)
    shipmentStats: ShipmentStats!
  }

  type ShipmentStats {
    total: Int!
    pending: Int!
    inTransit: Int!
    delivered: Int!
    cancelled: Int!
    flagged: Int!
  }

  type Mutation {
    # Authentication
    login(email: String!, password: String!): AuthPayload!

    # Shipment mutations (admin only for create/update/delete)
    createShipment(input: CreateShipmentInput!): Shipment!
    updateShipment(id: ID!, input: UpdateShipmentInput!): Shipment!
    deleteShipment(id: ID!): Boolean!

    # Flag shipment (admin and employee)
    toggleShipmentFlag(id: ID!): Shipment!
  }
`;

export default typeDefs;
