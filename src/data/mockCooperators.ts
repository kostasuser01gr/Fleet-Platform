import { ServiceCooperator } from '../types/inventory';

export const mockCooperators: ServiceCooperator[] = [
  {
    id: 'coop-001',
    name: 'Budget Tire & Service Center',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main Street',
      city: 'New York',
      country: 'USA'
    },
    services: ['tire_replacement', 'oil_change', 'inspection', 'brake_service'],
    priceMultiplier: 0.65,
    quality: 3,
    specialties: ['Quick service', 'Budget-friendly', 'No appointment needed'],
    unlocked: true,
    discounts: [
      {
        type: 'percentage',
        value: 15,
        condition: 'First-time customer'
      }
    ],
    workSpeed: 1.3,
    reliability: 75,
    reputation: 65,
    availableHours: {
      open: '07:00',
      close: '20:00'
    },
    contactInfo: {
      phone: '+1-555-0101',
      email: 'service@budgettire.com'
    }
  },
  {
    id: 'coop-002',
    name: 'Premium Motors Workshop',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: '456 Luxury Lane',
      city: 'Los Angeles',
      country: 'USA'
    },
    services: ['engine_repair', 'transmission_service', 'suspension_upgrade', 'electronics_install', 'tuning', 'custom_fabrication'],
    priceMultiplier: 1.8,
    quality: 5,
    specialties: ['Expert mechanics', 'High-end equipment', 'Warranty included', 'Performance tuning'],
    unlocked: false,
    unlockCost: 5000,
    unlockRequirements: {
      level: 10,
      reputation: 500
    },
    discounts: [
      {
        type: 'percentage',
        value: 10,
        condition: 'Loyalty program member'
      }
    ],
    workSpeed: 0.8,
    reliability: 98,
    reputation: 95,
    availableHours: {
      open: '08:00',
      close: '18:00'
    },
    contactInfo: {
      phone: '+1-555-0202',
      email: 'contact@premiummotors.com'
    }
  },
  {
    id: 'coop-003',
    name: 'QuickFix Auto Services',
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: '789 Speed Avenue',
      city: 'Chicago',
      country: 'USA'
    },
    services: ['oil_change', 'brake_service', 'tire_replacement', 'inspection', 'interior_detailing'],
    priceMultiplier: 0.85,
    quality: 3.5,
    specialties: ['Express service', 'While-you-wait', 'Weekend hours'],
    unlocked: true,
    discounts: [
      {
        type: 'fixed',
        value: 25,
        condition: 'Oil change + inspection combo'
      }
    ],
    workSpeed: 1.8,
    reliability: 82,
    reputation: 70,
    availableHours: {
      open: '06:00',
      close: '22:00'
    },
    contactInfo: {
      phone: '+1-555-0303',
      email: 'info@quickfix.com'
    }
  },
  {
    id: 'coop-004',
    name: 'Elite Performance Garage',
    location: {
      lat: 29.7604,
      lng: -95.3698,
      address: '321 Racing Road',
      city: 'Houston',
      country: 'USA'
    },
    services: ['tuning', 'engine_repair', 'suspension_upgrade', 'exhaust_upgrade', 'electronics_install', 'custom_fabrication'],
    priceMultiplier: 2.2,
    quality: 5,
    specialties: ['Race prep', 'Dyno tuning', 'Custom builds', 'Performance parts'],
    unlocked: false,
    unlockCost: 12000,
    unlockRequirements: {
      level: 15,
      reputation: 800,
      completedMissions: ['race-series-1']
    },
    discounts: [],
    workSpeed: 0.7,
    reliability: 99,
    reputation: 98,
    availableHours: {
      open: '09:00',
      close: '17:00'
    },
    contactInfo: {
      phone: '+1-555-0404',
      email: 'elite@performancegarage.com'
    }
  },
  {
    id: 'coop-005',
    name: 'Eco-Friendly Auto Care',
    location: {
      lat: 47.6062,
      lng: -122.3321,
      address: '555 Green Street',
      city: 'Seattle',
      country: 'USA'
    },
    services: ['oil_change', 'inspection', 'interior_detailing', 'electronics_install', 'brake_service'],
    priceMultiplier: 1.1,
    quality: 4,
    specialties: ['Eco-friendly products', 'Hybrid specialists', 'Water conservation'],
    unlocked: true,
    discounts: [
      {
        type: 'percentage',
        value: 20,
        condition: 'Hybrid/Electric vehicles'
      }
    ],
    workSpeed: 1.0,
    reliability: 88,
    reputation: 78,
    availableHours: {
      open: '08:00',
      close: '19:00'
    },
    contactInfo: {
      phone: '+1-555-0505',
      email: 'service@ecoautocare.com'
    }
  },
  {
    id: 'coop-006',
    name: 'Mobile Mechanic Pro',
    location: {
      lat: 33.4484,
      lng: -112.0740,
      address: 'Mobile Service (Phoenix Area)',
      city: 'Phoenix',
      country: 'USA'
    },
    services: ['oil_change', 'brake_service', 'tire_replacement', 'inspection', 'electronics_install'],
    priceMultiplier: 1.3,
    quality: 4,
    specialties: ['Comes to you', 'Emergency service', '24/7 availability'],
    unlocked: false,
    unlockCost: 2500,
    unlockRequirements: {
      level: 7,
      reputation: 300
    },
    discounts: [
      {
        type: 'percentage',
        value: 10,
        condition: 'Off-peak hours'
      }
    ],
    workSpeed: 1.2,
    reliability: 85,
    reputation: 80,
    availableHours: {
      open: '00:00',
      close: '23:59'
    },
    contactInfo: {
      phone: '+1-555-0606',
      email: 'dispatch@mobilemechanicpro.com'
    }
  },
  {
    id: 'coop-007',
    name: 'Classic Car Restoration',
    location: {
      lat: 25.7617,
      lng: -80.1918,
      address: '888 Heritage Boulevard',
      city: 'Miami',
      country: 'USA'
    },
    services: ['engine_repair', 'body_work', 'paint_job', 'interior_detailing', 'custom_fabrication'],
    priceMultiplier: 2.5,
    quality: 5,
    specialties: ['Vintage restoration', 'Custom paint', 'Upholstery', 'Hard-to-find parts'],
    unlocked: false,
    unlockCost: 15000,
    unlockRequirements: {
      level: 20,
      reputation: 1200
    },
    discounts: [],
    workSpeed: 0.5,
    reliability: 95,
    reputation: 92,
    availableHours: {
      open: '09:00',
      close: '16:00'
    },
    contactInfo: {
      phone: '+1-555-0707',
      email: 'info@classiccarrestoration.com'
    }
  },
  {
    id: 'coop-008',
    name: 'AutoZone Express',
    location: {
      lat: 39.7392,
      lng: -104.9903,
      address: '999 Commerce Drive',
      city: 'Denver',
      country: 'USA'
    },
    services: ['oil_change', 'tire_replacement', 'brake_service', 'inspection', 'electronics_install'],
    priceMultiplier: 0.9,
    quality: 3.5,
    specialties: ['Chain reliability', 'Parts warranty', 'National coverage'],
    unlocked: true,
    discounts: [
      {
        type: 'percentage',
        value: 5,
        condition: 'Rewards card member'
      }
    ],
    workSpeed: 1.1,
    reliability: 80,
    reputation: 72,
    availableHours: {
      open: '07:00',
      close: '21:00'
    },
    contactInfo: {
      phone: '+1-555-0808',
      email: 'support@autoz oneexpress.com'
    }
  },
  {
    id: 'coop-009',
    name: 'Diesel Specialists Inc.',
    location: {
      lat: 32.7767,
      lng: -96.7970,
      address: '147 Truck Route',
      city: 'Dallas',
      country: 'USA'
    },
    services: ['engine_repair', 'transmission_service', 'suspension_upgrade', 'brake_service', 'exhaust_upgrade'],
    priceMultiplier: 1.4,
    quality: 4.5,
    specialties: ['Diesel experts', 'Heavy-duty trucks', 'Fleet service'],
    unlocked: false,
    unlockCost: 7500,
    unlockRequirements: {
      level: 12,
      reputation: 600
    },
    discounts: [
      {
        type: 'percentage',
        value: 15,
        condition: 'Fleet customers (3+ vehicles)'
      }
    ],
    workSpeed: 0.9,
    reliability: 92,
    reputation: 85,
    availableHours: {
      open: '06:00',
      close: '20:00'
    },
    contactInfo: {
      phone: '+1-555-0909',
      email: 'service@dieselspecialists.com'
    }
  },
  {
    id: 'coop-010',
    name: 'Underground Tuners',
    location: {
      lat: 42.3601,
      lng: -71.0589,
      address: '666 Custom Lane',
      city: 'Boston',
      country: 'USA'
    },
    services: ['tuning', 'engine_repair', 'electronics_install', 'exhaust_upgrade', 'custom_fabrication', 'paint_job'],
    priceMultiplier: 1.9,
    quality: 4.5,
    specialties: ['Import specialists', 'Turbo builds', 'ECU tuning', 'Show cars'],
    unlocked: false,
    unlockCost: 10000,
    unlockRequirements: {
      level: 16,
      reputation: 900
    },
    discounts: [],
    workSpeed: 0.75,
    reliability: 90,
    reputation: 88,
    availableHours: {
      open: '10:00',
      close: '19:00'
    },
    contactInfo: {
      phone: '+1-555-1010',
      email: 'crew@undergroundtuners.com'
    }
  }
];
