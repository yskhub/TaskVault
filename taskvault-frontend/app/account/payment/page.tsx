"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PaymentPage() {
  const router = useRouter();
  const [paying, setPaying] = useState(false);

  function handleDummyPayment() {
    setPaying(true);
    setTimeout(() => {
      // Simulate payment success and redirect back to account with upgrade
      router.push("/account?upgrade=pro");
    }, 2000);
  }

  return (
    <main className="flex min-h-screen items-center justify-center text-white px-4 py-10 sm:px-8">
      <div className="w-full max-w-md rounded-xl bg-slate-900/80 p-8 shadow-xl border border-slate-800 space-y-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Upgrade to Pro</h1>
        <p className="text-slate-300 mb-4">Proceed to payment to unlock Pro features.</p>
        <div className="mb-6">
          <img src="https://razorpay.com/favicon.ico" alt="Razorpay" className="mx-auto mb-2 w-10 h-10" />
          <div className="text-lg font-semibold text-emerald-300">₹499.00</div>
          <div className="text-xs text-slate-400">(Demo payment, no real charge)</div>
        </div>
        <button
          type="button"
          onClick={handleDummyPayment}
          disabled={paying}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2 text-base font-semibold text-white shadow-sm shadow-blue-500/40 hover:bg-blue-500 disabled:opacity-60"
        >
          {paying ? "Processing..." : "Pay with Razorpay"}
        </button>
      </div>
    </main>
  );
}
