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
    desc: "Ready to call and serve citizens.",
    active: "border-green-400 bg-green-50 ring-2 ring-green-200",
    dot: "bg-green-500",
  },
  {
    value: "PAUSED",
    label: "Paused",
    desc: "Temporary break. No new tokens can be called.",
    active: "border-orange-400 bg-orange-50 ring-2 ring-orange-200",
    dot: "bg-orange-500",
  },
  {
    value: "OFFLINE",
    label: "Offline",
    desc: "Counter closed. No new tokens can be called.",
    active: "border-slate-400 bg-slate-100 ring-2 ring-slate-200",
    dot: "bg-slate-400",
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
      setNotice({ type: "error", message: err.message });
    } finally {
      setBusyStatus(null);
    }
  }

  const counter = dashboard?.counter;
  const office = dashboard?.office;
  const currentToken = dashboard?.currentToken;
  const counterName =
    counter?.name || (counter?.number ? `Counter ${counter.number}` : "Counter");
  const style = counterStyle(counter?.status);

  return (
    <div className="min-h-screen bg-slate-50">
      <OperatorNavbar user={user} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Counter Management
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Counter Control
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your assigned counter and serving status.
          </p>
        </section>

        <Notice notice={notice} onClose={() => setNotice(null)} />

        {loading ? (
          <PageSkeleton />
        ) : error && !dashboard ? (
          <ErrorState message={error} onRetry={() => { setLoading(true); load(); }} />
        ) : (
          <>
            {/* Current Counter */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-2xl">
                    🖥️
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Assigned Counter</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">{counterName}</h2>
                    <p className="mt-1 text-sm text-slate-500">{office?.name || "—"}</p>
                  </div>
                </div>
                <CounterStatusPill status={counter?.status} />
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Counter Status */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Counter Status</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Control whether your counter is available.
                </p>

                <div className={`mt-6 rounded-xl p-5 ${style.box}`}>
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${style.dot}`} />
                    <div>
                      <p className={`font-semibold ${style.text}`}>
                        Counter is {style.label}
                      </p>
                      <p className={`mt-1 text-sm ${style.text}`}>
                        {counter?.status === "AVAILABLE"
                          ? "You can call and serve citizens."
                          : "You cannot call new tokens until the counter is Available."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3" role="radiogroup" aria-label="Counter status">
                  {STATUS_OPTIONS.map((opt) => {
                    const selected = counter?.status === opt.value;
                    const isBusy = busyStatus === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={!!busyStatus || selected}
                        onClick={() => changeStatus(opt.value)}
                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition disabled:cursor-not-allowed ${
                          selected
                            ? opt.active
                            : "border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60"
                        }`}
                      >
                        <span className={`h-3 w-3 shrink-0 rounded-full ${opt.dot}`} />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{opt.label}</p>
                          <p className="text-xs text-slate-500">{opt.desc}</p>
                        </div>
                        {isBusy ? (
                          <Spinner />
                        ) : selected ? (
                          <span className="text-xs font-semibold text-slate-600">Current</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Counter Information */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Counter Information</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Details of your current assignment.
                </p>

                <dl className="mt-6 space-y-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Counter</dt>
                    <dd className="font-semibold text-slate-900">{counterName}</dd>
                  </div>
                  {counter?.number != null && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">Counter number</dt>
                      <dd className="font-semibold text-slate-900">{counter.number}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Office</dt>
                    <dd className="text-right font-semibold text-slate-900">{office?.name || "—"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">People waiting</dt>
                    <dd className="font-semibold text-blue-600">{dashboard?.waitingCount ?? 0}</dd>
                  </div>
                </dl>

                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-500">Current token</p>
                  {currentToken ? (
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{currentToken.tokenNumber}</p>
                        <p className="text-sm text-slate-500">
                          {currentToken.serviceId?.name || "—"}
                        </p>
                      </div>
                      <TokenStatusBadge status={currentToken.status} />
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-slate-600">No token at this counter.</p>
                  )}
                </div>

                <p className="mt-5 text-xs leading-5 text-slate-500">
                  Counter and service assignments are managed by your administrator.
                  Contact them if you need a change.
                </p>
              </div>
            </section>

            <div className="mt-6 flex flex-wrap gap-6">
              <button
                type="button"
                onClick={() => navigate("/operator/queue")}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                ← Back to Queue Management
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
