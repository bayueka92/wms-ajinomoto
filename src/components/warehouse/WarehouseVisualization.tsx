import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useWarehouseStore } from '../../store/warehouseStore';
import { useRFIDStore } from '../../store/rfidStore';
import { Location } from '../../types';

interface RackProps {
  location: Location;
  isSelected: boolean;
  onClick: () => void;
}

const Rack: React.FC<RackProps> = ({ location, isSelected, onClick }) => {
  // Calculate fill percentage (utilization)
  const fillPercentage = location.occupied / location.capacity;
  
  // Color based on utilization
  let color;
  if (fillPercentage < 0.5) {
    color = '#10B981'; // Green (low utilization)
  } else if (fillPercentage < 0.8) {
    color = '#F59E0B'; // Amber (medium utilization)
  } else {
    color = '#EF4444'; // Red (high utilization)
  }
  
  return (
    <group
      position={[location.x, location.y, location.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Rack base */}
      <mesh>
        <boxGeometry args={[location.width, 0.1, location.depth]} />
        <meshStandardMaterial color="#9CA3AF" />
      </mesh>
      
      {/* Rack shelves */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[0, (i + 1) * (location.height / 3), 0]}>
          <boxGeometry args={[location.width, 0.05, location.depth]} />
          <meshStandardMaterial color="#9CA3AF" />
        </mesh>
      ))}
      
      {/* Rack pillars */}
      {[-location.width / 2, location.width / 2].map((x) => (
        [location.depth / 2, -location.depth / 2].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, location.height / 2, z]}>
            <boxGeometry args={[0.1, location.height, 0.1]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
        ))
      ))}
      
      {/* Rack content (showing utilization) */}
      <mesh position={[0, location.height / 2, 0]}>
        <boxGeometry args={[
          location.width * 0.9, 
          location.height * fillPercentage, 
          location.depth * 0.9
        ]} />
        <meshStandardMaterial 
          color={color} 
          opacity={0.8} 
          transparent={true} 
          emissive={isSelected ? "#FFFFFF" : undefined}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      {/* Rack label */}
      <Text
        position={[0, -0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        color="black"
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
      >
        {location.name}
      </Text>
    </group>
  );
};

interface ShippingAreaProps {
  location: Location;
  isSelected: boolean;
  onClick: () => void;
}

const ShippingArea: React.FC<ShippingAreaProps> = ({ location, isSelected, onClick }) => {
  return (
    <group
      position={[location.x, location.y, location.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[location.width, 0.1, location.depth]} />
        <meshStandardMaterial 
          color="#3B82F6" 
          opacity={0.6} 
          transparent={true}
          emissive={isSelected ? "#FFFFFF" : undefined}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      <Text
        position={[0, 0.3, 0]}
        color="black"
        fontSize={0.4}
        anchorX="center"
        anchorY="middle"
      >
        {location.name}
      </Text>
    </group>
  );
};

interface ReceivingAreaProps {
  location: Location;
  isSelected: boolean;
  onClick: () => void;
}

const ReceivingArea: React.FC<ReceivingAreaProps> = ({ location, isSelected, onClick }) => {
  return (
    <group
      position={[location.x, location.y, location.z]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[location.width, 0.1, location.depth]} />
        <meshStandardMaterial 
          color="#10B981" 
          opacity={0.6} 
          transparent={true}
          emissive={isSelected ? "#FFFFFF" : undefined}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      <Text
        position={[0, 0.3, 0]}
        color="black"
        fontSize={0.4}
        anchorX="center"
        anchorY="middle"
      >
        {location.name}
      </Text>
    </group>
  );
};

const AnimatedCamera = () => {
  const ref = useRef<any>();
  
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * 0.05;
      ref.current.position.x = 15 * Math.cos(t);
      ref.current.position.z = 15 * Math.sin(t);
      ref.current.lookAt(0, 0, 0);
    }
  });
  
  return <perspectiveCamera ref={ref} position={[15, 10, 15]} />;
};

const Floor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
    <planeGeometry args={[50, 50]} />
    <meshStandardMaterial color="#E5E7EB" />
    {/* Grid */}
    <gridHelper args={[50, 50, '#9CA3AF', '#D1D5DB']} rotation={[Math.PI / 2, 0, 0]} />
  </mesh>
);

export const WarehouseVisualization: React.FC = () => {
  const { locations, selectLocation, selectedLocation } = useWarehouseStore();
  const [autoRotate, setAutoRotate] = useState(true);
  
  const handleLocationClick = (locationId: string) => {
    selectLocation(locationId);
  };
  
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-ajinomoto-gray-300 bg-ajinomoto-gray-100 shadow-inner">
      <Canvas camera={{ position: [15, 10, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} />
        
        {/* Warehouse floor */}
        <Floor />
        
        {/* Warehouse structures */}
        {locations.map((location) => {
          if (location.type === 'rack') {
            return (
              <Rack
                key={location.id}
                location={location}
                isSelected={selectedLocation?.id === location.id}
                onClick={() => handleLocationClick(location.id)}
              />
            );
          } else if (location.type === 'shipping') {
            return (
              <ShippingArea
                key={location.id}
                location={location}
                isSelected={selectedLocation?.id === location.id}
                onClick={() => handleLocationClick(location.id)}
              />
            );
          } else if (location.type === 'receiving') {
            return (
              <ReceivingArea
                key={location.id}
                location={location}
                isSelected={selectedLocation?.id === location.id}
                onClick={() => handleLocationClick(location.id)}
              />
            );
          }
          return null;
        })}
        
        {autoRotate && <AnimatedCamera />}
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 space-x-2">
        <button 
          className={`px-3 py-1 text-sm rounded-md ${autoRotate ? 'bg-ajinomoto-red text-white' : 'bg-white text-ajinomoto-gray-700 border border-ajinomoto-gray-300'}`}
          onClick={() => setAutoRotate(!autoRotate)}
        >
          {autoRotate ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
        </button>
      </div>
    </div>
  );
};