import { gql } from '@apollo/client';

// Auth Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
        createdAt
      }
    }
  }
`;

// Shipment Queries
export const GET_SHIPMENTS = gql`
  query GetShipments(
    $filter: ShipmentFilterInput
    $pagination: PaginationInput
    $sort: SortInput
  ) {
    shipments(filter: $filter, pagination: $pagination, sort: $sort) {
      shipments {
        id
        shipperName
        carrierName
        pickupLocation
        deliveryLocation
        pickupDate
        deliveryDate
        status
        trackingNumber
        weight
        dimensions
        rate
        currency
        priority
        flagged
        notes
        createdAt
        updatedAt
      }
      totalCount
      page
      totalPages
      hasNextPage
      hasPrevPage
    }
  }
`;

export const GET_SHIPMENT = gql`
  query GetShipment($id: ID!) {
    shipment(id: $id) {
      id
      shipperName
      carrierName
      pickupLocation
      deliveryLocation
      pickupDate
      deliveryDate
      status
      trackingNumber
      weight
      dimensions
      rate
      currency
      priority
      flagged
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GET_SHIPMENT_STATS = gql`
  query GetShipmentStats {
    shipmentStats {
      total
      pending
      inTransit
      delivered
      cancelled
      flagged
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      role
      createdAt
    }
  }
`;

// Shipment Mutations
export const CREATE_SHIPMENT = gql`
  mutation CreateShipment($input: CreateShipmentInput!) {
    createShipment(input: $input) {
      id
      shipperName
      carrierName
      pickupLocation
      deliveryLocation
      pickupDate
      deliveryDate
      status
      trackingNumber
      weight
      dimensions
      rate
      currency
      priority
      flagged
      notes
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SHIPMENT = gql`
  mutation UpdateShipment($id: ID!, $input: UpdateShipmentInput!) {
    updateShipment(id: $id, input: $input) {
      id
      shipperName
      carrierName
      pickupLocation
      deliveryLocation
      pickupDate
      deliveryDate
      status
      trackingNumber
      weight
      dimensions
      rate
      currency
      priority
      flagged
      notes
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SHIPMENT = gql`
  mutation DeleteShipment($id: ID!) {
    deleteShipment(id: $id)
  }
`;

export const TOGGLE_SHIPMENT_FLAG = gql`
  mutation ToggleShipmentFlag($id: ID!) {
    toggleShipmentFlag(id: $id) {
      id
      flagged
    }
  }
`;
