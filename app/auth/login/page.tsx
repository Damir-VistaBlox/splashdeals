"use client";
import { Icon } from "@/components/ui/Icon";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 🔑 Admin Login Form Component
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(
    errorParam === "unauthorized" ? "Access denied. Your account lacks administrator privileges." : ""
  );
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      });

      if (authError) {
        setError(authError.message || "Invalid credentials. Please verify your email and password.");
        setLoading(false);
        return;
      }

      // Success - Better-Auth handles the cookie, we just navigate
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError("A critical authentication error occurred. Please try again or contact support.");
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="border-white/5 bg-white/5 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]" />
        
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-2xl font-black uppercase tracking-tight text-center">
            Partner Login
          </CardTitle>
          <CardDescription className="text-center text-slate-500 font-medium text-xs">
            Enter your administrative credentials to continue
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
              >
                <Icon name="error" className="text-[16px] text-red-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-red-400 font-bold leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                Security Email
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
            
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Password
                </Label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 bg-white/5 border-white/10 focus-visible:ring-cyan-500/50 rounded-xl pr-10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <Icon name="visibility_off" className="text-[16px]" /> : <Icon name="visibility" className="text-[16px]" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-cyan-500/20 group transition-all"
            >
              {loading ? (
                <Icon name="progress_activity" className="text-[16px] animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Authorize Access
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </span>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col border-t border-white/5 bg-black/20 py-4">
          <p className="text-[9px] text-slate-600 font-medium uppercase tracking-tighter text-center">
            Encrypted Session &bull; IP: logged &bull; 2026 Splashdeals Secure Node
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

/**
 * 🔒 Admin Login Page
 */
export default function LoginPage() {
  return (
    <React.Suspense 
      fallback={
        <div className="flex items-center justify-center">
          <Icon name="progress_activity" className="text-[32px] animate-spin text-cyan-500/50" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
