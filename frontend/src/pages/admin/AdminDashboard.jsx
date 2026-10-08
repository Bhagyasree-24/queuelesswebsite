import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  ErrorBlock,
  LoadingBlock,
  PageHeader,
} from "../../components/admin/AdminUi";
import {
  getOffices,
  getQueueAnalytics,
  getStaff,
} from "../../services/adminApi";

const QUICK_LINKS = [
  {
    title: "Offices",
    description: "View configured government offices",
    icon: "🏛️",
    path: "/admin/offices",
  },
  {
    title: "Services",
    description: "Create and manage services per office",
    icon: "📋",
    path: "/admin/services",
  },
  {
    title: "Counters",
    description: "Create and manage service counters",
    icon: "🖥️",
    path: "/admin/counters",
  },
  {
    title: "Staff",
    description: "Manage operators and their assignments",
    icon: "👥",
    path: "/admin/staff",
  },
  {
    title: "Analytics",
    description: "Queue totals and peak hours",
    icon: "📊",
    path: "/admin/analytics",
  },
];

const TOKEN_CARDS = [
  {
    key: "waitingTokens",
    label: "Waiting",
    color: "text-blue-600",
  },
  {
    key: "calledTokens",
    label: "Called",
    color: "text-purple-600",
  },
  {
    key: "servingTokens",
    label: "Serving",
    color: "text-indigo-600",
  },
  {
    key: "completedTokens",
    label: "Completed",
    color: "text-green-600",
  },
  {
    key: "skippedTokens",
    label: "Skipped",
    color: "text-orange-500",
  },
  {
    key: "cancelledTokens",
    label: "Cancelled",
    color: "text-slate-500",
  },
];

export default function AdminDashboard({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [offices, staff, queue] = await Promise.all([
        getOffices(),
        getStaff(),
        getQueueAnalytics(),
      ]);

      setData({
        offices,
        staff,
        queue,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unassigned = data
    ? data.staff.filter(
        (staffMember) =>
          !staffMember.officeId || !staffMember.counterId
      ).length
    : 0;

  return (
    <AdminLayout user={user}>
      <PageHeader
        title="Administration Dashboard"
        description="Overview of offices, operators and queue activity across QueueLess."
      />

      <div className="mt-8 space-y-8">
        {loading && <LoadingBlock label="Loading dashboard..." />}

        {!loading && error && (
          <ErrorBlock
            message={error}
            onRetry={load}
          />
        )}

        {!loading && !error && data && (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Government Offices
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {data.offices.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Operators
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {data.staff.length}
                </p>

                {unassigned > 0 && (
                  <p className="mt-2 text-xs text-amber-600">
                    {unassigned} without an office/counter assignment
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-purple-50 p-5 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                  Total Tokens
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {data.queue.totalTokens}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  All token records
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Queue Summary
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Tokens by current status
                  </p>
                </div>

                <Link
                  to="/admin/analytics"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View analytics →
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {TOKEN_CARDS.map((card) => (
                  <div
                    key={card.key}
                    className="rounded-xl bg-slate-50 p-4"
                  >
                    <p className="text-sm text-slate-500">
                      {card.label}
                    </p>

                    <p
                      className={`mt-2 text-2xl font-bold ${card.color}`}
                    >
                      {data.queue[card.key] ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Manage
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-xl">
                        {link.icon}
                      </div>

                      <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                        →
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      {link.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {link.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  );
}