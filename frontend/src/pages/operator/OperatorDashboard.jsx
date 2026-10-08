import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OperatorNavbar from "../../components/operator/OperatorNavbar";
import {
  getOperatorDashboard,
  getOperatorQueue,
  callNextToken,
  startToken,
  completeToken,
  updateCounterStatus,
} from "../../services/operatorApi";
import {
  ActionButton,
  BTN,
  CounterStatusPill,
  ErrorState,
  Notice,
  PageSkeleton,
  TokenStatusBadge,
  counterStyle,
  formatTime,
  getId,
} from "../../components/operator/OperatorUi";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function OperatorDashboard({ user }) {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState(null);

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

  async function runAction(key, fn, successFallback) {
    if (busy) return;
    setBusy(key);
    setNotice(null);
    try {
      const res = await fn();
      if (res && res.success === false) {
        setNotice({ type: "info", message: res.message || "Nothing to do." });
      } else {
        setNotice({ type: "success", message: res?.message || successFallback });
      }
      await load();
    } catch (err) {
      setNotice({ type: "error", message: err.message });
      await load();
    } finally {
      setBusy(null);
    }
  }

  const operator = dashboard?.operator;
  const office = dashboard?.office;
  const counter = dashboard?.counter;
  const currentToken = dashboard?.currentToken;
  const currentId = getId(currentToken);
  const waiting = queue.filter((t) => t.status === "WAITING");
  const counterStatus = counter?.status;
  const counterName =
    counter?.name || (counter?.number ? `Counter ${counter.number}` : "Counter");
  const operatorName = operator?.name || user?.name || "Operator";
  const isAvailable = counterStatus === "AVAILABLE";

  const stats = [
    {
      label: "People Waiting",
      value: dashboard?.waitingCount ?? waiting.length,
      description: "Waiting in your office queue",
      icon: "👥",
    },
    {
      label: "Current Token",
      value: currentToken?.tokenNumber || "None",
      description: currentToken ? `Status: ${currentToken.status}` : "No active token",
      icon: "🎟️",
    },
    {
      label: "Counter Status",
      value: counterStyle(counterStatus).label,
      description: counterName,
      icon: "🖥️",
    },
    {
      label: "Active Tokens",
      value: queue.length,
      description: "Waiting, called or serving",
      icon: "📋",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <OperatorNavbar user={user || operator} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Operator Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            {greeting()}, {operatorName}
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your assigned queue and keep citizens moving.
          </p>
        </section>

        <Notice notice={notice} onClose={() => setNotice(null)} />

        {loading ? (
          <PageSkeleton />
        ) : error && !dashboard ? (
          <ErrorState message={error} onRetry={() => { setLoading(true); load(); }} />
        ) : (
          <>
            {error && (
              <p className="mt-4 text-sm text-red-600">
                Couldn't refresh: {error}{" "}
                <button type="button" onClick={load} className="font-semibold underline">
                  Retry
                </button>
              </p>
            )}

            {/* Office / Counter */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Assigned Office</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {office?.name || "—"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{counterName}</p>
                </div>
                <CounterStatusPill status={counterStatus} />
              </div>
            </section>

            {/* Current Token (primary focus) */}
            <section className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Current Token</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Token currently at your counter
                    </p>
                  </div>
                  {currentToken && <TokenStatusBadge status={currentToken.status} />}
                </div>

                {currentToken ? (
                  <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Token Number</p>
                        <p className="mt-1 text-6xl font-bold text-blue-600">
                          {currentToken.tokenNumber}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div>
                          <p className="text-slate-500">Citizen</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {currentToken.userId?.name || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Counter</p>
                          <p className="mt-1 font-semibold text-slate-900">{counterName}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Service</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {currentToken.serviceId?.name || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">
                            {currentToken.status === "SERVING" ? "Started" : "Called"}
                          </p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {formatTime(
                              currentToken.status === "SERVING"
                                ? currentToken.startedAt
                                : currentToken.calledAt
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <p className="text-lg font-semibold text-slate-800">
                      No token currently being served
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {waiting.length > 0
                        ? `${waiting.length} waiting — call the next citizen.`
                        : "No citizens are currently waiting."}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {/* Primary action depends on state */}
                  {!currentToken && (
                    <ActionButton
                      className={BTN.primary}
                      busy={busy === "next"}
                      disabled={!isAvailable || waiting.length === 0 || !!busy}
                      busyLabel="Calling..."
                      onClick={() => runAction("next", callNextToken, "Next token called.")}
                    >
                      Call Next
                    </ActionButton>
                  )}
                  {currentToken?.status === "CALLED" && (
                    <ActionButton
                      className={BTN.primary}
                      busy={busy === "start"}
                      disabled={!!busy}
                      busyLabel="Starting..."
                      onClick={() =>
                        runAction("start", () => startToken(currentId), "Service started.")
                      }
                    >
                      Start Serving
                    </ActionButton>
                  )}
                  {currentToken?.status === "SERVING" && (
                    <ActionButton
                      className={BTN.success}
                      busy={busy === "complete"}
                      disabled={!!busy}
                      busyLabel="Completing..."
                      onClick={() =>
                        runAction("complete", () => completeToken(currentId), "Token completed.")
                      }
                    >
                      Complete Token
                    </ActionButton>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate("/operator/queue")}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${BTN.neutral}`}
                  >
                    Manage Queue
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/operator/counter")}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${BTN.neutral}`}
                  >
                    Counter Control
                  </button>
                </div>
                {!currentToken && !isAvailable && (
                  <p className="mt-3 text-xs text-orange-600">
                    Counter is {counterStyle(counterStatus).label.toLowerCase()}. Set it to
                    Available to call tokens.
                  </p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
                <p className="mt-1 text-sm text-slate-500">Manage your counter and queue</p>

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => navigate("/operator/queue")}
                    className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg">🎟️</span>
                    <div>
                      <p className="font-semibold text-slate-900">View Queue</p>
                      <p className="text-xs text-slate-500">Manage waiting tokens</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/operator/counter")}
                    className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-lg">🖥️</span>
                    <div>
                      <p className="font-semibold text-slate-900">Counter Control</p>
                      <p className="text-xs text-slate-500">Manage counter status</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={!!busy}
                    onClick={() =>
                      runAction(
                        "status",
                        () => updateCounterStatus(isAvailable ? "PAUSED" : "AVAILABLE"),
                        isAvailable ? "Counter paused." : "Counter is available."
                      )
                    }
                    className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-lg">
                      {isAvailable ? "⏸️" : "▶️"}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {busy === "status"
                          ? "Updating..."
                          : isAvailable
                          ? "Pause Counter"
                          : "Set Available"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isAvailable ? "Temporarily stop serving" : "Resume serving citizens"}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                      <p className="mt-2 truncate text-3xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-xl">
                      {stat.icon}
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{stat.description}</p>
                </div>
              ))}
            </section>

            {/* Queue Preview */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Queue Overview</h2>
                  <p className="mt-1 text-sm text-slate-500">Next waiting tokens in your office</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/operator/queue")}
                  className="text-left text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View full queue →
                </button>
              </div>

              {waiting.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  No citizens are currently waiting.
                </div>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-sm text-slate-500">
                        <th className="px-4 py-3 font-medium">Token</th>
                        <th className="px-4 py-3 font-medium">Service</th>
                        <th className="px-4 py-3 font-medium">Position</th>
                        <th className="px-4 py-3 font-medium">Joined</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {waiting.slice(0, 5).map((t, i) => (
                        <tr
                          key={getId(t) || t.tokenNumber}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-4 py-4 font-semibold text-slate-900">{t.tokenNumber}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{t.serviceId?.name || "—"}</td>
                          <td className="px-4 py-4 text-sm font-medium text-slate-700">#{i + 1}</td>
                          <td className="px-4 py-4 text-sm text-slate-600">{formatTime(t.createdAt)}</td>
                          <td className="px-4 py-4"><TokenStatusBadge status={t.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
