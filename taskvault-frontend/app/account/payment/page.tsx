"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PaymentPage() {
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const paymentMethods = [
    { id: "credit", label: "Credit Card", icon: "💳" },
    { id: "debit", label: "Debit Card", icon: "🏦" },
    { id: "googlepay", label: "Google Pay", icon: "🟩" },
    { id: "applepay", label: "Apple Pay", icon: "🍏" },
    { id: "upi", label: "UPI", icon: "🇮🇳" },
    { id: "netbanking", label: "Net Banking", icon: "🏦" },
  ];

  function handleDummyPayment() {
    if (!selectedMethod) return;
    setPaying(true);
    setTimeout(() => {
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
        <div className="mb-6">
          <div className="mb-2 text-sm font-semibold text-slate-200">Choose payment method:</div>
          <div className="flex flex-col gap-2 items-stretch">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                className={`flex items-center gap-3 rounded-md border px-4 py-2 text-base font-medium transition-colors ${selectedMethod === method.id ? "bg-accent text-white border-accent" : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"}`}
                onClick={() => setSelectedMethod(method.id)}
                disabled={paying}
              >
                <span className="text-xl">{method.icon}</span>
                {method.label}
                {selectedMethod === method.id && (
                  <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Selected</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={handleDummyPayment}
          disabled={paying || !selectedMethod}
          className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2 text-base font-semibold text-white shadow-sm shadow-blue-500/40 hover:bg-blue-500 disabled:opacity-60"
        >
          {paying ? "Processing..." : selectedMethod ? `Pay with ${paymentMethods.find(m => m.id === selectedMethod)?.label}` : "Select payment method"}
        </button>
      </div>
    </main>
  );
}
