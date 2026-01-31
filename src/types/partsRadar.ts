// Parts Radar Type Definitions

export type PartnerSource = 'custom' | 'google_places';
export type PartnerTier = 'economy' | 'standard' | 'premium';
export type RequestMode = 'single' | 'bulk';
export type RequestStatus = 'draft' | 'sent' | 'quoted' | 'approved' | 'ordered' | 'received' | 'closed' | 'cancelled';
export type QuoteStatus = 'offered' | 'revised' | 'accepted' | 'rejected';
export type AuditActionType = 
  | 'partner_create' 
  | 'partner_update' 
  | 'partner_delete'
  | 'request_create' 
  | 'request_update'
  | 'request_status_change'
  | 'quote_create'
  | 'quote_update'
  | 'quote_accept'
  | 'quote_reject';

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface CustomPartner {
  partnerId: string;
  source: PartnerSource;
  placeId?: string; // If created from Places result
  name: string;
  geo: GeoLocation;
  address: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  types: Array<string>; // ['car_repair', 'parts_store', 'dealer', 'tire_shop', ...]
  tier: PartnerTier;
  priceIndex: number; // 0-100, internal estimate
  reliabilityIndex: number; // 0-100, internal KPI
  slaMinutesTypical: number;
  delivery: {
    pickup: boolean;
    delivery: boolean;
    deliveryFeeBase: number;
  };
  paymentTerms: {
    invoice: boolean;
    cash: boolean;
    card: boolean;
  };
  coverageBranches: Array<string>; // branchIds
  isActive: boolean;
  isVerified: boolean; // If derived from Places, require admin verification
  lastHeartbeatAt?: Date;
  isOnline: boolean;
  notes?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface PlaceResult {
  placeId: string;
  name: string;
  geo: GeoLocation;
  address: string;
  primaryType?: string;
  rating?: number;
  userRatingCount?: number;
  phone?: string;
  website?: string;
  photoRef?: string; // If allowed by policy
  fetchedAt: Date;
}

export interface PartLine {
  partKey: string;
  description: string;
  qty: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requiredByDate?: Date;
  notes?: string;
}

export interface RequestConstraints {
  radiusKm: number;
  preferredTier?: PartnerTier;
  mustBeInStock: boolean;
  maxTotalCost?: number;
  deliveryRequired?: boolean;
}

export interface PartsRequest {
  requestId: string;
  createdAt: Date;
  createdBy: string;
  mode: RequestMode;
  vehicleIds: Array<string>; // or vins
  branchId?: string;
  partLines: Array<PartLine>;
  constraints: RequestConstraints;
  status: RequestStatus;
  selectedPartnerId?: string;
  selectedQuoteId?: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface QuoteLine {
  partKey: string;
  qty: number;
  unitPrice: number;
  availability: 'in_stock' | 'orderable' | 'unknown';
  leadTimeHours?: number;
}

export interface QuoteTotals {
  partsTotal: number;
  deliveryFee: number;
  tax?: number;
  grandTotal: number;
}

export interface Quote {
  quoteId: string;
  requestId: string;
  partnerId: string;
  lines: Array<QuoteLine>;
  totals: QuoteTotals;
  etaMinutes?: number; // From Routes API
  validUntil: Date;
  status: QuoteStatus;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName?: string;
  ts: Date;
  actionType: AuditActionType;
  mode?: RequestMode;
  vehicleIds?: Array<string>;
  partnerIds?: Array<string>;
  requestId?: string;
  quoteId?: string;
  diffSummary: string; // Human readable
  beforeSnapshot?: Record<string, unknown>; // Optional references
  afterSnapshot?: Record<string, unknown>;
}

export interface PartnerScore {
  partnerId: string;
  score: number; // 0-100
  explanation: string; // "Best because: +low cost (priceIndex 22), +ETA 18m, +reliability 85"
  costScore: number;
  speedScore: number;
  reliabilityScore: number;
}

export interface ScoringWeights {
  cost: number; // 0-1
  speed: number; // 0-1
  reliability: number; // 0-1
}

export interface PartnerFilters {
  tier?: PartnerTier;
  radiusKm: number;
  types?: string[];
  availability?: 'online' | 'all';
  maxSlaMinutes?: number;
  paymentMethod?: 'invoice' | 'cash' | 'card';
  deliveryRequired?: boolean;
  minReliability?: number;
}

export interface NearbySearchParams {
  center: GeoLocation;
  radiusMeters: number;
  includedTypes?: Array<string>;
  primaryType?: string;
  languageCode?: string;
  regionCode?: string;
  maxResultCount?: number;
  rankPreference?: 'POPULARITY' | 'DISTANCE';
}

export interface RoutesETAParams {
  origin: GeoLocation;
  destination: GeoLocation;
  departureTime?: Date;
  routingPreference?: 'TRAFFIC_AWARE_OPTIMAL' | 'TRAFFIC_AWARE' | 'TRAFFIC_UNAWARE';
}

export interface RoutesETAResult {
  etaMinutes: number;
  distanceMeters: number;
  polyline?: string; // Optional for UI
}
