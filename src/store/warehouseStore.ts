import { create } from 'zustand';
import { Location } from '../types';

interface WarehouseState {
  locations: Location[];
  selectedLocation: Location | null;
  
  // Location operations
  addLocation: (location: Omit<Location, 'id'>) => Promise<Location>;
  updateLocation: (id: string, data: Partial<Location>) => Promise<boolean>;
  deleteLocation: (id: string) => Promise<boolean>;
  selectLocation: (id: string | null) => void;
  getLocationById: (id: string) => Location | undefined;
  
  // Warehouse statistics
  getCapacityUtilization: () => number;
  getZoneStatistics: () => Record<string, { capacity: number; occupied: number; utilization: number }>;
}

// Mock warehouse layout data
const mockLocations: Location[] = [
  // Zone A - Racks
  {
    id: 'rack-a-1',
    name: 'Rack A-1',
    type: 'rack',
    code: 'A-1',
    capacity: 1000,
    occupied: 700,
    x: 0,
    y: 0,
    z: 0,
    width: 2,
    height: 3,
    depth: 1,
  },
  {
    id: 'rack-a-2',
    name: 'Rack A-2',
    type: 'rack',
    code: 'A-2',
    capacity: 1000,
    occupied: 850,
    x: 3,
    y: 0,
    z: 0,
    width: 2,
    height: 3,
    depth: 1,
  },
  // Zone B - Racks
  {
    id: 'rack-b-1',
    name: 'Rack B-1',
    type: 'rack',
    code: 'B-1',
    capacity: 1500,
    occupied: 900,
    x: 0,
    y: 0,
    z: 5,
    width: 3,
    height: 4,
    depth: 1,
  },
  {
    id: 'rack-b-2',
    name: 'Rack B-2',
    type: 'rack',
    code: 'B-2',
    capacity: 1500,
    occupied: 1200,
    x: 4,
    y: 0,
    z: 5,
    width: 3,
    height: 4,
    depth: 1,
  },
  // Receiving Area
  {
    id: 'receiving-1',
    name: 'Receiving Area 1',
    type: 'receiving',
    code: 'REC-1',
    capacity: 2000,
    occupied: 500,
    x: -5,
    y: 0,
    z: 0,
    width: 4,
    height: 1,
    depth: 4,
  },
  // Shipping Area
  {
    id: 'shipping-1',
    name: 'Shipping Area 1',
    type: 'shipping',
    code: 'SHIP-1',
    capacity: 2000,
    occupied: 300,
    x: -5,
    y: 0,
    z: 5,
    width: 4,
    height: 1,
    depth: 4,
  },
];

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
  locations: mockLocations,
  selectedLocation: null,
  
  // Location operations
  addLocation: async (locationData) => {
    const newLocation: Location = {
      ...locationData,
      id: `loc-${Date.now()}`,
    };
    
    set((state) => ({
      locations: [...state.locations, newLocation],
    }));
    
    return newLocation;
  },
  
  updateLocation: async (id, data) => {
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === id ? { ...location, ...data } : location
      ),
    }));
    
    return true;
  },

  deleteLocation: async (id) => {
    set((state) => ({
      locations: state.locations.filter((location) => location.id !== id),
      selectedLocation: state.selectedLocation?.id === id ? null : state.selectedLocation,
    }));
    
    return true;
  },
  
  selectLocation: (id) => {
    if (id === null) {
      set({ selectedLocation: null });
      return;
    }
    
    const location = get().locations.find((loc) => loc.id === id);
    set({ selectedLocation: location || null });
  },
  
  getLocationById: (id) => {
    return get().locations.find((loc) => loc.id === id);
  },
  
  // Warehouse statistics
  getCapacityUtilization: () => {
    const { locations } = get();
    const totalCapacity = locations.reduce((sum, loc) => sum + loc.capacity, 0);
    const totalOccupied = locations.reduce((sum, loc) => sum + loc.occupied, 0);
    
    return totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;
  },
  
  getZoneStatistics: () => {
    const { locations } = get();
    const statistics: Record<string, { capacity: number; occupied: number; utilization: number }> = {};
    
    // Group by first character of the code (Zone identifier)
    locations.forEach((location) => {
      const zoneId = location.code.charAt(0);
      
      if (!statistics[zoneId]) {
        statistics[zoneId] = {
          capacity: 0,
          occupied: 0,
          utilization: 0,
        };
      }
      
      statistics[zoneId].capacity += location.capacity;
      statistics[zoneId].occupied += location.occupied;
    });
    
    // Calculate utilization for each zone
    Object.keys(statistics).forEach((zoneId) => {
      const zone = statistics[zoneId];
      zone.utilization = zone.capacity > 0 ? (zone.occupied / zone.capacity) * 100 : 0;
    });
    
    return statistics;
  },
}));