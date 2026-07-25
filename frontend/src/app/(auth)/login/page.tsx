"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("operator_01");
  const [password, setPassword] = useState("••••••••");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Scaffold login logic placeholder
    router.push("/dashboard");
  };

  return (
    <Card className="border-blue-900/60 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Lock className="w-4 h-4" /> OPERATOR SYSTEM AUTHENTICATION
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Plant Operator Tag / Username"
            placeholder="e.g. operator_01"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            label="DCS Security Key / Password"
            type="password"
            placeholder="Enter security key"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded-none bg-gray-900 border-gray-700 text-blue-600 focus:ring-0" defaultChecked />
              <span>Keep Session Active</span>
            </label>
            <Link href="/forgot-password" className="text-cyan-400 hover:underline">
              Reset Key?
            </Link>
          </div>

          <Button type="submit" variant="default" className="w-full h-10 text-xs tracking-widest mt-2">
            INITIALIZE DCS SESSION ➔
          </Button>
        </form>

        <div className="pt-3 border-t border-gray-800 flex items-center gap-2 text-[10px] text-amber-400/80">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Restricted to Authorized Paper Mill Personnel & Process Control Engineers.</span>
        </div>
      </CardContent>
    </Card>
  );
}
