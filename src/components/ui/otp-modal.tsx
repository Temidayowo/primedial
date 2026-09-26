"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";

// Paystack has no hosted UI for the OTP step of a saved-card charge
// (unlike the popup, which handles this itself for a new card) - this is
// that missing step, built by us.
export function OtpModal({
  open,
  displayText,
  onSubmit,
  onClose,
}: {
  open: boolean;
  displayText: string;
  onSubmit: (otp: string) => Promise<void>;
  onClose: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setIsPending(true);
    try {
      await onSubmit(otp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect OTP");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Verify Your Card" description={displayText}>
      <div className="space-y-4">
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-blue placeholder:text-slate-400 focus:border-blue focus:outline-none"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || otp.length === 0}
          className="w-full rounded-lg bg-green py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue disabled:opacity-60"
        >
          {isPending ? "Verifying..." : "Verify"}
        </button>
      </div>
    </Modal>
  );
}
