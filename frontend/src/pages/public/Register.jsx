
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
} from "lucide-react";

import { registerUser } from "../../services/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (!data.user) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
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
        <section className="relative hidden min-h-[720px] overflow-hidden bg-[#102D54] lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
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
              Start your QueueLess journey
            </span>

            <h1 className="mt-8 max-w-lg text-4xl font-black leading-tight text-white xl:text-5xl">
              Your time.
              <br />
              Your services.
              <br />
              <span className="text-[#F4B544]">Your convenience.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
              Create your account to make managing public-service
              visits simpler and more convenient.
            </p>
          </div>

          <div className="relative z-10 space-y-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <h2 className="font-bold text-white">
              Designed around your needs
            </h2>

            <div className="flex items-start gap-3">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0 text-[#F4B544]"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  Convenient access
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-200">
                  Access your account when you need it.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0 text-[#F4B544]"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  A simple experience
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-200">
                  Manage your QueueLess experience in one place.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0 text-[#F4B544]"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  Security-conscious design
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-200">
                  Keep your account details private and secure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Registration form */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-6 lg:hidden">
              <span className="inline-flex rounded-full bg-[#E9EFF8] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#15396B]">
                Join QueueLess
              </span>
            </div>

            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E9EFF8] text-[#15396B]">
                <UserPlus size={23} />
              </div>

              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#B66A09]">
                Create an account
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Get started
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your details to create your QueueLess account.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              {/* Full name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pl-11 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#15396B] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Email */}
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
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pl-11 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#15396B] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Phone number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pl-11 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#15396B] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Create password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#15396B] focus:ring-4 focus:ring-blue-100"
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

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#15396B] focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#15396B] focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#15396B] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/10 transition hover:-translate-y-0.5 hover:bg-[#0D294F] focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create my account"}
                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#15396B] underline decoration-[#E5A33D] decoration-2 underline-offset-4 hover:text-[#B66A09]"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-[#236544]"
              />
              <p className="text-xs leading-5 text-slate-500">
                <span className="font-bold text-slate-700">
                  Protect your account
                </span>
                <br />
                Use a strong password and never share it with anyone.
              </p>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              QueueLess is an independent queue-management project and
              is not an official Government of India website.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
