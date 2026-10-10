
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  MapPin,
  Users,
  Ticket,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";

import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import {
  getTokenDetails,
  cancelToken,
} from "../../services/citizenApi";

const eyebrow =
  "text-[10px] font-extrabold uppercase tracking-[0.18em]";

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
        setTokenData(null);
        setError(res.message || "Failed to load token details.");
      }
    } catch (err) {
      console.error("Failed to load token:", err);
      setTokenData(null);
      setError("Network error. Could not load token details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tokenId) {
      fetchDetails();
    } else {
      setLoading(false);
      setError("A token ID was not provided.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenId]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your token?")) {
      return;
    }

    try {
      setCancelling(true);
      const res = await cancelToken(tokenId);

      if (res.success) {
        window.alert("Token cancelled successfully.");
        navigate("/citizen");
      } else {
        window.alert(res.message || "Failed to cancel token.");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      window.alert("Network error while cancelling token.");
    } finally {
      setCancelling(false);
    }
  };

  const token = tokenData?.token;
  const queuePosition = tokenData?.queuePosition;
  const estimatedWaitTime = tokenData?.estimatedWaitTimeMinutes;
  const peopleAhead = Math.max(0, (queuePosition || 1) - 1);

  const status = token?.status || "UNKNOWN";
  const isWaiting = status === "WAITING";
  const isBeingServed = status === "CALLED" || status === "SERVING";

  const statusStyle = isWaiting
    ? "border-[#D5C42C] bg-[#FFF8C9] text-black"
    : isBeingServed
    ? "border-black/20 bg-black text-white"
    : "border-black/10 bg-[#F0EFEB] text-black/65";

  const waitTime = estimatedWaitTime ?? 0;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#171717] selection:bg-[#F2E36B] selection:text-black">
      {/* Top announcement strip */}
      <div className="bg-[#171717] px-4 py-2.5 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#F2E36B] px-2 py-1 text-[9px] font-black uppercase tracking-wide text-black">
              QueueLess
            </span>
            <span className="hidden text-[10px] text-white/65 sm:inline">
              Virtual queue tracking for public services
            </span>
          </div>

          <span className="text-[9px] font-bold uppercase tracking-wider text-white/65">
            Citizen portal
          </span>
        </div>
      </div>

      <CitizenNavbar user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <button
          type="button"
          onClick={() => navigate("/citizen")}
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider transition hover:opacity-60"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        {/* Page heading */}
        <section className="mt-7 overflow-hidden rounded-xl bg-[#E9E7E1]">
          <div className="grid lg:grid-cols-[1fr_0.8fr]">
            <div className="flex flex-col items-start justify-center px-6 py-9 sm:px-10 sm:py-12">
              <span className="rounded-full border border-black/10 bg-white/80 px-4 py-2">
                <span className={eyebrow}>Your digital queue pass</span>
              </span>

              <h1 className="mt-7 text-5xl font-black uppercase leading-[0.85] tracking-[-0.07em] sm:text-7xl">
                Your place.
                <br />
                Your <span className="bg-[#F2E36B] px-1">time.</span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-black/65">
                Keep track of your token, see your position in the queue,
                and check your estimated waiting time.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={fetchDetails}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-md bg-black px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-neutral-800 disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh status
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/citizen")}
                  className="inline-flex items-center gap-2 px-3 py-3 text-xs font-extrabold uppercase tracking-wider"
                >
                  Dashboard <ArrowUpRight size={15} />
                </button>
              </div>
            </div>

            <div className="relative hidden min-h-[300px] overflow-hidden bg-[#D8D5CA] lg:block">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
                alt="Modern service office interior"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[#E9E7E1]/40" />

              <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[#F2E36B]/90" />

              <div className="absolute bottom-8 left-8 right-8 rounded-lg bg-white p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#F2E36B]">
                    <Ticket size={25} />
                  </div>
                  <div>
                    <p className={eyebrow + " text-black/45"}>
                      QueueLess pass
                    </p>
                    <p className="mt-1 text-lg font-black uppercase">
                      Ready when you are.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <section className="mt-7 animate-pulse rounded-xl border border-black/10 bg-white p-6 sm:p-10">
            <div className="h-4 w-32 rounded bg-black/10" />
            <div className="mt-5 h-14 w-48 rounded bg-black/5" />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="h-28 rounded-lg bg-[#F0EFEB]" />
              <div className="h-28 rounded-lg bg-[#F0EFEB]" />
              <div className="h-28 rounded-lg bg-[#F0EFEB]" />
            </div>
          </section>
        )}

        {/* Error */}
        {!loading && error && (
          <section className="mt-7 rounded-xl border border-red-200 bg-white p-6 sm:p-10">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <AlertCircle size={22} />
              </span>
              <div>
                <h2 className="text-xl font-black uppercase">
                  Unable to load token
                </h2>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={fetchDetails}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-black px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
                >
                  <RefreshCw size={14} />
                  Try again
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Token details */}
        {!loading && !error && token && (
          <>
            <section className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Main ticket */}
              <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
                <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5 sm:p-7">
                  <div>
                    <p className={eyebrow + " text-black/45"}>
                      Token details
                    </p>
                    <h2 className="mt-3 text-2xl font-black uppercase">
                      Your queue pass
                    </h2>
                  </div>

                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F2E36B]">
                    <Ticket size={25} />
                  </span>
                </div>

                <div className="p-5 sm:p-7">
                  <p className={eyebrow + " text-black/45"}>
                    Token number
                  </p>

                  <p className="mt-2 break-words text-6xl font-black leading-none tracking-[-0.07em] sm:text-8xl">
                    {token.tokenNumber}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider ${statusStyle}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isWaiting
                            ? "animate-pulse bg-[#B6A300]"
                            : isBeingServed
                            ? "bg-[#F2E36B]"
                            : "bg-black/40"
                        }`}
                      />
                      {status}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-black/45">
                      ID: {token._id || tokenId}
                    </span>
                  </div>

                  <div className="mt-7 border-t border-dashed border-black/20 pt-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className={eyebrow + " text-black/45"}>
                          Government office
                        </p>
                        <p className="mt-2 flex items-start gap-2 text-sm font-bold">
                          <MapPin size={17} className="mt-0.5 shrink-0" />
                          {token.officeId?.name || "Office details unavailable"}
                        </p>
                      </div>

                      <div>
                        <p className={eyebrow + " text-black/45"}>
                          Service
                        </p>
                        <p className="mt-2 text-sm font-bold">
                          {token.serviceId?.name ||
                            token.service?.name ||
                            "Service details unavailable"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F2E36B] px-5 py-4 sm:px-7">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider">
                    QueueLess / Digital access
                  </span>
                  <span className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-wider">
                    <ShieldCheck size={15} />
                    Token information
                  </span>
                </div>
              </div>

              {/* Queue metrics */}
              <div className="flex flex-col gap-5">
                <div className="rounded-xl bg-[#171717] p-6 text-white sm:p-7">
                  <div className="flex items-center justify-between">
                    <p className={eyebrow + " text-white/55"}>
                      People ahead
                    </p>
                    <Users size={21} className="text-[#F2E36B]" />
                  </div>
                  <p className="mt-5 text-6xl font-black tracking-tight">
                    {peopleAhead}
                  </p>
                  <p className="mt-2 text-xs text-white/55">
                    {peopleAhead === 1
                      ? "person before you"
                      : "people before you"}
                  </p>
                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-[#F2E36B]"
                      style={{
                        width:
                          queuePosition && queuePosition > 0
                            ? `${Math.min(100, 100 / queuePosition)}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 bg-white p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <p className={eyebrow + " text-black/45"}>
                      Estimated waiting time
                    </p>
                    <Clock3 size={21} />
                  </div>
                  <p className="mt-5 text-6xl font-black tracking-tight">
                    {estimatedWaitTime ?? "—"}
                    {estimatedWaitTime != null && (
                      <span className="ml-2 text-sm font-extrabold">
                        MIN
                      </span>
                    )}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-black/55">
                    Estimated time based on the current queue.
                  </p>
                </div>
              </div>
            </section>

            {/* Queue guidance */}
            <section className="mt-5 grid gap-5 rounded-xl bg-[#E9E7E1] p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
              <div>
                <p className={eyebrow + " text-black/45"}>
                  Keep an eye on your queue
                </p>
                <h2 className="mt-3 text-2xl font-black uppercase leading-tight">
                  Stay ready for your turn.
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-black/60">
                  Check your status before visiting the service counter.
                  Queue position and estimated waiting time can change.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchDetails}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-neutral-800 disabled:opacity-50"
              >
                <RefreshCw size={15} />
                Refresh queue
              </button>
            </section>

            {/* Cancellation */}
            {isWaiting && (
              <section className="mt-5 flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h3 className="font-black uppercase">
                    Need to cancel this token?
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-black/55">
                    Cancelling your token will remove your place in the queue.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-black/15 px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition hover:border-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                >
                  <X size={15} />
                  {cancelling ? "Cancelling..." : "Cancel token"}
                </button>
              </section>
            )}
          </>
        )}
      </main>

      <footer className="mt-10 bg-[#171717] px-5 py-7 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-lg font-black uppercase">
            Queue<span className="text-[#F2E36B]">Less.</span>
          </p>
          <p className="text-[10px] uppercase tracking-wider text-white/45">
            Public services, with less waiting.
          </p>
        </div>
      </footer>
    </div>
  );
}
