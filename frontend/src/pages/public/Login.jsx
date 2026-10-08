import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
          setError(data.message || "Login failed");
          return;
        }

        // Confirm the current session and get the actual logged-in user.
        const currentUser = await getCurrentUser();

        if (!currentUser.authenticated || !currentUser.user) {
          setError("Login succeeded, but the session could not be verified.");
          return;
        }

        const role = currentUser.user.role;

        if (role === "citizen") {
          navigate("/citizen", { replace: true });
        } else if (role === "operator") {
          navigate("/operator", { replace: true });
        } else if (role === "admin") {
          console.log("redirecting to admin");
          navigate("/operator", { replace: true });
        }else {
          setError("Unknown user role");
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Simple top bar */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <Link
            to="/"
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-slate-900">Queue</span>
            <span className="text-blue-600">Less</span>
          </Link>

          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            ← Back to home
          </Link>

        </div>
      </header>

      {/* Login */}
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-2xl text-white shadow-lg shadow-blue-200">
              Q
            </div>

            <h1 className="mt-5 text-3xl font-bold text-slate-900">
              Welcome back
            </h1>

            <p className="mt-2 text-slate-600">
              Login to continue to QueueLess
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">

            <form className="space-y-5" onSubmit={handleSubmit}>

              {/* Error */}
              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            {/* Register */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-purple-600"
              >
                Register
              </Link>
            </p>

          </div>

        </div>
      </main>
    </div>
  );
}