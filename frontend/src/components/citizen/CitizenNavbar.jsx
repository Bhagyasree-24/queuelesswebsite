
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authApi";

export default function CitizenNavbar({ user }) {
  const navigate = useNavigate();

  const [showAccount, setShowAccount] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  // Close the account drawer when the logged-in user changes.
  useEffect(() => {
    setShowAccount(false);
    setLogoutError("");
  }, [user?.id, user?._id, user?.email]);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await logoutUser();

      setShowAccount(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  // Always derive the displayed details from the latest user prop.
  const displayName = user?.name?.trim() || user?.email || "Citizen";
  const email = user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/citizen")}
            className="group flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-bold text-white shadow-sm transition group-hover:shadow-md">
              Q
            </div>

            <span className="text-xl font-bold tracking-tight">
              <span className="text-slate-900">Queue</span>
              <span className="text-blue-600">Less</span>
            </span>
          </button>

          {/* Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={() => navigate("/citizen")}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => navigate("/citizen")}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              My Token
            </button>
          </nav>

          {/* Account */}
          <button
            type="button"
            onClick={() => setShowAccount(true)}
            aria-haspopup="dialog"
            aria-expanded={showAccount}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100 sm:gap-3 sm:px-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-sm font-bold text-blue-600">
              {initial}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-32 truncate text-sm font-semibold text-slate-900">
                {displayName}
              </p>

              <p className="text-xs text-slate-500">Citizen</p>
            </div>

            <span className="text-xs text-slate-400">▼</span>
          </button>
        </div>
      </header>

      {/* Account Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          showAccount
            ? "visible bg-slate-900/30"
            : "invisible pointer-events-none bg-transparent"
        }`}
        onClick={() => setShowAccount(false)}
      >
        <aside
          role="dialog"
          aria-modal={showAccount ? "true" : undefined}
          aria-label="Citizen account"
          onClick={(event) => event.stopPropagation()}
          className={`pointer-events-auto absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            showAccount ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
            <div>
              <h2 className="font-bold text-slate-900">Account</h2>
              <p className="text-xs text-slate-500">
                Manage your account
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAccount(false)}
              aria-label="Close account"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              ×
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-lg font-bold text-blue-600">
                  {initial}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-slate-900">
                    {displayName}
                  </h3>

                  <p className="truncate text-sm text-slate-500">
                    {email}
                  </p>
                </div>
              </div>

              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Citizen
              </span>
            </div>

            <div className="mt-6 space-y-1">
              <button
                type="button"
                onClick={() => setShowAccount(false)}
                className="flex w-full items-center rounded-xl px-4 py-3 text-left font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <span className="mr-3 text-lg">👤</span>
                My Account
              </button>

              {logoutError && (
                <p role="alert" className="px-4 py-2 text-sm text-red-600">
                  {logoutError}
                </p>
              )}

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center rounded-xl px-4 py-3 text-left font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="mr-3 text-lg">↪</span>
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-slate-200 p-5">
            <p className="text-center text-xs text-slate-400">
              QueueLess Citizen Portal
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
