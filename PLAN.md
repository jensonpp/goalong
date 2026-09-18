# SameWay — Plan & Status

Last updated: 2026-09-17
Production: https://sameway.in (Cloudflare Worker, Git-connected, auto-deploys on push to `main`)

## Phase 1 — Ride Creation Assistant

Goal: CREATE RIDE → GENERATE WHATSAPP MESSAGE → SHARE TO WHATSAPP, in < 20 s. No login, no backend.

### Completed ✅

| Area | Status | Notes |
|---|---|---|
| Project scaffold | ✅ | Vite 6 + React 19 + TS + Tailwind v4. Deps: react, react-dom, posthog-js |
| Post a Ride form | ✅ | From/To (free text + suggestion chips), Date (Today/Tomorrow/native picker), Time (native), Seats stepper 1–8, Pickup points (add/remove/custom), Notes |
| Validation | ✅ | Inline errors: from, to, date, time, seats range |
| Ride object + localStorage | ✅ | `RideRepository.createRide/getRides`, key `sameway.rides` |
| WhatsApp message | ✅ | Pure `generateWhatsAppMessage(ride)`, exact spec format, self-check `npm test` |
| Share screen | ✅ | SHARE TO WHATSAPP (`wa.me/?text=`), COPY MESSAGE, Share… (Web Share API, only if supported), EDIT RIDE, Preview message |
| After-share screen | ✅ | "Ride posted to WhatsApp", Create Another Ride, View Message |
| Mobile-first layout | ✅ | Verified 360/375/412 px, no horizontal overflow; desktop centered max-w-md; sticky bottom CTA |
| PWA | ✅ | manifest, SVG + 192/512 PNG icons, theme-color, apple meta. No service worker |
| Cloudflare deploy | ✅ | Git-connected Worker (static assets). Build `npm run build`, output `dist`, `NODE_VERSION=20`. `_redirects` removed |
| Analytics (PostHog) | ✅ | `$pageview`, `ride_created`, `whatsapp_share_clicked`, `message_copied`, `web_share_completed`. Enabled via `VITE_POSTHOG_KEY` build var |
| Repo hygiene | ✅ | `.gitignore` covers node_modules, dist, env files; `.env.example` placeholder |

### Pending / Open ⏳

| Item | Priority | Notes |
|---|---|---|
| Real-user test in "Cherthala CarPoolers 2026" | High | Confirm < 20 s flow on actual phones (Android Chrome, iOS Safari). Check WhatsApp opens with message pre-filled |
| `ride_created` full payload | Medium | Currently sends from/to/seats/pickup count. Add date, time, pickup names, notes so PostHog holds complete ride record |
| Central ride storage | Medium | Options evaluated: Cloudflare D1 (recommended, free, same Worker), Supabase, Sheets. Not started. Keep localStorage as offline fallback |
| `sameway.in` URL | Low | Currently deployed as Worker → `*.workers.dev`. If `pages.dev` needed: recreate as Pages project (same build settings) |
| Bundle size | Low | posthog-js adds ~200 kB gzip. Swap to `posthog-js-lite` if load slow on 3G |
| Node version | Low | Local Node 20.18 → Vite pinned to 6, wrangler v4 unusable locally. Upgrade to Node 22 to unpin |
| Service worker / offline | Low | Deferred by spec. Add only if install prompt or offline required |

## Explicitly NOT in scope (later phases)

Phase 2 ride discovery · Phase 3 seat requests · Phase 4 seat management · Phase 5 profiles/trust · Phase 6 recurring commute · Phase 7 payments.
No login, no OTP, no maps, no booking, no notifications, no admin.

## How to run

```sh
npm install
npm run dev        # http://localhost:5173
npm test           # WhatsApp message self-check
npm run build      # tsc + vite → dist/
```

Env (optional): copy `.env.example` → `.env.local`, set `VITE_POSTHOG_KEY`.
