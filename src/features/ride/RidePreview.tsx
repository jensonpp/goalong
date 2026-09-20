import { useState, type ReactNode } from 'react'
import { Button } from '../../components/Button'
import { generateWhatsAppMessage, whatsAppShareUrl } from './whatsapp'
import type { Ride } from './rideTypes'
import { formatDate, formatTime } from '../../lib/dates'
import { track } from '../../lib/analytics'

interface Props {
  ride: Ride
  onEdit: () => void
  onReset: () => void
}

export function RidePreview({ ride, onEdit, onReset }: Props) {
  const [shared, setShared] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [copied, setCopied] = useState(false)
  const message = generateWhatsAppMessage(ride)
  const canWebShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      track('message_copied')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setShowMessage(true) // user can long-press to copy
    }
  }

  const webShare = async () => {
    try {
      await navigator.share({ text: message })
      track('web_share_completed')
      setShared(true)
    } catch {
      // user cancelled – nothing to do
    }
  }

  if (shared) {
    return (
      <div className="space-y-4 text-center">
        <h2 className="text-sm font-medium">
          <span className="text-[#006d39]">Ride posted to WhatsApp ✓</span>
        </h2>
        <p className="text-sm text-slate-500">
          {ride.from} → {ride.to} · {formatDate(ride.date)} {formatTime(ride.departureTime)}
        </p>
        <Button onClick={onReset}>Create Another Ride</Button>
        <Button variant="ghost" onClick={() => setShowMessage((s) => !s)}>
          {showMessage ? 'Hide Message' : 'View Message'}
        </Button>
        {showMessage && <MessageBox message={message} />}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onReset}
        aria-label="Back to Post a Ride"
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-2xl text-slate-600 active:bg-brand-50"
      >
        ←
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-medium text-[#006d39]">Ride created successfully ✓</p>
        <h2 className="mt-2 text-xl font-bold">
          {ride.from} <span className="text-brand-700">→</span> {ride.to}
        </h2>
        <p className="mt-2 text-slate-700">
          {formatDate(ride.date)} · {formatTime(ride.departureTime)}
        </p>
        <p className="text-slate-700">
          {ride.availableSeats} seat{ride.availableSeats === 1 ? '' : 's'} available
        </p>
        {ride.pickupPoints.length > 0 && <p className="mt-2 text-sm text-slate-500">Passing through: {ride.pickupPoints.join(' → ')}</p>}
        {ride.notes && <p className="mt-1 text-sm text-slate-500">{ride.notes}</p>}
      </div>

      <p className="text-center text-sm font-medium text-slate-600">Your WhatsApp message is ready</p>

      <a
        href={whatsAppShareUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          track('whatsapp_share_clicked')
          setShared(true)
          setShowMessage(false)
        }}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-black px-4 font-semibold text-white active:brightness-95"
      >
        SHARE TO WHATSAPP
      </a>

      <div className="flex justify-center gap-3">
        <IconButton label={copied ? 'Copied' : 'Copy message'} onClick={copy}>
          {copied ? (
            <path d="M20 6 9 17l-5-5" />
          ) : (
            <>
              <rect width="14" height="14" x="8" y="8" rx="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </>
          )}
        </IconButton>
        <IconButton label="Edit ride" onClick={onEdit}>
          <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497zM15 5l4 4" />
        </IconButton>
        {canWebShare && (
          <IconButton label="Share" onClick={webShare}>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
          </IconButton>
        )}
      </div>

      <Button variant="ghost" onClick={() => setShowMessage((s) => !s)}>
        {showMessage ? 'Hide preview' : 'Preview message'}
      </Button>
      {showMessage && <MessageBox message={message} />}
    </div>
  )
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 active:bg-slate-100"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  )
}

function MessageBox({ message }: { message: string }) {
  return (
    <pre className="whitespace-pre-wrap rounded-2xl bg-brand-50 p-4 text-left font-sans text-sm text-slate-800 select-all">
      {message}
    </pre>
  )
}
