import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import { getTokenDetails, cancelToken } from "../../services/citizenApi";

export default function ActiveToken({ user }) {
  const navigate = useNavigate();
  const { tokenId } = useParams();

  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);

  async function fetchDetails() {
    try {
      setLoading(true);
      setError(null);
      const res = await getTokenDetails(tokenId);

      if (res.success && res.token) {
        setTokenData(res);
      } else {
        setError(res.message || "Failed to load token details");
      }
    } catch (err) {
      console.error("Failed to load token:", err);
      setError("Network error. Could not load token details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tokenId) {
      fetchDetails();
    }
  }, [tokenId]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your token?")) {
      return;
    }

    try {
      setCancelling(true);
      const res = await cancelToken(tokenId);

      if (res.success) {
        alert("Token cancelled successfully.");
        navigate("/citizen");
      } else {
        alert(res.message || "Failed to cancel token.");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Network error while cancelling token.");
    } finally {
      setCancelling(false);
    }
  };

  const token = tokenData?.token;
  const queuePosition = tokenData?.queuePosition;
  const estimatedWaitTime = tokenData?.estimatedWaitTimeMinutes;
  const peopleAhead = Math.max(0, (queuePosition || 1) - 1);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Citizen Navbar */}
      <CitizenNavbar user={user} />

      {/* Main */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/citizen")}
          className="mb-8 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          ← Back to home
        </button>

        {loading ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-slate-600">Loading virtual token...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <h2 className="text-xl font-bold">Error</h2>
            <p className="mt-2 text-sm">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/citizen")}
              className="mt-6 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Return Home
            </button>
          </div>
        ) : !token ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600">
            Token not found.
          </div>
        ) : (
          <>
            {/* Heading */}
            <div className="text-center">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  token.status === "WAITING"
                    ? "bg-blue-100 text-blue-700"
                    : token.status === "CALLED" || token.status === "SERVING"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    token.status === "WAITING"
                      ? "bg-blue-500"
                      : token.status === "CALLED" || token.status === "SERVING"
                      ? "bg-green-500"
                      : "bg-slate-500"
                  }`}
                />
                Status: {token.status}
              </span>

              <h1 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">
                Your Virtual Token
              </h1>

              <p className="mt-2 text-slate-600">
                {token.officeId?.name} · {token.serviceId?.name}
              </p>
            </div>

            {/* Token Card */}
            <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {/* Token number */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 py-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  Token Number
                </p>

                <p className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-7xl font-bold tracking-tight text-transparent">
                  {token.tokenNumber}
                </p>

                <span className="mt-4 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-sm">
                  {token.status}
                </span>
              </div>

              {/* Main stats */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-blue-50 p-5 text-center">
                  <p className="text-sm text-slate-500">People ahead</p>

                  <p className="mt-1 text-4xl font-bold text-slate-900">
                    {token.status === "WAITING" ? peopleAhead : 0}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    people waiting before you
                  </p>
                </div>

                <div className="rounded-2xl bg-purple-50 p-5 text-center">
                  <p className="text-sm text-slate-500">Estimated wait</p>

                  <p className="mt-1 text-4xl font-bold text-slate-900">
                    {estimatedWaitTime !== null && estimatedWaitTime !== undefined
                      ? estimatedWaitTime
                      : 0}
                    <span className="ml-1 text-lg font-medium">min</span>
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    approximate waiting time
                  </p>
                </div>
              </div>

              {/* Counter info */}
              <div className="mt-6 rounded-2xl border border-slate-200 p-5 text-center">
                <p className="text-sm text-slate-500">Assigned Counter</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {token.counterId?.number
                    ? `Counter #${token.counterId.number}`
                    : "Will be assigned when called"}
                </p>
              </div>

              {/* Cancel Button */}
              {["WAITING", "CALLED"].includes(token.status) && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="mt-8 w-full rounded-xl border border-red-200 bg-white px-6 py-3.5 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelling ? "Cancelling..." : "Cancel Token"}
                </button>
              )}
            </div>

            {/* Notice */}
            <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center text-sm text-blue-700">
              Please arrive at the office before your turn is called.
            </div>
          </>
        )}
      </main>
    </div>
  );
}