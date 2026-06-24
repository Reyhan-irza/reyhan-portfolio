import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowRight } from "lucide-react";
import { loginAdmin, isAdminLoggedIn } from "@/lib/adminAuth";

export default function AdminLogin() {
  const [, navigate] = useLocation();

  useEffect(() => {
    if (isAdminLoggedIn()) navigate("/admin/dashboard");
  }, [navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [shake,    setShake]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }
    setLoading(true);
    setError("");

    const ok = await loginAdmin(username.trim(), password);

    if (ok) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password.");
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#050816" }}
    >
      {/* Subtle glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.08), transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 100%)",
        }}
      />

      <div
        className={`relative z-10 w-full max-w-sm transition-transform duration-200 ${shake ? "" : ""}`}
        style={{ animation: shake ? "admin-shake 0.4s ease" : "none" }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl border border-violet-500/20 bg-violet-500/8 flex items-center justify-center mx-auto mb-5">
            <img src="/logo.png" alt="RW" className="h-9 w-9 object-contain" style={{ imageRendering: "crisp-edges" }} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Developer Access</h1>
          <p className="text-[#9CA3AF] text-sm mt-1.5">Sign in to manage your portfolio</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 border border-white/7"
          style={{ background: "#111827" }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-white/45 text-xs font-medium mb-2 uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); if (error) setError(""); }}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/8 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/45 text-xs font-medium mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-white/8 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
                  aria-label="Toggle password"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-red-500/15 text-red-400 text-xs"
                style={{ background: "rgba(239,68,68,0.06)" }}>
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-neon w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/15 text-xs mt-6">
          Restricted access — authorized personnel only
        </p>
      </div>

      <style>{`
        @keyframes admin-shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
