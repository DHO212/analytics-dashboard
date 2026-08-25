"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { SquaresFour, EnvelopeSimple, Lock, GoogleLogo, MicrosoftOutlookLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/executive";
    }, 1000);
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[rgb(var(--bg))] px-4">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgb(var(--text)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--text)) 1px, transparent 1px)`,
          backgroundSize: `48px 48px`,
        }}
      />
      {/* Subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className="relative w-full max-w-[380px]"
      >
        {/* Logo mark */}
        <div className="mb-8 flex flex-col items-start">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_20px_-4px_rgba(79,70,229,0.5)]">
            <SquaresFour size={22} weight="fill" className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "rgb(var(--text))" }}>Meridian</h1>
          <p className="mt-1 text-sm" style={{ color: "rgb(var(--text-2))" }}>Sign in to your analytics workspace</p>
        </div>

        {/* Card */}
        <div className="card p-6">
          {/* OAuth Buttons */}
          <div className="space-y-2 mb-5">
            <button className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-2.5 text-sm font-medium text-[rgb(var(--text))] transition-all hover:bg-[rgb(var(--surface-2))] active:scale-[0.98]">
              <GoogleLogo size={16} />
              Continue with Google
            </button>
            <button className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-2.5 text-sm font-medium text-[rgb(var(--text))] transition-all hover:bg-[rgb(var(--surface-2))] active:scale-[0.98]">
              <MicrosoftOutlookLogo size={16} />
              Continue with Microsoft
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgb(var(--border))]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[rgb(var(--surface))] px-3 text-xs" style={{ color: "rgb(var(--text-2))" }}>or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "rgb(var(--text-2))" }}>Email</label>
              <div className="relative">
                <EnvelopeSimple size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgb(var(--text-2))" }} />
                <input
                  id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com" required
                  className="h-10 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] pl-9 pr-3 text-sm placeholder:text-[rgb(var(--text-2))] transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  style={{ color: "rgb(var(--text))" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide" style={{ color: "rgb(var(--text-2))" }}>Password</label>
                <button type="button" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Forgot?</button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgb(var(--text-2))" }} />
                <input
                  id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" required
                  className="h-10 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] pl-9 pr-3 text-sm placeholder:text-[rgb(var(--text-2))] transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  style={{ color: "rgb(var(--text))" }}
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-1" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs" style={{ color: "rgb(var(--text-2))" }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
