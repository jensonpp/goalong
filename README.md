# GoAlong

_Going your way? GoAlong._

Phase 1: ride creation assistant for the "Cherthala CarPoolers 2026" WhatsApp group.
Create a ride → generate a WhatsApp message → share it yourself. No login, no backend.

## Develop

```sh
npm install
npm run dev
npm test        # message generator self-check
npm run build   # tsc + vite → dist/
```

Requires Node 20 (see `.nvmrc`).

## Deploy (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `dist`
- `public/_redirects` routes all paths to `index.html`.

Production: https://goalong.pages.dev

## Structure

```
src/
  components/           Button, Field, Chip, LocationInput, SeatStepper, PickupPointInput
  features/ride/
    CreateRidePage.tsx  form + validation
    RidePreview.tsx     share / copy / posted screen
    rideRepository.ts   localStorage (createRide / getRides)
    rideTypes.ts
    whatsapp.ts         generateWhatsAppMessage(ride), whatsAppShareUrl(msg)
  lib/dates.ts
```
