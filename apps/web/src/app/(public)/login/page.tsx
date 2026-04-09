"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/Providers";

const LinkedInIcon = () => (
  <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TargetIcon = () => (
  <svg className="size-8" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.5" />
    <line
      x1="16"
      y1="3"
      x2="16"
      y2="8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="16"
      y1="24"
      x2="16"
      y2="29"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="3"
      y1="16"
      x2="8"
      y2="16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="24"
      y1="16"
      x2="29"
      y2="16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="16" cy="16" r="2.5" fill="currentColor" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);

  function handleSignIn() {
    setLoading(true);
    router.push("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="mb-8 text-primary">
          <TargetIcon />
        </div>

        <h1
          className="text-4xl font-semibold tracking-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          <span className="text-muted-foreground/60">
            {t.auth.headlineLine1}
          </span>
          <br />
          <span className="text-foreground">{t.auth.headlineLine2}</span>
        </h1>

        <Button
          onClick={handleSignIn}
          disabled={loading}
          className="mt-10 w-full max-w-sm text-base font-medium"
          size="xl"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LinkedInIcon />
          )}
          {loading ? t.profile.syncing : t.auth.signInWith}
        </Button>

        <p className="mt-4 w-full max-w-106 text-[11px] leading-[1.7] text-muted-foreground/70">
          By clicking &ldquo;Continue with LinkedIn&rdquo;, you acknowledge that
          you have read, understood, and agree to Scouty&apos;s{" "}
          <span className="cursor-pointer text-muted-foreground underline underline-offset-2 hover:text-primary transition-colors">
            Terms &amp; Conditions
          </span>{" "}
          and{" "}
          <span className="cursor-pointer text-muted-foreground underline underline-offset-2 hover:text-primary transition-colors">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
}
