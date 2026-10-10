
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

  const statusStyle =
    token?.status === "WAITING"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : token?.status === "CALLED" || token?.status === "SERVING"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-slate-900 selection:bg-amber-200 selection:text-slate-900">
      {/* Top announcement banner */}
      <div className="border-b border-white/10 bg-[#15396B] px-4 py-2.5 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 text-xs sm:text-sm">
          <span className="shrink-0 bg-[#F4B544] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#15396B]">
            QUEUELESS
          </span>
          <span className="text-blue-100">
            Your queue, your time. Track your service token here.
          </span>
        </div>
      </div>

      {/* Existing citizen navbar */}
      <CitizenNavbar user={user} />

      {/* Main page */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate("/citizen")}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#15396B] transition hover:text-amber-700"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:border-amber-400">
            ←
          </span>
          Back to dashboard
        </button>

        {/* Page heading */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700">
            CITIZEN SERVICES / TOKEN TRACKING
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#15396B] sm:text-4xl">
            Your Active Token
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Keep track of your queue position and estimated waiting time.
            Please stay updated so you don't miss your turn.
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#15396B]/15 border-t-[#15396B]" />
            <p className="mt-5 font-semibold text-slate-700">
              Loading your token details...
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while we retrieve your queue information.
            </p>
          </div>
        ) : error ? (
          /* Error state */
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
              !
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-slate-900">
              Unable to load token
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-600">
              {error}
            </p>
            <button
              type="button"
              onClick={() => navigate("/citizen")}
              className="mt-6 rounded-lg bg-[#15396B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#102D55] focus:outline-none focus:ring-2 focus:ring-[#15396B]/30"
            >
              Return to Dashboard
            </button>
          </div>
        ) : !token ? (
          /* Missing token state */
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-700">
              !
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-[#15396B]">
              Token not found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              We couldn't find the token details for this request.
            </p>
            <button
              type="button"
              onClick={() => navigate("/citizen")}
              className="mt-6 rounded-lg bg-[#15396B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102D55]"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Office and service information */}
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  SERVICE DETAILS
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-[#15396B] sm:text-2xl">
                  {token.officeId?.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {token.serviceId?.name}
                </p>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold tracking-wide ${statusStyle}`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    token.status === "WAITING"
                      ? "animate-pulse bg-amber-500"
                      : token.status === "CALLED" ||
                        token.status === "SERVING"
                      ? "bg-emerald-500"
                      : "bg-slate-400"
                  }`}
                />
                {token.status}
              </div>
            </div>

            {/* Main token card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Saffron accent */}
              <div className="h-1.5 bg-[#F4B544]" />

              <div className="p-5 sm:p-8 lg:p-10">
                {/* Token number */}
                <div className="rounded-xl border border-slate-200 bg-[#F7F8FA] px-4 py-8 text-center sm:py-10">
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-500">
                    YOUR TOKEN NUMBER
                  </p>

                  <p className="mt-3 break-words text-6xl font-black tracking-tight text-[#15396B] sm:text-8xl">
                    {token.tokenNumber}
                  </p>

                  <div className="mt-5 flex justify-center">
                    <span
                      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider ${statusStyle}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {token.status}
                    </span>
                  </div>
                </div>

                {/* Queue statistics */}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-600">
                        People ahead
                      </p>
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg font-black text-[#15396B]">
                        #
                      </span>
                    </div>

                    <p className="mt-4 text-4xl font-black tabular-nums text-[#15396B]">
                      {token.status === "WAITING" ? peopleAhead : 0}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      People waiting before your turn
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-600">
                        Estimated wait
                      </p>
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-lg font-black text-amber-700">
                        ↗
                      </span>
                    </div>

                    <p className="mt-4 text-4xl font-black tabular-nums text-[#15396B]">
                      {estimatedWaitTime !== null &&
                      estimatedWaitTime !== undefined
                        ? estimatedWaitTime
                        : 0}
                      <span className="ml-2 text-base font-bold text-slate-500">
                        min
                      </span>
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Approximate waiting time
                    </p>
                  </div>
                </div>

                {/* Assigned counter */}
                <div className="mt-5 flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      ASSIGNED COUNTER
                    </p>
                    <p className="mt-2 text-lg font-extrabold text-[#15396B]">
                      {token.counterId?.number
                        ? `Counter #${token.counterId.number}`
                        : "Will be assigned when called"}
                    </p>
                  </div>
                  <span className="w-fit rounded-md border border-blue-100 bg-white px-3 py-2 text-xs font-bold text-[#15396B]">
                    SERVICE INFORMATION
                  </span>
                </div>

                {/* Cancel token */}
                {["WAITING", "CALLED"].includes(token.status) && (
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <p className="mb-3 text-sm leading-6 text-slate-500">
                      No longer need this appointment? You can cancel your
                      token below.
                    </p>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="w-full rounded-lg border border-red-200 bg-white px-6 py-3.5 text-sm font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {cancelling ? "Cancelling..." : "Cancel Token"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Citizen notice */}
            <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F4B544] font-black text-[#15396B]">
                i
              </span>
              <div>
                <p className="text-sm font-extrabold text-[#15396B]">
                  Please be ready for your turn
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Please arrive at the office before your turn is called.
                  Keep checking your token status and estimated waiting time.
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            <span className="font-extrabold text-[#15396B]">QUEUELESS</span>
            {" "}· Simplifying public service queues
          </p>
          <p>Track your token. Save your time.</p>
        </div>
      </footer>
    </div>
  );
}
