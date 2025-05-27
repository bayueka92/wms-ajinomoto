export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'warehouse' | 'supervisor' | 'staff';
  email: string;
  lastLogin?: Date;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  batchNumber?: string;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RFIDTag {
  id: string;
  tagId: string;
  productId: string;
  product?: Product;
  status: 'active' | 'inactive' | 'pending';
  locationId?: string;
  lastScan?: {
    readerId: string;
    timestamp: Date;
    location: string;
  };
  registeredAt: Date;
}

export interface RFIDReader {
  id: string;
  name: string;
  type: 'handheld' | 'fixed';
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  lastMaintenance?: Date;
  lastActive?: Date;
}

export interface Location {
  id: string;
  name: string;
  type: 'rack' | 'aisle' | 'zone' | 'staging' | 'receiving' | 'shipping';
  code: string;
  capacity: number;
  occupied: number;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
}

export interface Movement {
  id: string;
  type: 'in' | 'out' | 'transfer';
  rfidTagId: string;
  productId: string;
  fromLocationId?: string;
  toLocationId?: string;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  timestamp: Date;
  userId: string;
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'unauthorized' | 'missing' | 'expired' | 'low_stock' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  productId?: string;
  locationId?: string;
  rfidTagId?: string;
  timestamp: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface DashboardSummary {
  totalProducts: number;
  totalRFIDTags: number;
  activeAlerts: number;
  movementsToday: number;
  stockUtilization: number;
  pendingMovements: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface AlertBanner {
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}