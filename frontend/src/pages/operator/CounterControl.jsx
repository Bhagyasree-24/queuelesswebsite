
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OperatorNavbar from "../../components/operator/OperatorNavbar";
import {
  getOperatorDashboard,
  updateCounterStatus,
} from "../../services/operatorApi";
import {
  CounterStatusPill,
  ErrorState,
  Notice,
  PageSkeleton,
  Spinner,
  TokenStatusBadge,
  counterStyle,
} from "../../components/operator/OperatorUi";

const STATUS_OPTIONS = [
  {
    value: "AVAILABLE",
    label: "Available",
    shortLabel: "Ready",
    desc: "Ready to call and serve citizens.",
    dot: "bg-emerald-500",
    selected: "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100",
  },
  {
    value: "PAUSED",
    label: "Paused",
    shortLabel: "On break",
    desc: "Temporary break. No new tokens can be called.",
    dot: "bg-amber-500",
    selected: "border-amber-300 bg-amber-50 ring-2 ring-amber-100",
  },
  {
    value: "OFFLINE",
    label: "Offline",
    shortLabel: "Closed",
    desc: "Counter closed. No new tokens can be called.",
    dot: "bg-slate-400",
    selected: "border-slate-400 bg-slate-100 ring-2 ring-slate-200",
  },
];

export default function CounterControl({ user }) {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyStatus, setBusyStatus] = useState(null);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await getOperatorDashboard();
      setDashboard(data.dashboard);
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

  async function changeStatus(status) {
    if (busyStatus || status === dashboard?.counter?.status) return;

    setBusyStatus(status);
    setNotice(null);

    try {
      const res = await updateCounterStatus(status);

      setNotice({
        type: "success",
        message: res?.message || "Counter status updated.",
      });

      await load();
    } catch (err) {
      setNotice({
        type: "error",
        message: err.message || "Unable to update counter status.",
      });
    } finally {
      setBusyStatus(null);
    }
  }

  const counter = dashboard?.counter;
  const office = dashboard?.office;
  const currentToken = dashboard?.currentToken;

  const counterName =
    counter?.name ||
    (counter?.number ? `Counter ${counter.number}` : "Counter");

  const style = counterStyle(counter?.status);

  const currentStatus =
    STATUS_OPTIONS.find((item) => item.value === counter?.status) ||
    STATUS_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900">
      <OperatorNavbar user={user} />

      <main>
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#15396B]">
          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[#F4B544]/15 blur-3xl" />
            <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
          </div>

          {/* Subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
              backgroundSize: "38px 38px",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pb-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Hero content */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-white sm:text-xs">
                    Official Operator Portal
                  </span>
                </div>

                <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.2em] text-[#F4B544]">
                  Your service. Your counter. Your control.
                </p>

                <h1 className="mt-3 max-w-2xl text-4xl font-black uppercase leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-7xl">
                  Manage
                  <br />
                  your counter.
                  <br />
                  <span className="text-[#F4B544]">Serve smarter.</span>
                </h1>

                <p className="mt-6 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                  Control counter availability, monitor the current token,
                  and help citizens move through government services with
                  less waiting.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("counter-status")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#F4B544] px-5 py-3.5 text-sm font-extrabold text-[#15396B] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#FFD978]"
                  >
                    Manage availability
                    <span className="text-lg">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/operator/queue")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    View queue
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-blue-100 sm:text-sm">
                  <span className="flex items-center gap-2">
                    <span className="font-black text-[#F4B544]">✓</span>
                    Simple status control
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-black text-[#F4B544]">✓</span>
                    Live token details
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-black text-[#F4B544]">✓</span>
                    Better citizen service
                  </span>
                </div>
              </div>

              {/* Hero preview card */}
              <div className="relative mx-auto w-full max-w-md lg:ml-auto">
                <div className="absolute -right-3 -top-3 h-20 w-20 border-r-4 border-t-4 border-[#F4B544] sm:-right-5 sm:-top-5" />

                <div className="relative overflow-hidden rounded-2xl bg-[#F0D96A] p-2 shadow-2xl sm:p-3">
                  <div className="rounded-xl bg-white p-5 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-slate-400">
                          Counter overview
                        </p>
                        <h2 className="mt-2 text-xl font-black uppercase leading-tight text-[#15396B] sm:text-2xl">
                          {counterName}
                        </h2>
                      </div>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#15396B] text-2xl text-white">
                        🏛️
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-y border-slate-100 py-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Office
                        </p>
                        <p className="mt-1 max-w-[200px] truncate text-sm font-bold text-slate-800">
                          {office?.name || "Government Office"}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#F7F8FA] px-3 py-1.5 text-[10px] font-bold text-slate-500">
                        OPERATOR
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#F7F8FA] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          People waiting
                        </p>
                        <p className="mt-2 text-3xl font-black text-[#15396B]">
                          {loading ? "—" : dashboard?.waitingCount ?? 0}
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
                          Current availability
                        </p>
                        <p className="mt-1 font-extrabold">
                          {loading ? "Loading..." : currentStatus.label}
                        </p>
                      </div>

                      <span
                        className={`h-3 w-3 shrink-0 rounded-full ${currentStatus.dot}`}
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
          {/* Section heading */}
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B] sm:text-xs">
                  Operator workspace
                </p>
              </div>

              <h2 className="mt-2 text-3xl font-black uppercase leading-tight tracking-tight text-[#15396B] sm:text-4xl">
                Your counter,
                <br className="sm:hidden" /> at a glance.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your service availability and check the current queue
                from one convenient workspace.
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

          <div className="mb-5">
            <Notice
              notice={notice}
              onClose={() => setNotice(null)}
            />
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
              <PageSkeleton />
            </div>
          ) : error && !dashboard ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
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
              {/* ================= QUICK STATS ================= */}
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#15396B] text-xl text-white">
                      🏛️
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Assignment
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Your counter
                  </p>
                  <p className="mt-1 truncate text-xl font-black text-[#15396B]">
                    {counterName}
                  </p>
                  <p className="mt-2 truncate text-xs text-slate-500">
                    {office?.name || "Government Office"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF4CC] text-xl">
                      👥
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Queue
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    People waiting
                  </p>
                  <p className="mt-1 text-3xl font-black text-[#15396B]">
                    {dashboard?.waitingCount ?? 0}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Citizens awaiting service
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                      🎫
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Serving
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Current token
                  </p>
                  <p className="mt-1 truncate text-3xl font-black text-emerald-700">
                    {currentToken?.tokenNumber || "—"}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Currently assigned token
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1F3F7] text-xl">
                      ◉
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Availability
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Counter status
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${currentStatus.dot}`}
                    />
                    <p className="text-xl font-black text-[#15396B]">
                      {currentStatus.label}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Current service availability
                  </p>
                </div>
              </section>

              {/* ================= STATUS + INFORMATION ================= */}
              <section className="mt-8 grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Counter status control */}
                <div
                  id="counter-status"
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                      Control panel
                    </p>
                    <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#15396B] sm:text-3xl">
                      Set your status.
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Choose your current availability. Your counter status
                      determines whether you are ready to serve citizens.
                    </p>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className={`rounded-xl p-4 ${style.box}`}>
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-3 w-3 shrink-0 rounded-full ${style.dot}`}
                        />
                        <div>
                          <p className={`font-extrabold ${style.text}`}>
                            Counter is {style.label}
                          </p>
                          <p className={`mt-1 text-sm leading-5 ${style.text}`}>
                            {counter?.status === "AVAILABLE"
                              ? "Your counter is ready to call and serve citizens."
                              : "Your counter is not currently available to call new tokens."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {STATUS_OPTIONS.map((opt) => {
                        const selected = counter?.status === opt.value;
                        const isBusy = busyStatus === opt.value;

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            disabled={!!busyStatus || selected}
                            aria-pressed={selected}
                            onClick={() => changeStatus(opt.value)}
                            className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition duration-200 ${
                              selected
                                ? `${opt.selected} shadow-sm`
                                : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-[#F4B544] hover:bg-[#FFFCF0] hover:shadow-sm disabled:opacity-60"
                            } disabled:cursor-not-allowed`}
                          >
                            <span
                              className={`h-3 w-3 shrink-0 rounded-full ${opt.dot}`}
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-extrabold text-slate-900">
                                  {opt.label}
                                </p>
                                {selected && (
                                  <span className="rounded-full bg-white px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500 shadow-sm">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {opt.desc}
                              </p>
                            </div>

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition group-hover:bg-[#F4B544]/20 group-hover:text-[#15396B]">
                              {isBusy ? (
                                <Spinner />
                              ) : selected ? (
                                <span className="font-black">✓</span>
                              ) : (
                                <span className="text-lg">→</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 rounded-xl bg-[#F7F8FA] p-4">
                      <p className="text-xs leading-5 text-slate-500">
                        <span className="font-extrabold text-[#15396B]">
                          Please note:
                        </span>{" "}
                        Change your status when you start work, take a break,
                        or close your counter.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Counter information and token */}
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-6 sm:px-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                        Counter details
                      </p>
                      <h2 className="mt-2 text-xl font-black uppercase text-[#15396B]">
                        Your assignment.
                      </h2>
                    </div>

                    <dl className="divide-y divide-slate-100 px-5 sm:px-6">
                      <div className="flex items-start justify-between gap-4 py-4">
                        <dt className="text-sm text-slate-500">
                          Counter name
                        </dt>
                        <dd className="max-w-[60%] text-right text-sm font-extrabold text-slate-900">
                          {counterName}
                        </dd>
                      </div>

                      {counter?.number != null && (
                        <div className="flex items-center justify-between gap-4 py-4">
                          <dt className="text-sm text-slate-500">
                            Counter number
                          </dt>
                          <dd className="text-sm font-extrabold text-slate-900">
                            {counter.number}
                          </dd>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-4 py-4">
                        <dt className="text-sm text-slate-500">Office</dt>
                        <dd className="max-w-[60%] text-right text-sm font-extrabold text-slate-900">
                          {office?.name || "—"}
                        </dd>
                      </div>

                      <div className="flex items-center justify-between gap-4 py-4">
                        <dt className="text-sm text-slate-500">
                          People waiting
                        </dt>
                        <dd className="text-sm font-extrabold text-[#15396B]">
                          {dashboard?.waitingCount ?? 0}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Current token card */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                        Live queue
                      </p>
                      <h2 className="mt-2 text-xl font-black uppercase text-[#15396B]">
                        Now serving.
                      </h2>
                    </div>

                    <div className="p-5 sm:p-6">
                      {currentToken ? (
                        <div className="rounded-xl bg-[#15396B] p-5 text-white">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                              Current token
                            </p>
                            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white">
                              <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
                              Active
                            </span>
                          </div>

                          <p className="mt-3 break-words text-4xl font-black tracking-tight text-[#F4B544] sm:text-5xl">
                            {currentToken.tokenNumber || "—"}
                          </p>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-4">
                            <p className="text-xs text-blue-100">
                              {currentToken.serviceId?.name || "Current service"}
                            </p>
                            <TokenStatusBadge status={currentToken.status} />
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-[#F7F8FA] px-5 py-8 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                            🎫
                          </div>
                          <h3 className="mt-4 font-extrabold text-[#15396B]">
                            No active token
                          </h3>
                          <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
                            There is no currently assigned token at your
                            counter.
                          </p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => navigate("/operator/queue")}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-[#15396B] transition hover:border-[#F4B544] hover:bg-[#FFFCF0]"
                      >
                        Open queue management
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* ================= SERVICE BANNER ================= */}
              <section className="mt-8 overflow-hidden rounded-2xl bg-[#F0D96A]">
                <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="relative flex min-h-48 items-center justify-center overflow-hidden bg-[#15396B] p-8 sm:min-h-56">
                    <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full border border-white/10" />
                    <div className="absolute -bottom-20 -right-8 h-56 w-56 rounded-full border-[28px] border-white/5" />

                    <div className="relative text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                        🏛️
                      </div>
                      <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-[#F4B544]">
                        Public service
                      </p>
                      <p className="mt-1 text-lg font-black uppercase text-white">
                        Starts with you.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                      Every citizen counts
                    </p>

                    <h2 className="mt-3 max-w-xl text-3xl font-black uppercase leading-[0.98] tracking-tight text-[#15396B] sm:text-4xl">
                      Better service.
                      <br />
                      Less waiting.
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-[#263B4D]">
                      Keep your counter status updated, serve citizens
                      efficiently, and help make every government office visit
                      a better experience.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/operator/queue")}
                      className="mt-6 inline-flex w-fit items-center justify-center gap-3 rounded-lg bg-[#15396B] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#0E2A50]"
                    >
                      Go to queue management
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="h-1 bg-[#F0D96A]" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0D96A] text-lg">
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

            {/* Quick links */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#15396B]">
                Quick links
              </h3>

              <div className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-500">
                <button
                  type="button"
                  onClick={() => navigate("/operator/queue")}
                  className="transition hover:text-[#15396B]"
                >
                  Queue Management →
                </button>

                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("counter-status")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="transition hover:text-[#15396B]"
                >
                  Counter Control ↑
                </button>
              </div>
            </div>

            {/* Operator information */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#15396B]">
                Operator desk
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Keep your availability accurate and follow your office's
                procedures when serving citizens.
              </p>

              <p className="mt-3 text-xs font-semibold text-slate-400">
                Secure operator access
              </p>
            </div>
          </div>

          {/* Copyright */}
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
