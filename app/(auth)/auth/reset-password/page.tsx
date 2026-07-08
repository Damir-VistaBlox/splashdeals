"use client";
import { Icon } from "@/components/ui/Icon";
import { useState, Suspense, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorBanner, PasswordInput } from "../_components";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const callbackUrl = searchParams.get("callbackUrl") || "/auth/login";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;

    if (password.length < 8) {
      setError("Password security failure: Minimum 8 characters required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Validation mismatch: Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (resetError) {
        setError(
          resetError.message ||
            "The reset link has expired or is invalid. Please request a new link.",
        );
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(callbackUrl);
      }, 3000);
    } catch {
      setError("Network encryption failure. Please verify your connection.");
      setLoading(false);
    }
  }

  if (!token && !success) {
    return (
      <Card className="space-y-6 border-red-500/10 bg-red-500/5 p-8 text-center backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
          <Icon name="error" className="text-[32px]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black tracking-tight text-red-400 uppercase">
            Invalid Token
          </h2>
          <p className="text-xs leading-relaxed font-medium text-slate-500" role="alert">
            The password reset token is missing or malformed. Please request a new link.
          </p>
        </div>
        <Button
          asChild
          className="h-10 rounded-xl bg-red-500 px-8 text-[10px] font-black tracking-widest text-white uppercase hover:bg-red-600"
        >
          <Link href={`/auth/forgot-password?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
            Request New Token
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <div>
      <Card className="overflow-hidden border-white/5 bg-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-center text-2xl font-black tracking-tight uppercase">
            {success ? "Success" : "Define New Secret"}
          </CardTitle>
          <CardDescription className="text-center text-xs leading-relaxed font-medium text-slate-500">
            {success
              ? "Your administrative credentials have been updated successfully."
              : "Establish a robust new password for your partner account."}
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          {success ? (
            <div className="flex flex-col items-center space-y-6 py-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Icon name="check_circle" className="text-[40px]" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-sm font-black tracking-widest text-emerald-400 uppercase">
                  Identity Updated
                </h3>
                <p className="text-[11px] font-medium text-slate-500">
                  Redirecting to the secure login gateway in 3 seconds...
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                className="text-[10px] font-black tracking-widest text-cyan-500 uppercase"
              >
                <Link href={callbackUrl}>Click if not redirected</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {error && <ErrorBanner message={error} />}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="new-password"
                    className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase"
                  >
                    New Security Credential
                  </Label>
                  <PasswordInput
                    id="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    showPassword={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                    placeholder="Min. 8 characters"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirm-password"
                    className="ml-1 text-[10px] font-black tracking-widest text-slate-500 uppercase"
                  >
                    Confirm New Credential
                  </Label>
                  <PasswordInput
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    showPassword={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                    placeholder="Repeat password"
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !password || !confirmPassword}
                  className="group h-12 w-full rounded-xl bg-cyan-500 text-xs font-black tracking-widest text-slate-950 uppercase shadow-lg shadow-cyan-500/20 transition-all hover:bg-cyan-400"
                >
                  {loading ? (
                    <Icon name="progress_activity" className="animate-spin text-[16px]" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Update Security Key
                      <Icon name="security" className="text-[16px]" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          )}
        </CardContent>

        {!success && (
          <CardFooter className="justify-center border-t border-white/5 bg-black/20 py-4">
            <p className="text-center text-[9px] font-medium tracking-tight text-slate-600 uppercase">
              Recovery Session Active &bull; IP: logged
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Icon name="progress_activity" className="animate-spin text-[32px] text-cyan-500/50" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
