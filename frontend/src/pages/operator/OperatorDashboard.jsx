
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OperatorNavbar from "../../components/operator/OperatorNavbar";
import {
  getOperatorDashboard,
  updateCounterStatus,
} from "../../services/operatorApi";
import {
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
    desc: "Ready to call and serve citizens.",
    dot: "bg-emerald-500",
    selected: "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100",
  },
  {
    value: "PAUSED",
    label: "Paused",
    desc: "Temporary break. No new tokens can be called.",
    dot: "bg-amber-500",
    selected: "border-amber-300 bg-amber-50 ring-2 ring-amber-100",
  },
  {
    value: "OFFLINE",
    label: "Offline",
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
    <div className="min-h-screen bg-white text-[#151515]">
      <OperatorNavbar user={user} />

      <main>
        {/* HERO — editorial style inspired by the reference image */}
        <section className="px-3 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-[#F3F3F1]">
            <div className="absolute inset-y-0 right-0 hidden w-[42%] bg-[#F0D96A] lg:block" />

            <div className="relative grid min-h-[410px] lg:grid-cols-[1.15fr_0.85fr]">
              <div className="flex flex-col justify-center px-5 py-9 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#F0D96A]" />
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.15em]">
                    Official operator portal
                  </span>
                </div>

                <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#15396B]">
                  Your service. Your responsibility.
                </p>

                <h1 className="mt-3 max-w-2xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                  Manage
                  <br />
                  your counter.
                  <br />
                  <span className="relative z-0 inline-block">
                    <span className="absolute inset-x-0 bottom-1 -z-10 h-[72%] -rotate-1 bg-[#F0D96A]" />
                    Serve smarter.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-sm leading-6 text-slate-600">
                  Control your counter availability, check the current token,
                  and help citizens complete their government services with
                  less waiting.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("counter-status")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="inline-flex items-center gap-3 rounded-md bg-[#151515] px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-[#15396B]"
                  >
                    Manage counter
                    <span className="text-base">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/operator/queue")}
                    className="inline-flex items-center gap-2 rounded-md border border-black/15 bg-white px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-[#151515] transition hover:border-[#15396B] hover:text-[#15396B]"
                  >
                    View queue ↗
                  </button>
                </div>

                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  <span>✓ Live queue</span>
                  <span>✓ Status control</span>
                  <span>✓ Citizen service</span>
                </div>
              </div>

              {/* Counter preview */}
              <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden px-5 py-10 sm:px-10 lg:min-h-full">
                <div className="absolute right-[-70px] top-[-60px] h-72 w-72 rounded-full border-[35px] border-white/35" />
                <div className="absolute bottom-[-110px] left-[-20px] h-72 w-72 rounded-full bg-[#15396B]/10" />

                <div className="relative w-full max-w-sm">
                  <div className="absolute -right-2 -top-2 h-12 w-12 border-r-4 border-t-4 border-[#15396B] sm:-right-3 sm:-top-3" />

                  <div className="relative rounded-lg bg-white p-5 shadow-xl sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                          Counter overview
                        </p>
                        <h2 className="mt-2 break-words text-2xl font-black uppercase leading-tight tracking-tight text-[#15396B]">
                          {counterName}
                        </h2>
                      </div>

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#F0D96A] text-xl">
                        🏛️
                      </div>
                    </div>

                    <div className="mt-5 border-y border-slate-100 py-4">
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">
                        Assigned office
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-800">
                        {office?.name || "Government Office"}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-[#F5F5F3] p-4">
                        <p className="text-[9px] font-extrabold uppercase tracking-wide text-slate-500">
                          Waiting
                        </p>
                        <p className="mt-2 text-3xl font-black text-[#15396B]">
                          {loading ? "—" : dashboard?.waitingCount ?? 0}
                        </p>
                      </div>

                      <div className="bg-[#FFF8D8] p-4">
                        <p className="text-[9px] font-extrabold uppercase tracking-wide text-slate-500">
                          Now serving
                        </p>
                        <p className="mt-2 truncate text-2xl font-black text-[#15396B]">
                          {currentToken?.tokenNumber || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 bg-[#15396B] px-4 py-3 text-white">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-200">
                          Counter status
                        </p>
                        <p className="mt-1 text-sm font-extrabold">
                          {loading ? "Loading..." : currentStatus.label}
                        </p>
                      </div>
                      <span
                        className={`h-3 w-3 shrink-0 rounded-full ${currentStatus.dot}`}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[9px] font-extrabold uppercase tracking-widest text-[#15396B]">
                    <span>QueueLess operator desk</span>
                    <span>Service in progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Yellow category strip */}
        <div className="bg-[#F0D96A]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-3 px-4 py-4 text-[9px] font-black uppercase tracking-wider text-[#292719] sm:px-6 lg:px-8">
            <span>▪ Counter availability</span>
            <span>▪ Queue overview</span>
            <span>▪ Token information</span>
            <span>▪ Public service</span>
            <span>▪ Secure operator access</span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                Your operator workspace
              </p>
              <h2 className="mt-2 text-4xl font-black uppercase leading-[0.95] tracking-[-0.04em] text-[#151515] sm:text-5xl">
                Your counter.
                <br />
                Your control.
              </h2>
              <div className="mt-3 h-2 w-32 -rotate-1 bg-[#F0D96A]" />
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                Review your assignment, monitor the queue, and keep your
                service availability up to date.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                load();
              }}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-md border border-slate-200 bg-white px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-[#15396B] transition hover:border-[#F0D96A] hover:bg-[#FFFBEA] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
            >
              <span className={loading ? "animate-spin" : ""}>↻</span>
              Refresh details
            </button>
          </div>

          <Notice notice={notice} onClose={() => setNotice(null)} />

          {loading ? (
            <div className="mt-6 border border-slate-200 bg-white p-5 sm:p-7">
              <PageSkeleton />
            </div>
          ) : error && !dashboard ? (
            <div className="mt-6 border border-slate-200 bg-white p-5 sm:p-7">
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
              {/* Statistics */}
              <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🏛️</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Assignment
                    </span>
                  </div>
                  <p className="mt-5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Your counter
                  </p>
                  <p className="mt-1 truncate text-xl font-black text-[#15396B]">
                    {counterName}
                  </p>
                  <p className="mt-2 truncate text-xs text-slate-500">
                    {office?.name || "Government Office"}
                  </p>
                </div>

                <div className="border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">👥</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Queue
                    </span>
                  </div>
                  <p className="mt-5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    People waiting
                  </p>
                  <p className="mt-1 text-3xl font-black text-[#15396B]">
                    {dashboard?.waitingCount ?? 0}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Citizens awaiting service
                  </p>
                </div>

                <div className="border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🎫</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Live token
                    </span>
                  </div>
                  <p className="mt-5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Now serving
                  </p>
                  <p className="mt-1 truncate text-3xl font-black text-emerald-700">
                    {currentToken?.tokenNumber || "—"}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Currently assigned token
                  </p>
                </div>

                <div className="border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">◉</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Availability
                    </span>
                  </div>
                  <p className="mt-5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
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

              {/* Status control and details */}
              <section className="mt-10 grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div
                  id="counter-status"
                  className="border border-slate-200 bg-white"
                >
                  <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                      Control panel / 01
                    </p>
                    <h2 className="mt-2 text-3xl font-black uppercase leading-tight tracking-tight text-[#151515] sm:text-4xl">
                      Set your status.
                    </h2>
                    <div className="mt-3 h-2 w-24 -rotate-1 bg-[#F0D96A]" />
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                      Choose whether your counter is ready to receive and
                      serve citizens.
                    </p>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className={`p-4 ${style.box}`}>
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
                            className={`group flex w-full items-center gap-4 border p-4 text-left transition duration-200 ${
                              selected
                                ? `${opt.selected} shadow-sm`
                                : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-[#F0D96A] hover:bg-[#FFFCF0] hover:shadow-sm disabled:opacity-60"
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
                                  <span className="bg-white px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500 shadow-sm">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {opt.desc}
                              </p>
                            </div>

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#F7F8FA] text-slate-500 transition group-hover:bg-[#F0D96A] group-hover:text-[#15396B]">
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

                    <div className="mt-5 bg-[#F7F8FA] p-4">
                      <p className="text-xs leading-5 text-slate-500">
                        <span className="font-extrabold text-[#15396B]">
                          Please note:
                        </span>{" "}
                        Update your status when starting work, taking a break,
                        or closing your counter.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Assignment details */}
                  <div className="border border-slate-200 bg-white">
                    <div className="border-b border-slate-100 px-5 py-6 sm:px-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                        Counter details / 02
                      </p>
                      <h2 className="mt-2 text-2xl font-black uppercase text-[#151515]">
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

                  {/* Current token */}
                  <div className="border border-slate-200 bg-white">
                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                        Live queue / 03
                      </p>
                      <h2 className="mt-2 text-2xl font-black uppercase text-[#151515]">
                        Now serving.
                      </h2>
                    </div>

                    <div className="p-5 sm:p-6">
                      {currentToken ? (
                        <div className="bg-[#15396B] p-5 text-white">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                              Current token
                            </p>
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white">
                              <span className="h-2 w-2 rounded-full bg-[#F0D96A]" />
                              Active
                            </span>
                          </div>

                          <p className="mt-3 break-words text-4xl font-black tracking-tight text-[#F0D96A] sm:text-5xl">
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
                        <div className="border border-dashed border-slate-200 bg-[#F7F8FA] px-5 py-8 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center bg-white text-2xl shadow-sm">
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
                        className="mt-4 flex w-full items-center justify-center gap-2 border border-slate-200 bg-white px-4 py-3 text-xs font-extrabold uppercase tracking-wide text-[#15396B] transition hover:border-[#F0D96A] hover:bg-[#FFFCF0]"
                      >
                        Open queue management <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Service banner inspired by the reference image */}
              <section className="mt-10 overflow-hidden bg-[#F0D96A]">
                <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
                  <div className="relative flex min-h-56 items-center justify-center overflow-hidden bg-[#15396B] p-8">
                    <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full border border-white/15" />
                    <div className="absolute -bottom-20 -right-8 h-56 w-56 rounded-full border-[28px] border-white/10" />

                    <div className="relative text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center bg-white/10 text-3xl">
                        🏛️
                      </div>
                      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#F0D96A]">
                        Public service
                      </p>
                      <p className="mt-1 text-xl font-black uppercase text-white">
                        Starts with you.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#15396B]">
                      Every citizen counts
                    </p>

                    <h2 className="mt-3 max-w-xl text-4xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#151515] sm:text-5xl">
                      Better service.
                      <br />
                      Less waiting.
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-[#263B4D]">
                      Keep your counter status updated and help make every
                      government office visit a better experience.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/operator/queue")}
                      className="mt-6 inline-flex w-fit items-center justify-center gap-3 bg-[#151515] px-5 py-3 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-[#15396B]"
                    >
                      Go to queue management <span>→</span>
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="h-1.5 bg-[#F0D96A]" />

        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.8fr]">
            {/* Brand */}
            <div>
              <a
                href="#top"
                onClick={(event) => {
                  event.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2"
              >
                <span className="flex h-9 w-9 items-center justify-center bg-[#F0D96A] text-lg">
                  🏛️
                </span>
                <span className="text-lg font-black tracking-tight text-[#15396B]">
                  QUEUELESS
                </span>
              </a>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
                Making government services simpler with digital queues,
                smarter counter management, and a better citizen experience.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 bg-[#F7F8FA] px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide text-[#15396B]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Operator portal
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-[#15396B]">
                Quick links
              </h3>

              <div className="mt-4 flex flex-col items-start gap-3 text-sm text-slate-500">
                <button
                  type="button"
                  onClick={() => navigate("/operator/queue")}
                  className="transition hover:text-[#15396B]"
                >
                  Queue management →
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
                  Counter control ↑
                </button>
              </div>
            </div>

            {/* Service information */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-[#15396B]">
                Service commitment
              </h3>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Keep your availability accurate and follow your office
                procedures while serving citizens.
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
              <span className="h-2 w-2 rounded-full bg-[#F0D96A]" />
              Serving citizens, one token at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
