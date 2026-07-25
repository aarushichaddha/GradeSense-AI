"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Card className="border-industrial-border shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <KeyRound className="w-4 h-4" /> RESET OPERATOR ACCESS KEY
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 font-mono">
        {submitted ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
            <p className="font-bold mb-1">Reset Instructions Transmitted.</p>
            <p className="text-[11px] text-emerald-400/80">
              Check your plant email or contact your DCS System Administrator for key regeneration.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Plant Email Address"
              type="email"
              placeholder="operator@honeywell-paper.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="cyan" className="w-full h-10 text-xs tracking-widest">
              REQUEST KEY RESET ➔
            </Button>
          </form>
        )}

        <div className="pt-2">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
