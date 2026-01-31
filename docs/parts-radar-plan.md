# Parts Radar Implementation Plan

## Architecture Overview

### Tech Stack
- **Framework**: React + Vite (SPA, no Next.js router)
- **UI**: shadcn/ui (Radix UI) + Tailwind CSS
- **Maps**: Google Maps JavaScript API + Places API (New) + Routes API
- **State**: React hooks (useState, useEffect, useContext)
- **API**: APIService (REST patterns, interceptors, caching)
- **Real-time**: RealtimeService (WebSocket-like patterns)
- **Auth**: AuthContext (roles: admin, manager, operator, viewer)

### Integration Points
- **VehicleEditor**: Add "Parts Radar" tab (8th tab after existing tabs)
- **App.tsx**: Add "Parts Radar" as optional standalone tab (or integrate into existing "partners" tab)
- **API Layer**: Extend APIService with maps/parts endpoints
- **Real-time**: Extend RealtimeService for partner/quote updates

---

## Files to Create/Modify

### New Type Definitions
- `src/types/partsRadar.ts` - Partner (extended), PartsRequest, Quote, AuditLog types
- `src/types/maps.ts` - Google Maps/Places/Routes response types

### New Services
- `src/services/mapsService.ts` - Google Maps API client (server-side proxy endpoints)
- `src/services/partsService.ts` - Parts request/quotes management
- `src/services/auditService.ts` - Audit logging

### New Components
- `src/components/partsRadar/PartsRadarPanel.tsx` - Main container
- `src/components/partsRadar/PartnerMap.tsx` - Google Maps with markers/clustering
- `src/components/partsRadar/PartnerFilters.tsx` - Filter controls
- `src/components/partsRadar/PartnerList.tsx` - Ranked partner cards
- `src/components/partsRadar/PartnerDetailsDrawer.tsx` - Partner info + actions
- `src/components/partsRadar/RequestBuilder.tsx` - Create parts request
- `src/components/partsRadar/QuoteComparison.tsx` - Compare quotes table
- `src/components/partsRadar/AddPartnerModal.tsx` - Admin: add custom partner
- `src/components/partsRadar/ImportPartnerModal.tsx` - Admin: import from Places

### Modified Files
- `src/components/VehicleEditor.tsx` - Add "Parts Radar" tab
- `src/App.tsx` - Optionally enhance "partners" tab with Parts Radar
- `src/services/apiService.ts` - Add maps/parts endpoints
- `package.json` - Add Google Maps dependencies

### Documentation
- `docs/parts-radar.md` - Architecture, endpoints, env vars, permissions
- `docs/maps-setup.md` - Google Maps API setup guide

---

## Data Model

### Custom Partner (Extended)
```typescript
interface CustomPartner {
  partnerId: string;
  source: 'custom' | 'google_places';
  placeId?: string;
  name: string;
  geo: { lat: number; lng: number };
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  types: string[]; // ['car_repair', 'parts_store', ...]
  tier: 'economy' | 'standard' | 'premium';
  priceIndex: number; // 0-100
  reliabilityIndex: number; // 0-100
  slaMinutesTypical: number;
  delivery: { pickup: boolean; delivery: boolean; deliveryFeeBase: number };
  paymentTerms: { invoice: boolean; cash: boolean; card: boolean };
  coverageBranches: string[];
  isActive: boolean;
  isVerified: boolean;
  lastHeartbeatAt?: Date;
  isOnline: boolean;
  notes?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}
```

### Parts Request
```typescript
interface PartsRequest {
  requestId: string;
  createdAt: Date;
  createdBy: string;
  mode: 'single' | 'bulk';
  vehicleIds: string[];
  branchId?: string;
  partLines: PartLine[];
  constraints: RequestConstraints;
  status: 'draft' | 'sent' | 'quoted' | 'approved' | 'ordered' | 'received' | 'closed' | 'cancelled';
  selectedPartnerId?: string;
  selectedQuoteId?: string;
  updatedAt: Date;
  updatedBy: string;
}
```

### Quote
```typescript
interface Quote {
  quoteId: string;
  requestId: string;
  partnerId: string;
  lines: QuoteLine[];
  totals: QuoteTotals;
  etaMinutes?: number;
  validUntil: Date;
  status: 'offered' | 'revised' | 'accepted' | 'rejected';
  updatedAt: Date;
}
```

---

## API Endpoints (Server-Side Proxy)

### Maps API
- `POST /api/maps/places/nearby` - Places API (New) Nearby Search
- `POST /api/maps/places/details` - Place Details (New)
- `POST /api/maps/places/textsearch` - Text Search (optional)
- `POST /api/maps/routes/eta` - Routes API computeRoutes

### Parts API
- `GET /api/parts/partners` - List partners (custom + cached Places)
- `POST /api/parts/partners` - Create custom partner (admin)
- `PUT /api/parts/partners/:id` - Update partner (admin)
- `GET /api/parts/requests` - List requests
- `POST /api/parts/requests` - Create request
- `PUT /api/parts/requests/:id` - Update request status
- `GET /api/parts/quotes` - List quotes for request
- `POST /api/parts/quotes` - Create/update quote
- `GET /api/parts/audit` - Get audit logs

---

## Environment Variables

```env
# Google Maps API (server-side only)
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_GOOGLE_MAPS_MAP_ID=your_map_id_here  # Optional for styling
GOOGLE_MAPS_PROJECT_ID=your_project_id  # Optional

# Feature flags
VITE_GOOGLE_MAPS_PLACES_ENABLED=true
VITE_GOOGLE_MAPS_ROUTES_ENABLED=true
```

**Note**: In production, these should be server-side env vars. For Vite, we'll use `VITE_` prefix but proxy through server endpoints.

---

## Implementation Phases

### Phase 1: Foundation
1. Install dependencies (`@react-google-maps/api` or `@vis.gl/react-google-maps`)
2. Create type definitions
3. Create mapsService (with mock/placeholder for server endpoints)
4. Create basic PartsRadarPanel component

### Phase 2: Map Integration
1. Implement PartnerMap with Google Maps
2. Add marker clustering
3. Integrate Places API (New) nearby search
4. Add Routes API for ETA

### Phase 3: Partner Management
1. PartnerFilters component
2. PartnerList with ranking
3. PartnerDetailsDrawer
4. AddPartnerModal (admin)
5. ImportPartnerModal (admin)

### Phase 4: Request Workflow
1. RequestBuilder component
2. Quote management
3. QuoteComparison component
4. Approval workflow

### Phase 5: Integration & Polish
1. Add Parts Radar tab to VehicleEditor
2. Real-time updates integration
3. Audit logging
4. Scoring model implementation
5. Documentation

---

## Scoring Model

```typescript
interface ScoringWeights {
  cost: number;      // 0-1
  speed: number;    // 0-1 (ETA)
  reliability: number; // 0-1
}

function calculatePartnerScore(
  partner: CustomPartner | PlaceResult,
  quote?: Quote,
  etaMinutes?: number,
  weights: ScoringWeights = { cost: 0.4, speed: 0.3, reliability: 0.3 }
): number {
  // Normalize inputs (0-1 scale)
  const costScore = 1 - (quote?.totals.grandTotal || partner.priceIndex) / 100;
  const speedScore = etaMinutes ? 1 - (etaMinutes / 120) : 0.5; // Max 120 min
  const reliabilityScore = partner.reliabilityIndex / 100;
  
  // Weighted sum
  return (
    costScore * weights.cost +
    speedScore * weights.speed +
    reliabilityScore * weights.reliability
  ) * 100;
}
```

---

## Real-time Updates

- **Partners**: Listen to `partners` collection for `isOnline`, `tier`, `reliabilityIndex` changes
- **Quotes**: Listen to `quotes` collection for status updates
- **Requests**: Listen to `parts_requests` collection for status transitions

Use RealtimeService.subscribe() pattern.

---

## Permissions

- **Viewer**: Can view partners, requests, quotes
- **Operator**: Can create requests, view quotes
- **Manager**: Can approve quotes, update request status
- **Admin**: Can create/edit partners, import from Places, verify partners, view audit logs

---

## Next Steps

1. ✅ Discovery complete
2. ✅ Plan created
3. → Start implementation (Phase 1)
