"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle, Flame, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background: Custom Gradient using your color with low opacity
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#ff9966]/20 via-gray-50 to-[#ff9966]/20">
      
      <Card className="w-full max-w-md border-[#ff9966]/20 shadow-2xl bg-white/80 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          {/* Brand Icon: Light background of your color */}
          <div className="h-12 w-12 bg-[#ff9966]/10 rounded-full flex items-center justify-center mb-2 transition-transform hover:scale-105 duration-300">
            {/* Icon Fill: Your specific color */}
            <Flame className="h-6 w-6 text-[#ff9966] fill-[#ff9966]" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Focus Ring: Your specific color
                className="transition-all duration-200 focus-visible:ring-[#ff9966] focus-visible:border-[#ff9966] hover:border-[#ff9966]/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-xs text-[#ff9966] hover:text-[#ff9966]/80 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Focus Ring: Your specific color
                  className="pr-10 transition-all duration-200 focus-visible:ring-[#ff9966] focus-visible:border-[#ff9966] hover:border-[#ff9966]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#ff9966] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              // Button Background: Your specific color
              className="w-full bg-[#ff9966] hover:bg-[#ff9966]/90 text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link 
              href="/auth/signup" 
              className="font-semibold text-[#ff9966] hover:text-[#ff9966]/80 transition-colors hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}