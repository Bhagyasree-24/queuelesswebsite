import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  EmptyState,
  ErrorBlock,
  LoadingBlock,
  PageHeader,
  inputClass,
  labelClass,
  secondaryBtn,
} from "../../components/admin/AdminUi";
import {
  getOfficePeakHours,
  getOffices,
  getPeakHours,
  getQueueAnalytics,
} from "../../services/adminApi";

const STATUS_CARDS = [
  { key: "waitingTokens", label: "Waiting", text: "text-blue-600", bar: "bg-blue-500" },
  { key: "calledTokens", label: "Called", text: "text-purple-600", bar: "bg-purple-500" },
  { key: "servingTokens", label: "Serving", text: "text-indigo-600", bar: "bg-indigo-500" },
  { key: "completedTokens", label: "Completed", text: "text-green-600", bar: "bg-green-500" },
  { key: "skippedTokens", label: "Skipped", text: "text-orange-500", bar: "bg-orange-500" },
  { key: "cancelledTokens", label: "Cancelled", text: "text-slate-500", bar: "bg-slate-400" },
];

const hourLabel = (hour) => `${String(hour).padStart(2, "0")}:00`;

// Bar chart of { hour, tokenCount } rows, shown in hour order.
function PeakChart({ peakHours }) {
  if (peakHours.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        No token activity recorded yet.
      </p>
    );
  }

  const byHour = [...peakHours].sort((a, b) => a.hour - b.hour);
  const max = Math.max(...byHour.map((row) => row.tokenCount), 1);
  const busiest = [...peakHours].sort((a, b) => b.tokenCount - a.tokenCount)[0];

  return (
    <div>
      <p className="text-sm text-slate-600">
        Busiest hour:{" "}
        <span className="font-semibold text-slate-900">{hourLabel(busiest.hour)}</span>{" "}
        ({busiest.tokenCount} {busiest.tokenCount === 1 ? "token" : "tokens"})
      </p>

      <div className="mt-6 overflow-x-auto">
        <div className="flex h-52 min-w-max items-end gap-3">
          {byHour.map((row) => (
            <div key={row.hour} className="flex h-full w-12 flex-col items-center justify-end gap-2">
              <span className="text-xs font-medium text-slate-500">{row.tokenCount}</span>
              <div
                className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-blue-600 to-purple-500"
                style={{ height: `${(row.tokenCount / max) * 100}%`, minHeight: "4px" }}
                title={`${hourLabel(row.hour)}: ${row.tokenCount} tokens`}
              />
              <span className="text-[10px] text-slate-400 sm:text-xs">{hourLabel(row.hour)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Analytics({ user, setUser }) {
  const [data, setData] = useState(null); // { queue, peakHours, offices }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [officeId, setOfficeId] = useState("");
  const [officeData, setOfficeData] = useState(null); // { office, peakHours }
  const [officeLoading, setOfficeLoading] = useState(false);
  const [officeError, setOfficeError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [queue, peakHours, offices] = await Promise.all([
        getQueueAnalytics(),
        getPeakHours(),
        getOffices(),
      ]);
      setData({ queue, peakHours, offices });
      setOfficeId((current) => current || offices[0]?._id || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!officeId) return;

    let cancelled = false;
    setOfficeLoading(true);
    setOfficeError("");

    getOfficePeakHours(officeId)
      .then((result) => {
        if (!cancelled) setOfficeData(result);
      })
      .catch((err) => {
        if (!cancelled) {
          setOfficeData(null);
          setOfficeError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setOfficeLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [officeId]);

  const queue = data?.queue;

  return (
    <AdminLayout user={user} setUser={setUser}>
      <PageHeader
        title="Analytics"
        description="Token totals by status and peak hours, calculated from actual token records."
        action={
          !loading && (
            <button type="button" onClick={load} className={secondaryBtn}>
              Refresh
            </button>
          )
        }
      />

      <div className="mt-8 space-y-8">
        {loading && <LoadingBlock label="Loading analytics..." />}
        {!loading && error && <ErrorBlock message={error} onRetry={load} />}

        {!loading && !error && data && (
          <>
            {/* Queue totals */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Queue Totals</h2>
                  <p className="mt-1 text-sm text-slate-500">All token records across all offices</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total tokens</p>
                  <p className="text-3xl font-bold text-slate-900">{queue.totalTokens}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {STATUS_CARDS.map((card) => (
                  <div key={card.key} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{card.label}</p>
                    <p className={`mt-2 text-2xl font-bold ${card.text}`}>{queue[card.key] ?? 0}</p>
                  </div>
                ))}
              </div>

              {queue.totalTokens > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-slate-700">Distribution</p>
                  <div
                    className="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-100"
                    role="img"
                    aria-label="Token status distribution"
                  >
                    {STATUS_CARDS.map((card) => (
                      <div
                        key={card.key}
                        className={card.bar}
                        style={{ width: `${((queue[card.key] ?? 0) / queue.totalTokens) * 100}%` }}
                        title={`${card.label}: ${queue[card.key] ?? 0}`}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                    {STATUS_CARDS.map((card) => (
                      <span key={card.key} className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${card.bar}`} />
                        {card.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Overall peak hours */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Peak Hours — All Offices</h2>
              <p className="mt-1 text-sm text-slate-500">
                Tokens created per hour of the day, as reported by the server.
              </p>
              <div className="mt-6">
                <PeakChart peakHours={data.peakHours} />
              </div>
            </section>

            {/* Office peak hours */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Peak Hours by Office</h2>
                  <p className="mt-1 text-sm text-slate-500">Select an office to see its busiest hours.</p>
                </div>

                {data.offices.length > 0 && (
                  <div className="w-full sm:w-72">
                    <label htmlFor="analyticsOffice" className={labelClass}>Government office</label>
                    <select
                      id="analyticsOffice"
                      value={officeId}
                      onChange={(e) => setOfficeId(e.target.value)}
                      className={inputClass}
                    >
                      {data.offices.map((office) => (
                        <option key={office._id} value={office._id}>{office.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {data.offices.length === 0 && (
                  <EmptyState icon="🏛️" title="No offices found" />
                )}
                {officeLoading && <LoadingBlock label="Loading office peak hours..." />}
                {!officeLoading && officeError && <ErrorBlock message={officeError} />}
                {!officeLoading && !officeError && officeData && (
                  <>
                    <p className="mb-4 text-sm font-semibold text-slate-700">
                      {officeData.office?.name}
                    </p>
                    <PeakChart peakHours={officeData.peakHours} />
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
