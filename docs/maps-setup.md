# Google Maps Platform Setup Guide

## Overview

This guide explains how to set up Google Maps Platform APIs for the Parts Radar feature.

## Required APIs

1. **Maps JavaScript API** - For displaying the map
2. **Places API (New)** - For partner discovery
3. **Routes API** - For ETA calculations

## Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### 2. Enable APIs

Enable the following APIs in your project:

1. **Maps JavaScript API**
   - Go to APIs & Services > Library
   - Search for "Maps JavaScript API"
   - Click "Enable"

2. **Places API (New)**
   - Search for "Places API (New)"
   - Click "Enable"

3. **Routes API**
   - Search for "Routes API"
   - Click "Enable"

### 3. Create API Key

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "API Key"
3. Copy the API key

### 4. Restrict API Key

**Important**: Restrict your API key for security.

#### Application Restrictions

For client-side (Maps JavaScript API):
- Select "HTTP referrers (web sites)"
- Add your domain(s):
  - `http://localhost:3000/*` (development)
  - `https://yourdomain.com/*` (production)

For server-side (Places API, Routes API):
- Select "IP addresses"
- Add your server IP addresses
- Or use "None" if using server-side proxy

#### API Restrictions

- Select "Restrict key"
- Choose:
  - Maps JavaScript API
  - Places API (New)
  - Routes API

### 5. Configure Environment Variables

Add to your `.env` file:

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_GOOGLE_MAPS_MAP_ID=your_map_id_here  # Optional
GOOGLE_MAPS_PROJECT_ID=your_project_id  # Optional
```

### 6. Create Map ID (Optional)

For custom map styling:

1. Go to Google Maps Platform > Map Styles
2. Create a new map style or use default
3. Copy the Map ID
4. Add to `VITE_GOOGLE_MAPS_MAP_ID`

## Server-Side Proxy Setup

**Critical**: Do not expose your API key to the browser. Use a server-side proxy.

### Example Proxy Endpoint (Node.js/Express)

```javascript
// /api/maps/places/nearby
app.post('/api/maps/places/nearby', async (req, res) => {
  const { center, radiusMeters, includedTypes } = req.body;
  
  const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.formattedAddress',
    },
    body: JSON.stringify({
      includedTypes,
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center,
          radius: radiusMeters,
        },
      },
    }),
  });
  
  const data = await response.json();
  res.json(data);
});
```

## Billing & Quotas

### Free Tier

- Maps JavaScript API: $200 free credit/month
- Places API (New): Pay-as-you-go
- Routes API: Pay-as-you-go

### Cost Optimization

1. **Use FieldMask** - Request only needed fields
2. **Cache Results** - Cache Places and ETA results
3. **Rate Limiting** - Limit API calls per user
4. **Batch Requests** - Combine multiple requests when possible

## Testing

1. Start development server: `npm run dev`
2. Open browser console
3. Check for Google Maps API errors
4. Test partner search functionality

## Troubleshooting

### "This page can't load Google Maps correctly"

- Check API key is correct
- Verify API restrictions allow your domain
- Ensure Maps JavaScript API is enabled

### "Places API error"

- Verify Places API (New) is enabled
- Check API key restrictions
- Ensure server-side proxy is configured

### "Routes API error"

- Verify Routes API is enabled
- Check billing is enabled
- Ensure API key has Routes API access

## Security Best Practices

1. **Never commit API keys** - Use environment variables
2. **Restrict API keys** - Use application and API restrictions
3. **Use server-side proxy** - Don't expose keys to client
4. **Monitor usage** - Set up billing alerts
5. **Rotate keys** - Regularly rotate API keys

## Compliance

- Follow [Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms)
- Follow [Places API Policies](https://developers.google.com/maps/documentation/places/web-service/policies)
- Provide required attributions in UI
- Handle EEA user consent if applicable

## Support

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Places API (New) Guide](https://developers.google.com/maps/documentation/places/web-service)
- [Routes API Guide](https://developers.google.com/maps/documentation/routes)
