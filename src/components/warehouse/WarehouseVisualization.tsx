import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useWarehouseStore } from '../../store/warehouseStore';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

export const WarehouseVisualization: React.FC = () => {
  const { locations, selectedLocation } = useWarehouseStore();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Layout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className={`p-4 rounded-lg border ${
                    selectedLocation?.id === location.id
                      ? 'border-ajinomoto-red bg-ajinomoto-red-50'
                      : 'border-ajinomoto-gray-200'
                  }`}
                >
                  <h3 className="font-medium text-ajinomoto-gray-900">{location.name}</h3>
                  <p className="text-sm text-ajinomoto-gray-500">{location.code}</p>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Capacity:</span>
                      <span>{location.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Occupied:</span>
                      <span>{location.occupied}</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-ajinomoto-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (location.occupied / location.capacity) < 0.7
                              ? 'bg-success'
                              : (location.occupied / location.capacity) < 0.9
                              ? 'bg-warning'
                              : 'bg-error'
                          }`}
                          style={{
                            width: `${(location.occupied / location.capacity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Eye size={14} />}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit size={14} />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={<Trash2 size={14} />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedLocation ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-ajinomoto-gray-900">
                    {selectedLocation.name}
                  </h3>
                  <p className="text-sm text-ajinomoto-gray-500">{selectedLocation.code}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-ajinomoto-gray-500">Type</p>
                    <p className="text-ajinomoto-gray-900">
                      {selectedLocation.type === 'rack' ? 'Rack' :
                       selectedLocation.type === 'aisle' ? 'Aisle' :
                       selectedLocation.type === 'zone' ? 'Zone' :
                       selectedLocation.type === 'staging' ? 'Staging Area' :
                       selectedLocation.type === 'receiving' ? 'Receiving Area' :
                       'Shipping Area'}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ajinomoto-gray-500">Capacity</p>
                    <div className="flex items-center">
                      <div className="flex-1 mr-4">
                        <div className="h-2 bg-ajinomoto-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full ${
                              (selectedLocation.occupied / selectedLocation.capacity) < 0.7
                                ? 'bg-success'
                                : (selectedLocation.occupied / selectedLocation.capacity) < 0.9
                                ? 'bg-warning'
                                : 'bg-error'
                            }`}
                            style={{
                              width: `${(selectedLocation.occupied / selectedLocation.capacity) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((selectedLocation.occupied / selectedLocation.capacity) * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-ajinomoto-gray-500 mt-1">
                      {selectedLocation.occupied} of {selectedLocation.capacity} units
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ajinomoto-gray-500">Dimensions</p>
                    <p className="text-ajinomoto-gray-900">
                      {selectedLocation.width}m × {selectedLocation.height}m × {selectedLocation.depth}m
                    </p>
                  </div>

                  <div className="pt-4 border-t border-ajinomoto-gray-200 mt-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Eye size={14} />}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit size={14} />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<Trash2 size={14} />}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-ajinomoto-gray-500">
                  Select a location to view details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};