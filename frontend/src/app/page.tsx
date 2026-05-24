"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowRight, Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Interactive 3D Tilt State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const { user, isGuest, loading, login, loginWithGoogle, continueAsGuest } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (user || isGuest)) {
      router.push("/dashboard");
    }
  }, [user, isGuest, loading, router]);

  if (loading) {
    return <div className="h-screen w-full bg-[#EDEDED] flex items-center justify-center">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin ? { email, password } : { email, password, name };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token, data.user);
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Network error. Ensure backend is running.");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate relative position (-1 to 1)
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePosition({ x: 0, y: 0 }); // Snap back to center
  };

  return (
    <div className="flex h-screen w-full bg-[#EDEDED] overflow-hidden">
      {/* Left Side - Auth Form */}
      <div className="w-full md:w-1/2 lg:w-[480px] h-full flex flex-col justify-center px-8 md:px-16 bg-white shadow-[20px_0_60px_rgba(0,0,0,0.1)] z-10 relative">
        <div className="flex items-center gap-0 mb-12">
          <div className="relative w-[64px] h-[64px]">
            <Image src="/assets/vedaAILOGO.png" alt="VedaAI Logo" fill className="object-contain" />
          </div>
          <span className="text-gray-900 font-[family-name:var(--font-bricolage)] font-bold text-[28px] tracking-tight -ml-2">
            VedaAI
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-bricolage)]">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          {isLogin ? "Enter your details to access your dashboard." : "Join VedaAI to generate intelligent assignments."}
        </p>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-[46px] px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.edu"
                className="w-full h-[46px] pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[46px] pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-[46px] mt-2 bg-gray-900 text-white rounded-xl font-medium shadow-[0_8px_20px_rgb(0,0,0,0.12)] hover:bg-black transition-colors flex items-center justify-center gap-2 group"
          >
            {isLogin ? "Sign In" : "Sign Up"}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
        </div>

        <button
          onClick={loginWithGoogle}
          type="button"
          className="w-full h-[46px] bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 mb-6 hover:shadow-sm"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <p className="text-center text-sm text-gray-500 mb-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-orange-500 hover:text-orange-600 transition-colors">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>

        <button
          onClick={continueAsGuest}
          className="mx-auto w-fit text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors flex items-center gap-1 group"
        >
          Continue as Guest <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Right Side - Super Interactive Hero Graphic */}
      <div
        className="hidden md:flex flex-1 items-center justify-center relative bg-[#0f0f11] overflow-hidden perspective-[1000px]"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated Background Orbs */}
        <div
          className="absolute w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] mix-blend-screen transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 50}px) scale(${isHovering ? 1.1 : 1})`,
          }}
        />
        <div
          className="absolute right-[-100px] bottom-[-100px] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] mix-blend-screen transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)`,
          }}
        />

        {/* Main 3D Container */}
        <div
          className="relative z-10 w-full max-w-[640px] transition-transform duration-200 ease-out preserve-3d"
          style={{
            transform: `rotateY(${mousePosition.x * 12}deg) rotateX(${mousePosition.y * -12}deg)`,
          }}
        >
          {/* Main Mockup Card */}
          <div className="relative aspect-[4/3] bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col p-8 overflow-hidden transform-style-3d">

            {/* Top Glowing Edge */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF7950] via-[#FF5050] to-[#C0350A] opacity-80" />

            {/* Scanning Laser Effect (simulated using CSS animation in globals.css, but inline for now) */}
            <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-orange-500/10 to-transparent animate-[scan_3s_ease-in-out_infinite] opacity-50" />

            <div className="flex items-center gap-4 mb-8 transform translate-z-[20px]">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-inner">
                <Sparkles className="text-orange-400" size={28} />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl tracking-tight">AI Teacher&apos;s Toolkit</h3>
                <p className="text-white/50 text-sm font-medium">Processing documents at 100x speed</p>
              </div>
            </div>

            <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-6 relative overflow-hidden transform translate-z-[40px] shadow-2xl flex flex-col justify-center gap-3">

              {/* Animated Skeleton Lines */}
              <div className="w-full h-8 bg-white/10 rounded-lg w-3/4 animate-pulse" />
              <div className="w-full h-3 bg-white/5 rounded-md w-full animate-[pulse_2s_ease-in-out_infinite]" />
              <div className="w-full h-3 bg-white/5 rounded-md w-5/6 animate-[pulse_2.5s_ease-in-out_infinite]" />
              <div className="w-full h-3 bg-white/5 rounded-md w-4/6 animate-[pulse_3s_ease-in-out_infinite]" />
              <div className="w-full h-3 bg-white/5 rounded-md w-2/3 animate-[pulse_2s_ease-in-out_infinite]" />

              {/* Pop-in Result */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 flex items-center gap-4 animate-[bounce_4s_infinite]">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-sm font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)]">A+</div>
                <div className="flex-1 text-green-100/80 text-sm font-medium">Grading complete. Excellent structuring detected.</div>
              </div>
            </div>
          </div>

          {/* Floating Badge 1 (Front-Left) */}
          <div
            className="absolute -left-12 bottom-12 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl flex items-center gap-3 transition-transform duration-300 ease-out"
            style={{ transform: `translateZ(80px) translateY(${mousePosition.y * -20}px)` }}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">10x Faster</p>
              <p className="text-white/50 text-xs">Generation</p>
            </div>
          </div>

          {/* Floating Badge 2 (Top-Right) */}
          <div
            className="absolute -right-8 top-16 z-20 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 transition-transform duration-300 ease-out"
            style={{ transform: `translateZ(60px) translateY(${mousePosition.y * 20}px)` }}
          >
            <p className="text-white font-bold text-2xl">10K+</p>
            <p className="text-white/60 text-xs font-medium">Papers Generated</p>
          </div>

        </div>
      </div>
    </div>
  );
}
