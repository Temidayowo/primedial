// Client-side helper for Paystack's inline popup (v2). Loaded as a plain
// <script> tag on demand rather than the `react-paystack` package, which
// as of this writing hasn't published a build compatible with React 19's
// peer dependency range.
//
// Popup v2 API reference: https://paystack.com/docs/payments/accept-payments/#popup
// `PaystackPop` is a constructor, not a static namespace - you must
// `new` it before calling `newTransaction()` on the instance, or you'll
// get "PaystackPop.newTransaction is not a function".
// Double check `onSuccess`'s callback argument shape against Paystack's
// current docs if this starts misbehaving - it's documented as
// `{ reference, status, message, trans, transaction, trxref }` but Paystack
// has added fields to this over time.
export interface PaystackTransaction {
  reference: string;
  status?: string;
  message?: string;
}

interface OpenPaystackPopupParams {
  publicKey: string;
  email: string;
  amountKobo: number;
  reference: string;
  channels: string[];
  onSuccess: (transaction: PaystackTransaction) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    PaystackPop?: new () => {
      newTransaction: (config: Record<string, unknown>) => void;
    };
  }
}

const SCRIPT_ID = "paystack-inline-js";

function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Paystack popup requires a browser"));
  }
  if (window.PaystackPop) return Promise.resolve();

  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  // A <script> tag's load/error event only ever fires once. If an
  // earlier attempt this page session failed to load it (a transient
  // network blip, a browser extension blocking js.paystack.co), every
  // later checkout attempt found this same dead tag still sitting in the
  // DOM and attached listeners that would never fire again - the popup
  // just silently never appeared, with no error shown, until a full page
  // reload. Drop a tag that's already known to have failed and issue a
  // fresh request instead of reusing it.
  if (script?.dataset.status === "failed") {
    script.remove();
    script = null;
  }

  if (script) {
    return new Promise((resolve, reject) => {
      script!.addEventListener("load", () => resolve());
      script!.addEventListener("error", () =>
        reject(new Error("Failed to load Paystack")),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const newScript = document.createElement("script");
    newScript.id = SCRIPT_ID;
    newScript.dataset.status = "loading";
    newScript.src = "https://js.paystack.co/v2/inline.js";
    newScript.async = true;
    newScript.onload = () => {
      newScript.dataset.status = "loaded";
      resolve();
    };
    newScript.onerror = () => {
      newScript.dataset.status = "failed";
      reject(new Error("Failed to load Paystack"));
    };
    document.body.appendChild(newScript);
  });
}

export async function openPaystackPopup(params: OpenPaystackPopupParams) {
  await loadPaystackScript();

  if (!window.PaystackPop) {
    throw new Error("Paystack failed to initialize");
  }

  const paystack = new window.PaystackPop();

  paystack.newTransaction({
    key: params.publicKey,
    email: params.email,
    amount: params.amountKobo,
    currency: "NGN",
    reference: params.reference,
    channels: params.channels,
    onSuccess: (transaction: PaystackTransaction) => params.onSuccess(transaction),
    onCancel: () => params.onCancel(),
  });
}
