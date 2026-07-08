"use client";
import { Icon } from "@/components/ui/Icon";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorBanner } from "../_components";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error: forgotError } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/auth/reset-password",
      });

      if (forgotError) {
        setError(forgotError.message || "Could not process request. Please try again later.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please contact system security.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Card className="overflow-hidden border-white/5 bg-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-center text-2xl font-black tracking-tight uppercase">
            {success ? "Link Dispatched" : "Recover Access"}
          </CardTitle>
          <CardDescription className="text-center text-xs leading-relaxed font-medium text-slate-500">
            {success
              ? "We've sent a secure recovery link to your registered email address."
              : "Enter your administrative email to receive a secure password reset link."}
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          {success ? (
            <div className="flex flex-col items-center space-y-6 py-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                <Icon name="check_circle" className="text-[40px]" />
              </div>
              <div className="space-y-2 text-center">
                <p className="text-sm font-bold text-slate-200">{email}</p>
                <p className="text-[11px] leading-relaxed font-medium text-slate-500">
                  If this account exists in our partner database, <br /> you will receive a reset
                  link shortly.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-xl border-white/10 bg-white/5 px-6 text-[10px] font-black tracking-widest text-slate-300 uppercase hover:bg-white/10"
              >
                <Link href="/auth/login">Return to Gateway</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {error && <ErrorBanner message={error} />}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase"
                  >
                    Identity Verification Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@splashdeals.rs"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 rounded-xl border-white/10 bg-white/5 transition-all placeholder:text-slate-700 focus-visible:ring-cyan-500/50"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="group h-12 w-full rounded-xl bg-cyan-500 text-xs font-black tracking-widest text-slate-950 uppercase shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-400"
                >
                  {loading ? (
                    <Icon name="progress_activity" className="animate-spin text-[16px]" />
                  ) : (
                    "Dispatch Reset Link"
                  )}
                </Button>
              </form>
            </div>
          )}
        </CardContent>

        {!success && (
          <CardFooter className="justify-center border-t border-white/5 bg-black/20 py-4">
            <Link
              href="/auth/login"
              className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase transition-colors hover:text-cyan-400"
            >
              <Icon name="arrow_back" className="text-[12px]" />
              Back to Login
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
