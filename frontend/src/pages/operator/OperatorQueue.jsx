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
  BTN,
  CounterStatusPill,
  ErrorState,
  Notice,
  PageSkeleton,
  TokenStatusBadge,
  formatTime,
  getId,
} from "../../components/operator/OperatorUi";

export default function OperatorQueue({ user }) {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null); // name of the running action
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
    if (busy) return; // block duplicate clicks
    setBusy(key);
    setNotice(null);
    try {
      const res = await fn();
      if (res && res.success === false) {
        // e.g. "No waiting tokens" (HTTP 200) - not an error
        setNotice({ type: "info", message: res.message || "Nothing to do." });
      } else {
        setNotice({
          type: "success",
          message: res?.message || successFallback,
        });
      }
      await load();
    } catch (err) {
      setNotice({ type: "error", message: err.message });
      await load(); // state may be stale (e.g. 409), resync
    } finally {
      setBusy(null);
    }
  }

  const counter = dashboard?.counter;
  const office = dashboard?.office;
  const currentToken = dashboard?.currentToken;
  const currentId = getId(currentToken);
  const waiting = queue.filter((t) => t.status === "WAITING");
  const nextToken = waiting[0];

  const counterReady = counter?.status === "AVAILABLE";
  const canCallNext = counterReady && !currentToken;

  let callNextHint = "";
  if (currentToken) callNextHint = "Finish or skip the current token first.";
  else if (!counterReady)
    callNextHint = `Counter is ${(counter?.status || "unavailable").toLowerCase()}. Set it to Available to call tokens.`;

  return (
    <div className="min-h-screen bg-slate-50">
      <OperatorNavbar user={user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Queue Management
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Manage Queue
          </h1>
          <p className="mt-2 text-slate-600">
            Call and manage tokens waiting at your counter.
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

            {/* Counter Info */}
            <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Assigned Counter</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {counter?.name || (counter?.number ? `Counter ${counter.number}` : "Counter")}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {office?.name || "Assigned office"}
                </p>
              </div>
              <CounterStatusPill status={counter?.status} />
            </section>

            {/* Current Token */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Current Token
              </p>

              {currentToken ? (
                <div className="mt-2 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-4">
                      <h2 className="text-6xl font-bold text-slate-900">
                        {currentToken.tokenNumber}
                      </h2>
                      <TokenStatusBadge status={currentToken.status} />
                    </div>

                    <div className="mt-4 space-y-1 text-sm text-slate-500">
                      <p>
                        Citizen:{" "}
                        <span className="font-medium text-slate-700">
                          {currentToken.userId?.name || "—"}
                        </span>
                      </p>
                      <p>
                        Service:{" "}
                        <span className="font-medium text-slate-700">
                          {currentToken.serviceId?.name || "—"}
                        </span>
                      </p>
                      <p>
                        Called at:{" "}
                        <span className="font-medium text-slate-700">
                          {formatTime(currentToken.calledAt)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:w-96">
                    {currentToken.status === "CALLED" && (
                      <ActionButton
                        className={`${BTN.primary} sm:col-span-2`}
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

                    {currentToken.status === "SERVING" && (
                      <ActionButton
                        className={`${BTN.success} sm:col-span-2`}
                        busy={busy === "complete"}
                        disabled={!!busy}
                        busyLabel="Completing..."
                        onClick={() =>
                          runAction("complete", () => completeToken(currentId), "Token completed.")
                        }
                      >
                        Complete
                      </ActionButton>
                    )}

                    <ActionButton
                      className={BTN.recall}
                      busy={busy === "recall"}
                      disabled={!!busy}
                      busyLabel="Recalling..."
                      onClick={() =>
                        runAction("recall", () => recallToken(currentId), "Token recalled.")
                      }
                    >
                      Recall
                    </ActionButton>

                    {currentToken.status === "CALLED" && (
                      <ActionButton
                        className={BTN.danger}
                        busy={busy === "skip"}
                        disabled={!!busy}
                        busyLabel="Skipping..."
                        onClick={() =>
                          runAction("skip", () => skipToken(currentId), "Token skipped.")
                        }
                      >
                        Skip Token
                      </ActionButton>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-lg font-semibold text-slate-800">
                    No token currently being served
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {waiting.length > 0
                      ? "Use Call Next below to call the next citizen."
                      : "No citizens are currently waiting."}
                  </p>
                </div>
              )}
            </section>

            {/* Call Next */}
            <section className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-100">
                    Next in Queue
                  </p>

                  {nextToken ? (
                    <>
                      <h2 className="mt-1 text-3xl font-bold">
                        {nextToken.tokenNumber}
                      </h2>
                      <p className="mt-1 text-sm text-blue-100">
                        {nextToken.serviceId?.name || "Service"} •{" "}
                        {waiting.length - 1 === 0
                          ? "No one behind"
                          : `${waiting.length - 1} more waiting`}
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="mt-1 text-2xl font-bold">Queue is empty</h2>
                      <p className="mt-1 text-sm text-blue-100">
                        No citizens are currently waiting.
                      </p>
                    </>
                  )}

                  {callNextHint && (
                    <p className="mt-2 text-xs text-blue-100">{callNextHint}</p>
                  )}
                </div>

                <ActionButton
                  className="bg-white text-blue-600 hover:bg-blue-50 sm:min-w-[160px]"
                  busy={busy === "next"}
                  disabled={!canCallNext || !!busy}
                  busyLabel="Calling..."
                  onClick={() => runAction("next", callNextToken, "Next token called.")}
                >
                  Call Next
                </ActionButton>
              </div>
            </section>

            {/* Waiting Queue */}
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Waiting Queue</h2>
              <p className="mt-1 text-sm text-slate-500">
                {waiting.length} {waiting.length === 1 ? "token" : "tokens"} currently waiting
              </p>

              {waiting.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  No citizens are currently waiting.
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {waiting.map((token, index) => (
                    <div
                      key={getId(token) || token.tokenNumber}
                      className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-500 shadow-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{token.tokenNumber}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {token.serviceId?.name || "Service"}
                            {token.serviceId?.averageServiceTime
                              ? ` • avg. ${token.serviceId.averageServiceTime} min per citizen`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-5 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-slate-500">Joined at</p>
                          <p className="mt-1 text-sm font-semibold text-slate-700">
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

            {/* Note */}
            <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex gap-3">
                <span className="text-xl">ℹ️</span>
                <div>
                  <h3 className="font-semibold text-slate-900">Queue handling</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    If a citizen does not arrive after their token is called, use
                    Skip Token. Use Recall to call the current token again.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
