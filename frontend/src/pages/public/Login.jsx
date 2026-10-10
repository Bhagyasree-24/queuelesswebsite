
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import {
  loginUser,
  getCurrentUser,
} from "../../services/authApi";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { id, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      if (!data.user) {
        setError(data.message || "Login failed. Please check your details.");
        return;
      }

      const currentUser = await getCurrentUser();

      if (!currentUser.authenticated || !currentUser.user) {
        setError(
          "Login succeeded, but your session could not be verified."
        );
        return;
      }

      const role = currentUser.user.role;

      if (role === "citizen") {
        navigate("/citizen", { replace: true });
      } else if (role === "operator") {
        navigate("/operator", { replace: true });
      } else if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        setError("Unknown user role.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      id="top"
      className="min-h-screen bg-[#F7F8FA] text-slate-900"
    >
      {/* Header */}
      <header className="relative z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            aria-label="QueueLess home"
            className="flex items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#15396B] text-xl font-black text-white">
              Q
            </span>

            <span className="text-xl font-extrabold tracking-tight">
              Queue<span className="text-[#D97706]">Less</span>
            </span>
          </Link>

          <Link
            to="/"
            className="text-sm font-semibold text-slate-600 transition hover:text-[#15396B]"
          >
            <span aria-hidden="true">← </span>
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left visual panel */}
        <section className="relative hidden min-h-[650px] overflow-hidden bg-[#102D54] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/registration.png')",
            }}
          />

          <div className="absolute inset-0 bg-[#0A2345]/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07172E] via-transparent to-[#102D54]/30" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
              Your services, made simpler
            </span>

            <h1 className="mt-8 max-w-lg text-4xl font-black leading-tight text-white xl:text-5xl">
              Less waiting.
              <br />
              <span className="text-[#F4B544]">More living.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
              Access your QueueLess account to manage appointments
              and make public-service visits more convenient.
            </p>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[#F4B544] p-3 text-[#15396B]">
                <Clock3 size={23} />
              </div>

              <div>
                <h2 className="font-bold text-white">
                  Your time matters
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-200">
                  Plan your visit, check your queue information,
                  and spend less time waiting.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-100">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#F4B544]" />
                Simple access
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#F4B544]" />
                Convenient visits
              </span>
            </div>
          </div>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <span className="inline-flex rounded-full bg-[#E9EFF8] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#15396B]">
                Welcome to QueueLess
              </span>
            </div>

            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9EFF8] text-[#15396B]">
                <Lock size={23} />
              </div>

              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#B66A09]">
                Citizen portal
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in to continue to your QueueLess account.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-13 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-3 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#15396B] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-slate-700"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-13 w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#15396B] focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#15396B] focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#15396B] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/10 transition hover:-translate-y-0.5 hover:bg-[#0D294F] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in to QueueLess"}
                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <div className="mt-7 text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#15396B] underline decoration-[#E5A33D] decoration-2 underline-offset-4 hover:text-[#B66A09]"
              >
                Create an account
              </Link>
            </div>

            <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-[#236544]"
              />
              <p className="text-xs leading-5 text-slate-500">
                <span className="font-bold text-slate-700">
                  Account security
                </span>
                <br />
                Keep your password private and sign out when using a
                shared device.
              </p>
            </div>

            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              QueueLess is an independent queue-management project and
              is not an official Government of India website.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
