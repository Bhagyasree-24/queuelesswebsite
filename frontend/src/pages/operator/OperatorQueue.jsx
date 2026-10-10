
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import OperatorNavbar from "../../components/operator/OperatorNavbar";

import {
  getOperatorDashboard,
  getOperatorQueue,
  callNextToken,
  startToken,
  completeToken,
  skipToken,
  recallToken,
} from "../../services/operatorApi";

import {
  ActionButton,
  CounterStatusPill,
  ErrorState,
  Notice,
  PageSkeleton,
  TokenStatusBadge,
  formatTime,
  getId,
} from "../../components/operator/OperatorUi";

/* -------------------------------------------------------
   Small visual icon component
------------------------------------------------------- */

function Icon({ children, className = "" }) {
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${className}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------
   Operator Queue Page
------------------------------------------------------- */

export default function OperatorQueue({ user }) {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState(null);

  /* Load dashboard and queue */

  const load = useCallback(async () => {
    try {
      const [dash, q] = await Promise.all([
        getOperatorDashboard(),
        getOperatorQueue(),
      ]);

      setDashboard(dash.dashboard);
      setQueue(q.queue || []);
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* Queue action handler */

  async function runAction(key, fn, successFallback) {
    if (busy) return;

    setBusy(key);
    setNotice(null);

    try {
      const res = await fn();

      if (res && res.success === false) {
        setNotice({
          type: "info",
          message: res.message || "Nothing to do.",
        });
      } else {
        setNotice({
          type: "success",
          message: res?.message || successFallback,
        });
      }

      await load();
    } catch (err) {
      setNotice({
        type: "error",
        message: err.message || "Unable to complete the action.",
      });

      await load();
    } finally {
      setBusy(null);
    }
  }

  /* Dashboard data */

  const counter = dashboard?.counter;
  const office = dashboard?.office;
  const currentToken = dashboard?.currentToken;
  const currentId = getId(currentToken);

  const waiting = queue.filter((t) => t.status === "WAITING");
  const nextToken = waiting[0];

  const counterReady = counter?.status === "AVAILABLE";
  const canCallNext = counterReady && !currentToken;

  const counterName =
    counter?.name ||
    (counter?.number ? `Counter ${counter.number}` : "Service Counter");

  let callNextHint = "";

  if (currentToken) {
    callNextHint = "Finish or skip the current token first.";
  } else if (!counterReady) {
    callNextHint = `Counter is ${
      counter?.status || "unavailable"
    }. Set it to Available to call tokens.`;
  }

  const servingCount = queue.filter(
    (token) => token.status === "SERVING"
  ).length;

  const calledCount = queue.filter(
    (token) => token.status === "CALLED"
  ).length;

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900">
      <OperatorNavbar user={user} />

      <main>
        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden bg-[#15396B]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-[#F4B544]/15 blur-3xl" />
            <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
          </div>

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
              backgroundSize: "38px 38px",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white sm:text-xs">
                    Official Operator Portal
                  </span>
                </div>

                <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-[#F4B544]">
                  Every token matters
                </p>

                <h1 className="mt-3 max-w-2xl text-4xl font-black uppercase leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-7xl">
                  Manage
                  <br />
                  the queue.
                  <br />
                  <span className="text-[#F4B544]">
                    Serve smarter.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                  Call the next citizen, manage active tokens, and keep
                  government services moving with a simple, organized
                  queue management workspace.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("next-queue")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#F4B544] px-5 py-3.5 text-sm font-extrabold text-[#15396B] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#FFD978]"
                  >
                    Manage queue
                    <span className="text-lg">↓</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/operator/counter")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Counter control
                    <span>→</span>
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-blue-100 sm:text-sm">
                  <span>
                    <span className="mr-2 font-black text-[#F4B544]">✓</span>
                    Live token management
                  </span>
                  <span>
                    <span className="mr-2 font-black text-[#F4B544]">✓</span>
                    Organized waiting queue
                  </span>
                  <span>
                    <span className="mr-2 font-black text-[#F4B544]">✓</span>
                    Faster citizen service
                  </span>
                </div>
              </div>

              {/* Hero queue preview */}

              <div className="relative mx-auto w-full max-w-md lg:ml-auto">
                <div className="absolute -right-3 -top-3 h-20 w-20 border-r-4 border-t-4 border-[#F4B544] sm:-right-5 sm:-top-5" />

                <div className="relative rounded-2xl bg-[#F0D96A] p-2 shadow-2xl sm:p-3">
                  <div className="rounded-xl bg-white p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-slate-400">
                          Operator overview
                        </p>
                        <h2 className="mt-2 text-xl font-black uppercase text-[#15396B] sm:text-2xl">
                          {counterName}
                        </h2>
                      </div>

                      <Icon className="bg-[#15396B] text-2xl text-white">
                        🏛️
                      </Icon>
                    </div>

                    <div className="mt-5 border-y border-slate-100 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Assigned office
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-800">
                        {office?.name || "Government Office"}
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#F7F8FA] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Waiting
                        </p>
                        <p className="mt-2 text-3xl font-black text-[#15396B]">
                          {loading ? "—" : waiting.length}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#FFF8DF] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                          Current token
                        </p>
                        <p className="mt-2 truncate text-2xl font-black text-[#15396B]">
                          {currentToken?.tokenNumber || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#15396B] p-4 text-white">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                          Counter availability
                        </p>
                        <p className="mt-1 font-extrabold">
                          {loading
                            ? "Loading..."
                            : counter?.status || "Unavailable"}
                        </p>
                      </div>

                      <span
                        className={`h-3 w-3 shrink-0 rounded-full ${
                          counterReady ? "bg-emerald-400" : "bg-[#F4B544]"
                        }`}
                      />
                    </div>

                    <p className="mt-4 text-center text-[10px] font-medium text-slate-400">
                      A smoother queue starts at your counter.
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 hidden rounded-lg bg-white px-4 py-3 shadow-xl sm:block">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    QueueLess
                  </p>
                  <p className="mt-1 text-xs font-black text-[#15396B]">
                    SERVICE MADE SIMPLER
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-1.5 bg-[#F4B544]" />
        </section>

        {/* ================= MAIN CONTENT ================= */}

        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B] sm:text-xs">
                  Operator workspace
                </p>
              </div>

              <h2 className="mt-2 text-3xl font-black uppercase leading-tight tracking-tight text-[#15396B] sm:text-4xl">
                Your queue,
                <br className="sm:hidden" /> at a glance.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor waiting citizens, manage active tokens, and
                move through each service request efficiently.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                load();
              }}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#15396B] shadow-sm transition hover:border-[#F4B544] hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
            >
              <span className={loading ? "animate-spin" : ""}>↻</span>
              Refresh details
            </button>
          </div>

          <Notice notice={notice} onClose={() => setNotice(null)} />

          {loading ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <PageSkeleton />
            </div>
          ) : error && !dashboard ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <ErrorState
                message={error}
                onRetry={() => {
                  setLoading(true);
                  load();
                }}
              />
            </div>
          ) : (
            <>
              {error && (
                <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span>Couldn't refresh: {error}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoading(true);
                      load();
                    }}
                    className="shrink-0 font-bold underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Office / Counter information */}

              <section className="mt-6 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <Icon className="bg-[#15396B] text-2xl text-white">
                    🏛️
                  </Icon>

                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Assigned office
                    </p>
                    <h2 className="mt-1 truncate text-xl font-black text-[#15396B]">
                      {office?.name || "Assigned Government Office"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {counterName}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-lg bg-[#F7F8FA] px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Operator desk
                  </span>
                  <CounterStatusPill status={counter?.status} />
                </div>
              </section>

              {/* Statistics */}

              <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "People waiting",
                    value: waiting.length,
                    description: "Citizens in the queue",
                    icon: "👥",
                    iconClass: "bg-[#FFF4CC]",
                  },
                  {
                    label: "Current token",
                    value: currentToken?.tokenNumber || "—",
                    description: currentToken?.status || "No active token",
                    icon: "🎫",
                    iconClass: "bg-blue-50",
                  },
                  {
                    label: "Serving",
                    value: servingCount,
                    description: "Currently being served",
                    icon: "✓",
                    iconClass: "bg-emerald-50",
                  },
                  {
                    label: "Called",
                    value: calledCount,
                    description: "Awaiting service",
                    icon: "🔔",
                    iconClass: "bg-amber-50",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          {stat.label}
                        </p>
                        <p className="mt-3 truncate text-3xl font-black text-[#15396B]">
                          {stat.value}
                        </p>
                      </div>
                      <Icon className={`${stat.iconClass} text-xl`}>
                        {stat.icon}
                      </Icon>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </section>

              {/* Main Queue Controls */}

              <section className="mt-8 grid items-start gap-6 lg:grid-cols-[1.45fr_0.85fr]">
                {/* Current token */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                        Current queue
                      </p>
                      <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#15396B]">
                        Now serving.
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Manage the citizen currently assigned to your counter.
                      </p>
                    </div>

                    {currentToken && (
                      <TokenStatusBadge status={currentToken.status} />
                    )}
                  </div>

                  {currentToken ? (
                    <div className="p-5 sm:p-7">
                      <div className="rounded-2xl bg-[#15396B] p-5 text-white sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                            Current token number
                          </p>
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold">
                            <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
                            ACTIVE
                          </span>
                        </div>

                        <h3 className="mt-3 break-words text-5xl font-black tracking-tight text-[#F4B544] sm:text-7xl">
                          {currentToken.tokenNumber || "—"}
                        </h3>

                        <p className="mt-3 text-sm text-blue-100">
                          Citizen currently assigned to your counter.
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-3 border-t border-white/15 pt-5 sm:grid-cols-2">
                          <div className="rounded-xl bg-white/10 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                              Citizen
                            </p>
                            <p className="mt-2 truncate font-bold">
                              {currentToken.userId?.name || "—"}
                            </p>
                          </div>

                          <div className="rounded-xl bg-white/10 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                              Service
                            </p>
                            <p className="mt-2 truncate font-bold">
                              {currentToken.serviceId?.name || "—"}
                            </p>
                          </div>

                          <div className="rounded-xl bg-white/10 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                              Counter
                            </p>
                            <p className="mt-2 truncate font-bold">
                              {counterName}
                            </p>
                          </div>

                          <div className="rounded-xl bg-white/10 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                              Called at
                            </p>
                            <p className="mt-2 font-bold">
                              {formatTime(currentToken.calledAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {currentToken.status === "CALLED" && (
                          <ActionButton
                            className="!rounded-xl !bg-[#15396B] !px-5 !py-3 !font-bold !text-white transition hover:!bg-[#0E2A50] sm:col-span-2"
                            busy={busy === "start"}
                            disabled={!!busy}
                            busyLabel="Starting..."
                            onClick={() =>
                              runAction(
                                "start",
                                () => startToken(currentId),
                                "Service started."
                              )
                            }
                          >
                            ▶ Start Serving
                          </ActionButton>
                        )}

                        {currentToken.status === "SERVING" && (
                          <ActionButton
                            className="!rounded-xl !bg-emerald-600 !px-5 !py-3 !font-bold !text-white transition hover:!bg-emerald-700 sm:col-span-2"
                            busy={busy === "complete"}
                            disabled={!!busy}
                            busyLabel="Completing..."
                            onClick={() =>
                              runAction(
                                "complete",
                                () => completeToken(currentId),
                                "Token completed."
                              )
                            }
                          >
                            ✓ Complete Service
                          </ActionButton>
                        )}

                        <ActionButton
                          className="!rounded-xl !border !border-slate-200 !bg-white !px-5 !py-3 !font-bold !text-[#15396B] transition hover:!border-[#F4B544] hover:!bg-amber-50"
                          busy={busy === "recall"}
                          disabled={!!busy}
                          busyLabel="Recalling..."
                          onClick={() =>
                            runAction(
                              "recall",
                              () => recallToken(currentId),
                              "Token recalled."
                            )
                          }
                        >
                          ↻ Recall Token
                        </ActionButton>

                        {currentToken.status === "CALLED" && (
                          <ActionButton
                            className="!rounded-xl !border !border-red-200 !bg-red-50 !px-5 !py-3 !font-bold !text-red-600 transition hover:!bg-red-100"
                            busy={busy === "skip"}
                            disabled={!!busy}
                            busyLabel="Skipping..."
                            onClick={() =>
                              runAction(
                                "skip",
                                () => skipToken(currentId),
                                "Token skipped."
                              )
                            }
                          >
                            Skip Token
                          </ActionButton>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 sm:p-7">
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-[#F7F8FA] px-5 py-12 text-center">
                        <Icon className="mx-auto bg-white text-2xl shadow-sm">
                          🎫
                        </Icon>
                        <h3 className="mt-4 text-xl font-black text-[#15396B]">
                          No active token
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                          {waiting.length > 0
                            ? "Citizens are waiting. Call the next token to begin serving."
                            : "There are no citizens waiting in your queue right now."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Next token */}

                <div id="next-queue" className="overflow-hidden rounded-2xl bg-[#15396B] shadow-lg">
                  <div className="h-1.5 bg-[#F4B544]" />
                  <div className="p-5 sm:p-7">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F4B544]">
                      Next in queue
                    </p>
                    <h2 className="mt-2 text-2xl font-black uppercase text-white">
                      Call next.
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-blue-100">
                      Call the next waiting citizen when your counter is ready.
                    </p>

                    {nextToken ? (
                      <>
                        <div className="mt-6 rounded-xl border border-white/15 bg-white/[0.07] p-5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                            Next token number
                          </p>
                          <h3 className="mt-2 break-words text-5xl font-black text-[#F4B544]">
                            {nextToken.tokenNumber}
                          </h3>
                          <p className="mt-3 text-sm text-blue-100">
                            {nextToken.serviceId?.name || "Service"}
                          </p>

                          <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/15 pt-4 text-sm">
                            <span className="text-blue-200">
                              People behind
                            </span>
                            <span className="font-extrabold text-white">
                              {Math.max(waiting.length - 1, 0)}
                            </span>
                          </div>
                        </div>

                        <ActionButton
                          className="mt-5 !w-full !rounded-xl !bg-[#F4B544] !px-5 !py-3.5 !font-extrabold !text-[#15396B] transition hover:!bg-[#FFD978]"
                          busy={busy === "next"}
                          disabled={!canCallNext || !!busy}
                          busyLabel="Calling..."
                          onClick={() =>
                            runAction(
                              "next",
                              callNextToken,
                              "Next token called."
                            )
                          }
                        >
                          Call {nextToken.tokenNumber} →
                        </ActionButton>
                      </>
                    ) : (
                      <div className="mt-6 rounded-xl border border-white/15 bg-white/[0.05] p-7 text-center">
                        <Icon className="mx-auto bg-white/10 text-xl text-white">
                          ✓
                        </Icon>
                        <h3 className="mt-4 font-bold text-white">
                          Queue is empty
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-blue-200">
                          No citizens are currently waiting for service.
                        </p>
                      </div>
                    )}

                    {callNextHint && (
                      <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-xs leading-5 text-amber-100">
                        <span className="font-extrabold">Please note: </span>
                        {callNextHint}
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
                      <span className="text-sm text-blue-200">
                        Total waiting
                      </span>
                      <span className="text-xl font-black text-[#F4B544]">
                        {waiting.length}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Waiting Queue */}

              <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                      Live queue
                    </p>
                    <h2 className="mt-2 text-2xl font-black uppercase text-[#15396B]">
                      Waiting queue.
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {waiting.length}{" "}
                      {waiting.length === 1 ? "citizen" : "citizens"} currently waiting
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setLoading(true);
                      load();
                    }}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#15396B] transition hover:border-[#F4B544] hover:bg-amber-50 disabled:opacity-60"
                  >
                    ↻ Refresh queue
                  </button>
                </div>

                {waiting.length === 0 ? (
                  <div className="p-5 sm:p-7">
                    <div className="rounded-xl border border-dashed border-slate-300 bg-[#F7F8FA] p-10 text-center">
                      <Icon className="mx-auto bg-white text-2xl shadow-sm">
                        ✓
                      </Icon>
                      <h3 className="mt-4 font-extrabold text-[#15396B]">
                        No citizens are waiting
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        The queue is clear right now.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 sm:p-6">
                    {waiting.map((token, index) => (
                      <div
                        key={getId(token) || token.tokenNumber}
                        className={`flex flex-col gap-4 rounded-xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${
                          index === 0
                            ? "border-[#F4B544] bg-[#FFFCF0]"
                            : "border-slate-100 bg-[#F7F8FA] hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                              index === 0
                                ? "bg-[#15396B] text-white"
                                : "bg-white text-slate-500 shadow-sm"
                            }`}
                          >
                            {index + 1}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-lg font-black text-[#15396B]">
                                {token.tokenNumber}
                              </p>

                              {index === 0 && (
                                <span className="rounded-full bg-[#F4B544]/30 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#15396B]">
                                  Next
                                </span>
                              )}
                            </div>

                            <p className="mt-1 truncate text-sm text-slate-500">
                              {token.serviceId?.name || "Service"}
                              {token.serviceId?.averageServiceTime
                                ? ` · avg. ${token.serviceId.averageServiceTime} min`
                                : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                          <div className="sm:text-right">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Joined
                            </p>
                            <p className="mt-1 text-sm font-bold text-slate-700">
                              {formatTime(token.createdAt)}
                            </p>
                          </div>

                          <TokenStatusBadge status={token.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Bottom navigation */}

              <section className="mt-8">
                <div className="mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                    Quick navigation
                  </p>
                  <h2 className="mt-2 text-2xl font-black uppercase text-[#15396B]">
                    Your workspace.
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => navigate("/operator/dashboard")}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#F4B544] hover:shadow-md"
                  >
                    <Icon className="bg-[#15396B] text-xl text-white">
                      📊
                    </Icon>
                    <div>
                      <p className="font-extrabold text-[#15396B]">
                        Dashboard
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        View operator overview
                      </p>
                    </div>
                    <span className="ml-auto text-xl text-slate-400 transition group-hover:text-[#15396B]">
                      →
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/operator/counter")}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#F4B544] hover:shadow-md"
                  >
                    <Icon className="bg-[#FFF4CC] text-xl">
                      🖥️
                    </Icon>
                    <div>
                      <p className="font-extrabold text-[#15396B]">
                        Counter control
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Manage counter availability
                      </p>
                    </div>
                    <span className="ml-auto text-xl text-slate-400 transition group-hover:text-[#15396B]">
                      →
                    </span>
                  </button>

                  <div className="flex items-center gap-4 rounded-2xl border border-[#F4B544]/50 bg-[#FFF8DF] p-5">
                    <Icon className="bg-white text-xl">
                      ℹ️
                    </Icon>
                    <div>
                      <p className="font-extrabold text-[#15396B]">
                        Queue handling
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Recall a token when needed. Skip a called token if
                        the citizen does not arrive.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="h-1.5 bg-[#F0D96A]" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4CC] text-xl">
                  🏛️
                </span>
                <span className="text-lg font-black tracking-tight text-[#15396B]">
                  QUEUELESS
                </span>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                Making government services simpler through digital queues,
                smarter counter management, and better citizen experiences.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Digital service network
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#15396B]">
                Quick links
              </h3>

              <div className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-500">
                <button
                  type="button"
                  onClick={() => navigate("/operator/dashboard")}
                  className="transition hover:text-[#15396B]"
                >
                  Operator dashboard →
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/operator/counter")}
                  className="transition hover:text-[#15396B]"
                >
                  Counter control →
                </button>

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("next-queue")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="transition hover:text-[#15396B]"
                >
                  Call next token ↑
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#15396B]">
                Operator desk
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Keep token statuses accurate and follow your office
                procedures while assisting citizens.
              </p>

              <p className="mt-3 text-xs font-semibold text-slate-400">
                Secure operator access
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} QueueLess. All rights reserved.
            </p>

            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
              Serving citizens, one token at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
