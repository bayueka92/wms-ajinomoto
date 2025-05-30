import { create } from 'zustand';
import { RFIDTag, RFIDReader, Movement, Product, Alert } from '../types';

interface RFIDState {
  rfidTags: RFIDTag[];
  rfidReaders: RFIDReader[];
  movements: Movement[];
  alerts: Alert[];
  products: Product[];
  
  // RFID Tag operations
  registerRFIDTag: (productId: string, tagId: string) => Promise<RFIDTag>;
  deactivateRFIDTag: (tagId: string) => Promise<boolean>;
  
  // Movement operations
  recordMovement: (movement: Omit<Movement, 'id' | 'timestamp'>) => Promise<Movement>;
  updateMovement: (id: string, data: Partial<Movement>) => Promise<boolean>;
  deleteMovement: (id: string) => Promise<boolean>;
  
  // Alert operations
  createAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => Promise<Alert>;
  resolveAlert: (alertId: string, userId: string) => Promise<boolean>;
  
  // Reader operations
  registerReader: (reader: Omit<RFIDReader, 'id'>) => Promise<RFIDReader>;
  updateReaderStatus: (readerId: string, status: RFIDReader['status']) => Promise<boolean>;
}

// Mock data
const mockRFIDTags: RFIDTag[] = [
  {
    id: '1',
    tagId: 'RFID-001-AJI',
    productId: '1',
    status: 'active',
    locationId: 'rack-a-1',
    lastScan: {
      readerId: 'reader-1',
      timestamp: new Date(),
      location: 'Warehouse Zone A',
    },
    registeredAt: new Date(),
  },
  {
    id: '2',
    tagId: 'RFID-002-AJI',
    productId: '2',
    status: 'active',
    locationId: 'rack-b-3',
    lastScan: {
      readerId: 'reader-2',
      timestamp: new Date(),
      location: 'Warehouse Zone B',
    },
    registeredAt: new Date(),
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'AJI-MSG-001',
    name: 'Ajinomoto MSG 1kg',
    description: 'Penyedap rasa Ajinomoto 1kg',
    category: 'Seasoning',
    weight: 1,
    dimensions: {
      length: 10,
      width: 5,
      height: 15,
    },
    batchNumber: 'B2023-001',
    expiryDate: new Date(2025, 5, 30),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    sku: 'AJI-MSG-002',
    name: 'Ajinomoto MSG 500g',
    description: 'Penyedap rasa Ajinomoto 500g',
    category: 'Seasoning',
    weight: 0.5,
    dimensions: {
      length: 8,
      width: 4,
      height: 12,
    },
    batchNumber: 'B2023-002',
    expiryDate: new Date(2025, 4, 15),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockRFIDReaders: RFIDReader[] = [
  {
    id: 'reader-1',
    name: 'RFID Gate 1',
    type: 'fixed',
    location: 'Warehouse Entrance',
    status: 'active',
    lastMaintenance: new Date(2023, 11, 15),
    lastActive: new Date(),
  },
  {
    id: 'reader-2',
    name: 'Handheld Scanner 1',
    type: 'handheld',
    location: 'Inventory Control',
    status: 'active',
    lastMaintenance: new Date(2023, 10, 20),
    lastActive: new Date(),
  },
];

const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'unauthorized',
    severity: 'high',
    message: 'Unauthorized movement detected for product AJI-MSG-001',
    productId: '1',
    rfidTagId: '1',
    timestamp: new Date(),
    resolved: false,
  },
];

const mockMovements: Movement[] = [
  {
    id: 'mov-1',
    type: 'in',
    rfidTagId: '1',
    productId: '1',
    toLocationId: 'rack-a-1',
    quantity: 10,
    status: 'completed',
    timestamp: new Date(),
    userId: '1',
    notes: 'Regular inventory intake',
  },
];

export const useRFIDStore = create<RFIDState>((set, get) => ({
  rfidTags: mockRFIDTags,
  rfidReaders: mockRFIDReaders,
  movements: mockMovements,
  alerts: mockAlerts,
  products: mockProducts,
  
  // RFID Tag operations
  registerRFIDTag: async (productId, tagId) => {
    const newTag: RFIDTag = {
      id: `tag-${Date.now()}`,
      tagId,
      productId,
      status: 'active',
      registeredAt: new Date(),
    };
    
    set((state) => ({
      rfidTags: [...state.rfidTags, newTag],
    }));
    
    return newTag;
  },
  
  deactivateRFIDTag: async (tagId) => {
    set((state) => ({
      rfidTags: state.rfidTags.map((tag) =>
        tag.id === tagId ? { ...tag, status: 'inactive' } : tag
      ),
    }));
    
    return true;
  },
  
  // Movement operations
  recordMovement: async (movementData) => {
    const newMovement: Movement = {
      ...movementData,
      id: `mov-${Date.now()}`,
      timestamp: new Date(),
    };
    
    set((state) => ({
      movements: [...state.movements, newMovement],
    }));
    
    return newMovement;
  },

  updateMovement: async (id, data) => {
    set((state) => ({
      movements: state.movements.map((movement) =>
        movement.id === id ? { ...movement, ...data } : movement
      ),
    }));
    
    return true;
  },

  deleteMovement: async (id) => {
    set((state) => ({
      movements: state.movements.filter((movement) => movement.id !== id),
    }));
    
    return true;
  },
  
  // Alert operations
  createAlert: async (alertData) => {
    const newAlert: Alert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      timestamp: new Date(),
    };
    
    set((state) => ({
      alerts: [...state.alerts, newAlert],
    }));
    
    return newAlert;
  },
  
  resolveAlert: async (alertId, userId) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              resolved: true,
              resolvedBy: userId,
              resolvedAt: new Date(),
            }
          : alert
      ),
    }));
    
    return true;
  },
  
  // Reader operations
  registerReader: async (readerData) => {
    const newReader: RFIDReader = {
      ...readerData,
      id: `reader-${Date.now()}`,
    };
    
    set((state) => ({
      rfidReaders: [...state.rfidReaders, newReader],
    }));
    
    return newReader;
  },
  
  updateReaderStatus: async (readerId, status) => {
    set((state) => ({
      rfidReaders: state.rfidReaders.map((reader) =>
        reader.id === readerId ? { ...reader, status, lastActive: new Date() } : reader
      ),
    }));
    
    return true;
  },
}));