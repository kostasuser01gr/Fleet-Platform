import { VehiclePart, Consumable } from '../types/inventory';

export const mockParts: VehiclePart[] = [
  // Engines
  {
    id: 'eng-001',
    name: 'TurboMax V8 Engine',
    type: 'engine',
    manufacturer: 'PowerTech',
    condition: 95,
    performance: 45,
    durability: 85,
    price: 15000,
    installed: false,
    rarity: 'epic',
    description: 'High-performance V8 engine with twin turbochargers. Delivers exceptional power and torque.',
    stats: {
      speed: 25,
      acceleration: 35,
      efficiency: -10
    },
    requirements: {
      level: 15,
      reputation: 750
    }
  },
  {
    id: 'eng-002',
    name: 'EcoBoost Hybrid Engine',
    type: 'engine',
    manufacturer: 'GreenDrive',
    condition: 100,
    performance: 20,
    durability: 95,
    price: 8500,
    installed: false,
    rarity: 'rare',
    description: 'Fuel-efficient hybrid engine perfect for long-distance hauling.',
    stats: {
      speed: 10,
      acceleration: 15,
      efficiency: 40
    },
    requirements: {
      level: 8
    }
  },
  {
    id: 'eng-003',
    name: 'V6 Standard Engine',
    type: 'engine',
    manufacturer: 'Reliable Motors',
    condition: 85,
    performance: 10,
    durability: 80,
    price: 4500,
    installed: false,
    rarity: 'common',
    description: 'Reliable V6 engine for everyday driving.',
    stats: {
      speed: 5,
      acceleration: 8,
      efficiency: 15
    }
  },
  
  // Tires
  {
    id: 'tire-001',
    name: 'All-Terrain Pro Tires',
    type: 'tires',
    manufacturer: 'GripMaster',
    condition: 90,
    performance: 25,
    durability: 70,
    price: 1200,
    installed: false,
    rarity: 'uncommon',
    description: 'Premium all-terrain tires suitable for any road condition.',
    stats: {
      handling: 30,
      durability: 25
    },
    requirements: {
      level: 5
    }
  },
  {
    id: 'tire-002',
    name: 'Racing Slicks',
    type: 'tires',
    manufacturer: 'SpeedDemon',
    condition: 100,
    performance: 40,
    durability: 40,
    price: 2500,
    installed: false,
    rarity: 'rare',
    description: 'High-performance racing tires for maximum grip on dry surfaces.',
    stats: {
      speed: 15,
      handling: 45,
      durability: -20
    },
    requirements: {
      level: 12,
      reputation: 500
    }
  },
  {
    id: 'tire-003',
    name: 'Budget All-Season Tires',
    type: 'tires',
    manufacturer: 'ValueTire',
    condition: 75,
    performance: 5,
    durability: 60,
    price: 400,
    installed: false,
    rarity: 'common',
    description: 'Affordable all-season tires for basic transportation.',
    stats: {
      handling: 5,
      durability: 10
    }
  },

  // Transmissions
  {
    id: 'trans-001',
    name: 'Sport 8-Speed Auto',
    type: 'transmission',
    manufacturer: 'ShiftTech',
    condition: 92,
    performance: 30,
    durability: 88,
    price: 6500,
    installed: false,
    rarity: 'rare',
    description: '8-speed automatic transmission with sport mode for quick shifts.',
    stats: {
      acceleration: 25,
      efficiency: 10
    },
    requirements: {
      level: 10
    }
  },
  {
    id: 'trans-002',
    name: '6-Speed Manual',
    type: 'transmission',
    manufacturer: 'ClassicGear',
    condition: 80,
    performance: 15,
    durability: 75,
    price: 3200,
    installed: false,
    rarity: 'uncommon',
    description: 'Traditional 6-speed manual transmission for driver control.',
    stats: {
      acceleration: 12,
      efficiency: 8
    }
  },

  // Suspension
  {
    id: 'susp-001',
    name: 'Air Ride Suspension',
    type: 'suspension',
    manufacturer: 'SmoothRide',
    condition: 95,
    performance: 35,
    durability: 82,
    price: 5800,
    installed: false,
    rarity: 'epic',
    description: 'Adjustable air suspension for superior comfort and handling.',
    stats: {
      handling: 30,
      durability: 15
    },
    requirements: {
      level: 14,
      reputation: 600
    }
  },
  {
    id: 'susp-002',
    name: 'Sport Coilovers',
    type: 'suspension',
    manufacturer: 'TrackMaster',
    condition: 88,
    performance: 28,
    durability: 70,
    price: 3500,
    installed: false,
    rarity: 'rare',
    description: 'Performance coilover suspension for improved cornering.',
    stats: {
      handling: 35,
      speed: -5
    },
    requirements: {
      level: 9
    }
  },

  // Electronics
  {
    id: 'elec-001',
    name: 'Advanced ECU Tune',
    type: 'electronics',
    manufacturer: 'ChipPro',
    condition: 100,
    performance: 25,
    durability: 100,
    price: 2800,
    installed: false,
    rarity: 'rare',
    description: 'Custom ECU tuning for optimized engine performance.',
    stats: {
      speed: 15,
      acceleration: 20,
      efficiency: 5
    },
    requirements: {
      level: 11
    }
  },
  {
    id: 'elec-002',
    name: 'GPS Navigation System',
    type: 'electronics',
    manufacturer: 'NavTech',
    condition: 100,
    performance: 5,
    durability: 95,
    price: 800,
    installed: false,
    rarity: 'common',
    description: 'Modern GPS navigation with real-time traffic.',
    stats: {
      efficiency: 8
    }
  },

  // Brakes
  {
    id: 'brake-001',
    name: 'Carbon Ceramic Brakes',
    type: 'brakes',
    manufacturer: 'StopMaster',
    condition: 98,
    performance: 40,
    durability: 90,
    price: 7500,
    installed: false,
    rarity: 'legendary',
    description: 'Top-tier carbon ceramic braking system for extreme performance.',
    stats: {
      handling: 25,
      durability: 30
    },
    requirements: {
      level: 18,
      reputation: 1000
    }
  },
  {
    id: 'brake-002',
    name: 'Performance Brake Kit',
    type: 'brakes',
    manufacturer: 'SafeStop',
    condition: 90,
    performance: 22,
    durability: 75,
    price: 2200,
    installed: false,
    rarity: 'uncommon',
    description: 'Upgraded brake pads and rotors for better stopping power.',
    stats: {
      handling: 15,
      durability: 10
    },
    requirements: {
      level: 6
    }
  },

  // Paint/Cosmetics
  {
    id: 'paint-001',
    name: 'Metallic Chrome Wrap',
    type: 'paint',
    manufacturer: 'CustomLooks',
    condition: 100,
    performance: 0,
    durability: 70,
    price: 3500,
    installed: false,
    rarity: 'epic',
    description: 'Eye-catching metallic chrome vinyl wrap.',
    stats: {},
    requirements: {
      level: 10
    }
  },
  {
    id: 'paint-002',
    name: 'Matte Black Finish',
    type: 'paint',
    manufacturer: 'CustomLooks',
    condition: 100,
    performance: 0,
    durability: 80,
    price: 1800,
    installed: false,
    rarity: 'uncommon',
    description: 'Sleek matte black paint finish.',
    stats: {},
    requirements: {
      level: 5
    }
  }
];

export const mockConsumables: Consumable[] = [
  {
    id: 'cons-001',
    name: 'Synthetic Motor Oil (5L)',
    type: 'oil',
    quantity: 10,
    price: 45,
    effect: {
      conditionBoost: 5,
      performanceBoost: 2,
      duration: 30
    }
  },
  {
    id: 'cons-002',
    name: 'Premium Coolant',
    type: 'coolant',
    quantity: 8,
    price: 35,
    effect: {
      conditionBoost: 3,
      duration: 45
    }
  },
  {
    id: 'cons-003',
    name: 'High-Performance Brake Fluid',
    type: 'brake_fluid',
    quantity: 5,
    price: 28,
    effect: {
      conditionBoost: 4,
      duration: 60
    }
  },
  {
    id: 'cons-004',
    name: 'Fuel System Cleaner',
    type: 'fuel_additive',
    quantity: 12,
    price: 22,
    effect: {
      performanceBoost: 3,
      duration: 15
    }
  },
  {
    id: 'cons-005',
    name: 'Professional Detailing Kit',
    type: 'cleaning',
    quantity: 3,
    price: 85,
    effect: {
      conditionBoost: 8
    }
  },
  {
    id: 'cons-006',
    name: 'Diagnostic Tool',
    type: 'tool',
    quantity: 1,
    price: 450,
    effect: {
      conditionBoost: 0
    }
  }
];
