import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  EmptyState,
  ErrorBlock,
  LoadingBlock,
  PageHeader,
  StatusBadge,
} from "../../components/admin/AdminUi";
import { getOfficeCounters, getOffices } from "../../services/adminApi";

export default function Offices({ user, setUser }) {
  const [offices, setOffices] = useState([]);
  // counters keyed by office id: { counters: [...] } or { error: "..." }
  const [countersByOffice, setCountersByOffice] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const list = await getOffices();
      setOffices(list);

      const results = await Promise.allSettled(
        list.map((office) => getOfficeCounters(office._id))
      );

      const map = {};
      list.forEach((office, index) => {
        const result = results[index];
        map[office._id] =
          result.status === "fulfilled"
            ? { counters: result.value }
            : { error: result.reason?.message || "Could not load counters" };
      });
      setCountersByOffice(map);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminLayout user={user} setUser={setUser}>
      <PageHeader
        title="Offices"
        description="Government offices configured in QueueLess. Offices are set up in the system and cannot be added or edited here."
      />

      <div className="mt-8">
        {loading && <LoadingBlock label="Loading offices..." />}
        {!loading && error && <ErrorBlock message={error} onRetry={load} />}

        {!loading && !error && offices.length === 0 && (
          <EmptyState
            icon="🏛️"
            title="No offices found"
            description="The backend did not return any offices."
          />
        )}

        {!loading && !error && offices.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {offices.map((office) => {
              const entry = countersByOffice[office._id] || {};
              const counters = entry.counters || [];

              return (
                <article
                  key={office._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-xl">
                      🏛️
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{office.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {[office.code, office.type].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-slate-700">
                      Counters{entry.counters ? ` (${counters.length})` : ""}
                    </h3>

                    {entry.error && (
                      <p className="mt-2 text-sm text-red-600">{entry.error}</p>
                    )}

                    {entry.counters && counters.length === 0 && (
                      <p className="mt-2 text-sm text-slate-500">
                        No counters have been created for this office yet.
                      </p>
                    )}

                    {counters.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {counters.map((counter) => (
                          <li
                            key={counter._id}
                            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {counter.name}
                              </p>
                              {counter.currentTokenId && (
                                <p className="text-xs text-slate-500">
                                  Token {counter.currentTokenId.tokenNumber} ·{" "}
                                  {counter.currentTokenId.status}
                                </p>
                              )}
                            </div>
                            <StatusBadge status={counter.status} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={`/admin/services?office=${office._id}`}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      View services
                    </Link>
                    <Link
                      to={`/admin/counters?office=${office._id}`}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Manage counters
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
