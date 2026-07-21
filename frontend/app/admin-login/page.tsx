"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────────────────────────
   Dummy credentials  (frontend-only)
   Replace with real auth when backend is ready.
───────────────────────────────────────────── */
const ADMIN_CREDENTIALS: Record<string, string> = {
  "ADMIN-001": "bid2build@admin",
  "ADMIN-002": "control@2026",
};

export default function AdminLoginPage() {
  const router = useRouter();

  const [adminId,     setAdminId]     = useState("");
  const [password,    setPassword]    = useState("");
  const [rememberMe,  setRememberMe]  = useState(false);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [mounted,     setMounted]     = useState(false);

  /* Hydration guard */
  useEffect(() => {
    setMounted(true);
    /* Re-fill from storage if "Remember Me" was ticked last time */
    const stored = localStorage.getItem("adminId_remembered");
    if (stored) setAdminId(stored);
  }, []);

  /* Redirect if already logged in */
  useEffect(() => {
    if (!mounted) return;
    if (localStorage.getItem("adminId")) router.replace("/admin/dashboard");
  }, [mounted, router]);

  function handleLogin() {
    setError("");
    if (!adminId.trim() || !password.trim()) {
      setError("Please enter your Admin ID and password.");
      return;
    }

    setLoading(true);

    /* Simulate a brief auth check */
    setTimeout(() => {
      const expected = ADMIN_CREDENTIALS[adminId.trim().toUpperCase()];
      if (expected && expected === password) {
        localStorage.setItem("adminId", adminId.trim().toUpperCase());
        if (rememberMe) {
          localStorage.setItem("adminId_remembered", adminId.trim().toUpperCase());
        } else {
          localStorage.removeItem("adminId_remembered");
        }
        router.push("/admin/dashboard");
      } else {
        setLoading(false);
        setError("Invalid Admin ID or password. Access denied.");
      }
    }, 900);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  if (!mounted) {
    return <div style={{ minHeight: "100vh", background: "#070B18" }} />;
  }

  return (
    <>
      <style>{`
        @keyframes grid-drift {
          0%   { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(239,68,68,0.4); }
          70%  { box-shadow: 0 0 0 12px rgba(239,68,68,0);   }
          100% { box-shadow: 0 0 0 0   rgba(239,68,68,0);    }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0);  }
          20%      { transform: translateX(-7px); }
          40%      { transform: translateX(7px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }

        .admin-card {
          animation: card-in 0.55s cubic-bezier(0.34,1.3,0.64,1) both;
        }
        .error-shake {
          animation: shake 0.45s ease both;
        }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(0,0,0,0.25);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin-slow 0.7s linear infinite;
          display: inline-block;
        }

        /* Input focus ring in red */
        .admin-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          color: #f1f5f9;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .admin-input::placeholder { color: #475569; }
        .admin-input:focus {
          border-color: rgba(239,68,68,0.55);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
          background: rgba(239,68,68,0.03);
        }
        .admin-input:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Login button */
        .login-btn {
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #EF4444 0%, #E8C07D 100%);
          color: #0a0a0a;
          font-size: 0.95rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(239,68,68,0.45);
          filter: brightness(1.08);
        }
        .login-btn:active:not(:disabled) { transform: scale(0.98); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Remember checkbox */
        .admin-checkbox {
          width: 16px; height: 16px;
          accent-color: #EF4444;
          cursor: pointer;
          flex-shrink: 0;
        }

        /* Back link */
        .back-link {
          position: absolute;
          top: 28px; left: 36px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .back-link:hover { color: #E8C07D; }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #1e293b;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          margin: 6px 0;
        }
        .divider::before, .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* Show/hide password eye button */
        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          font-size: 1rem;
          transition: color 0.15s;
          padding: 2px;
          line-height: 1;
        }
        .eye-btn:hover { color: #94a3b8; }
      `}</style>

      <main
        style={{
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
          background: "#070B18",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        {/* ── Back to Home ── */}
        <Link href="/" className="back-link">← Back to Home</Link>

        {/* ═══════════════════════════════
            BACKGROUND LAYERS
        ═══════════════════════════════ */}
        {/* Red radial glow — distinguishes admin from student (gold) */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(239,68,68,0.11) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Secondary gold shimmer bottom-right */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse 45% 40% at 85% 85%, rgba(232,192,125,0.07) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {/* Animated grid */}
        <div style={{
          position: "absolute", inset: "-40px", zIndex: 0, opacity: 0.03,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          animation: "grid-drift 12s linear infinite",
          pointerEvents: "none",
        }} />

        {/* Bottom vignette */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "linear-gradient(to bottom, transparent 60%, #070B18)",
          pointerEvents: "none",
        }} />

        {/* ═══════════════════════════════
            LOGIN CARD
        ═══════════════════════════════ */}
        <div
          className="admin-card"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 440,
            borderRadius: 28,
            border: "1px solid rgba(239,68,68,0.18)",
            background: "rgba(10,10,18,0.82)",
            backdropFilter: "blur(24px)",
            padding: "44px 40px 40px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset",
          }}
        >
          {/* ── Admin badge strip ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 28,
          }}>
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: 999,
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.28)",
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "#EF4444",
              textTransform: "uppercase",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#EF4444",
                animation: "blink 1.4s ease-in-out infinite",
                display: "inline-block",
              }} />
              ADMIN CONTROL PANEL
            </span>
          </div>

          {/* ── Logo + Title ── */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 68, height: 68,
              borderRadius: 18,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.22)",
              marginBottom: 16,
              fontSize: "2rem",
            }}>
              🛡️
            </div>

            <h1 style={{
              fontSize: "1.85rem",
              fontWeight: 900,
              margin: "0 0 6px",
              background: "linear-gradient(135deg, #fff 30%, #EF4444 70%, #E8C07D 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.15,
            }}>
              BID2BUILD
            </h1>
            <p style={{
              margin: 0,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#475569",
              textTransform: "uppercase",
            }}>
              Administrator Access
            </p>
          </div>

          {/* ── Form ── */}
          <div
            className={error ? "error-shake" : ""}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
            onKeyDown={handleKeyDown}
          >
            {/* Admin ID */}
            <div>
              <label style={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#64748b",
                textTransform: "uppercase",
                marginBottom: 7,
              }}>
                Admin ID
              </label>
              <input
                id="admin-id-input"
                type="text"
                placeholder="e.g. ADMIN-001"
                className="admin-input"
                value={adminId}
                onChange={e => { setAdminId(e.target.value); setError(""); }}
                disabled={loading}
                autoComplete="username"
                spellCheck={false}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#64748b",
                textTransform: "uppercase",
                marginBottom: 7,
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="admin-password-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter admin password"
                  className="admin-input"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  disabled={loading}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPass(p => !p)}
                  tabIndex={-1}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
              <input
                id="admin-remember-me"
                type="checkbox"
                className="admin-checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label
                htmlFor="admin-remember-me"
                style={{
                  fontSize: "0.82rem",
                  color: "#64748b",
                  cursor: "pointer",
                  userSelect: "none",
                  fontWeight: 600,
                }}
              >
                Remember my Admin ID on this device
              </label>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.09)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}>
                <span style={{ fontSize: "0.85rem" }}>⛔</span>
                <p style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#EF4444",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}>
                  {error}
                </p>
              </div>
            )}

            {/* Login button */}
            <button
              id="admin-login-btn"
              className="login-btn"
              onClick={handleLogin}
              disabled={loading}
              style={{ marginTop: 6 }}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Authenticating…
                </>
              ) : (
                "🔐 ACCESS CONTROL PANEL"
              )}
            </button>
          </div>

          {/* ── Divider ── */}
          <div className="divider" style={{ marginTop: 28 }}>SECURITY NOTICE</div>

          {/* ── Footer note ── */}
          <p style={{
            margin: 0,
            textAlign: "center",
            fontSize: "0.72rem",
            color: "#1e293b",
            lineHeight: 1.6,
            letterSpacing: "0.02em",
          }}>
            This portal is restricted to authorised BID2BUILD administrators only.
            Unauthorized access attempts are logged and monitored.
          </p>

          {/* ── Student login link ── */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Link
              href="/login"
              style={{
                fontSize: "0.78rem",
                color: "#334155",
                textDecoration: "none",
                fontWeight: 600,
                transition: "color 0.2s",
              }}
              onMouseOver={e => (e.currentTarget.style.color = "#E8C07D")}
              onMouseOut={e  => (e.currentTarget.style.color = "#334155")}
            >
              Team / Student login →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
