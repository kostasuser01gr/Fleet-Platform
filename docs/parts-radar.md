# Parts Radar - Architecture & Documentation

## Overview

Parts Radar is a real-time map-based partner discovery and parts request management system integrated into the Fleet Management Tool. It combines Google Maps integration with internal partner management to provide a comprehensive workflow from discovery to order fulfillment.

## Architecture

### Components

1. **PartsRadarPanel** - Main container component
2. **PartnerMap** - Google Maps integration with markers
3. **PartnerFilters** - Filter controls (tier, radius, availability, etc.)
4. **PartnerList** - Ranked partner cards with scoring
5. **RequestBuilder** - Create parts requests
6. **QuoteComparison** - Compare and approve quotes
7. **AddPartnerModal** - Admin: Add custom partners
8. **ImportPartnerModal** - Admin: Import from Google Places

### Services

1. **MapsService** - Google Maps API proxy (Places, Routes, Geocoding)
2. **PartsService** - Partner, request, and quote management
3. **AuditService** - Audit logging for all actions

### Data Model

See `src/types/partsRadar.ts` for complete type definitions:

- **CustomPartner** - Internal partner records
- **PlaceResult** - Cached Google Places results
- **PartsRequest** - Parts request workflow
- **Quote** - Partner quotes for requests
- **AuditLog** - Audit trail entries

## API Endpoints

### Maps API (Server-Side Proxy Required)

```
POST /api/maps/places/nearby
POST /api/maps/places/details
POST /api/maps/places/textsearch
POST /api/maps/routes/eta
POST /api/maps/geocode
```

### Parts API

```
GET    /api/parts/partners
POST   /api/parts/partners
PUT    /api/parts/partners/:id
DELETE /api/parts/partners/:id
GET    /api/parts/requests
POST   /api/parts/requests
PUT    /api/parts/requests/:id
GET    /api/parts/quotes
POST   /api/parts/quotes
PUT    /api/parts/quotes/:id
GET    /api/parts/audit
```

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

**Important**: In production, these should be server-side environment variables. The `VITE_` prefix exposes them to the client, so use a server-side proxy for the actual API calls.

## Permissions

- **Viewer**: Can view partners, requests, quotes
- **Operator**: Can create requests, view quotes
- **Manager**: Can approve quotes, update request status
- **Admin**: Can create/edit partners, import from Places, verify partners, view audit logs

## Scoring Model

Partners are ranked using a weighted scoring formula:

```typescript
score = (costScore * costWeight) + (speedScore * speedWeight) + (reliabilityScore * reliabilityWeight)
```

Default weights:
- Cost: 0.4
- Speed: 0.3
- Reliability: 0.3

Users can toggle between:
- "Optimize for Cost" - cost: 0.6, speed: 0.2, reliability: 0.2
- "Optimize for Speed" - cost: 0.2, speed: 0.6, reliability: 0.2
- "Balanced" - cost: 0.4, speed: 0.3, reliability: 0.3

## Real-time Updates

- Partners: Listen to `partner_update` events for `isOnline`, `tier`, `reliabilityIndex` changes
- Quotes: Listen to `quote_update` events for status changes
- Requests: Listen to `request_update` events for status transitions

## Workflow

1. **Discovery**: User searches/browses partners on map
2. **Request Creation**: User creates parts request (single or bulk mode)
3. **Quote Collection**: Partners provide quotes (manual entry in MVP)
4. **Comparison**: System ranks quotes, user compares
5. **Approval**: Manager approves best quote
6. **Order**: Status changes to "ordered"
7. **Receipt**: Mark as "received" when parts arrive
8. **Close**: Finalize request

## Integration Points

### VehicleEditor
- Parts Radar is available as the 4th tab in VehicleEditor
- Single mode: Shows context for selected vehicle
- Accessible from vehicle detail view

### Future Enhancements
- Bulk mode from fleet selection
- Integration with existing "partners" tab in main app
- Automated quote collection via partner portal
- Email/WhatsApp integration for request sending

## Testing

See `src/data/mockPartsRadar.ts` for mock data.

To test:
1. Ensure Google Maps API key is configured
2. Open VehicleEditor for any vehicle
3. Navigate to "Parts Radar" tab
4. Test partner discovery, request creation, quote comparison

## Compliance Notes

- Follow Google Places API policies and Maps Platform terms
- Ensure Google content is displayed on Google Map only
- Use FieldMask to minimize data returned
- Provide required attributions in UI
- Handle EEA terms if billing address is in EEA
