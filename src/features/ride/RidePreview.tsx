import { useState } from 'react'
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
          Ride posted to WhatsApp <span className="text-[#006d39]">✓</span>
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

      <Button variant="secondary" onClick={copy}>
        {copied ? 'Copied ✓' : 'COPY MESSAGE'}
      </Button>

      {canWebShare && (
        <Button variant="secondary" onClick={webShare}>
          SHARE
        </Button>
      )}

      <Button variant="ghost" onClick={onEdit}>
        EDIT RIDE
      </Button>

      <Button variant="ghost" onClick={() => setShowMessage((s) => !s)}>
        {showMessage ? 'Hide preview' : 'Preview message'}
      </Button>
      {showMessage && <MessageBox message={message} />}
    </div>
  )
}

function MessageBox({ message }: { message: string }) {
  return (
    <pre className="whitespace-pre-wrap rounded-2xl bg-brand-50 p-4 text-left font-sans text-sm text-slate-800 select-all">
      {message}
    </pre>
  )
}
