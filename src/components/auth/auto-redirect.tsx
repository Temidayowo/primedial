"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AutoRedirect({ to, delaySeconds = 3 }: { to: string; delaySeconds?: number }) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(delaySeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.push(to);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, router, to]);

  return (
    <p className="mt-3 text-xs text-slate-400">
      Redirecting to log in in {secondsLeft}...
    </p>
  );
}
