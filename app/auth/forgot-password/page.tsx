"use client";
import { Icon } from "@/components/ui/Icon";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 📧 Forgot Password Page
 * Allows administrators to request a recovery link.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
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
    } catch (err) {
      setError("An unexpected error occurred. Please contact system security.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="border-white/5 bg-white/5 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-2xl font-black uppercase tracking-tight text-center">
            {success ? "Link Dispatched" : "Recover Access"}
          </CardTitle>
          <CardDescription className="text-center text-slate-500 font-medium text-xs leading-relaxed">
            {success 
              ? "We've sent a secure recovery link to your registered email address."
              : "Enter your administrative email to receive a secure password reset link."
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center py-4 space-y-6"
              >
                <div className="h-20 w-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Icon name="check_circle" className="text-[40px]" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-bold text-slate-200">{email}</p>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    If this account exists in our partner database, <br /> you will receive a reset link shortly.
                  </p>
                </div>
                <Button 
                  asChild
                  variant="outline"
                  className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl"
                >
                  <Link href="/auth/login">Return to Gateway</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div key="form-view" className="space-y-6">
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                    <Icon name="error" className="text-[16px] text-red-400 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-red-400 font-bold leading-relaxed">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
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
                      className="h-12 bg-white/5 border-white/10 focus-visible:ring-cyan-500/50 rounded-xl transition-all placeholder:text-slate-700"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading || !email}
                    className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-cyan-500/20 group transition-all"
                  >
                    {loading ? (
                      <Icon name="progress_activity" className="text-[16px] animate-spin" />
                    ) : (
                      "Dispatch Reset Link"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        {!success && (
          <CardFooter className="justify-center border-t border-white/5 bg-black/20 py-4">
            <Link 
              href="/auth/login" 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <Icon name="arrow_back" className="text-[12px]" />
              Back to Login
            </Link>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
