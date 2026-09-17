import posthog from 'posthog-js'

const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined

if (key) {
  posthog.init(key, {
    api_host: (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
  })
}

/** No-op when VITE_POSTHOG_KEY is unset (local dev). */
export function track(event: string, props?: Record<string, string | number | boolean>) {
  if (key) posthog.capture(event, props)
}
