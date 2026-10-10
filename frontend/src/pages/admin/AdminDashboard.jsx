
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock3,
  FileText,
  Monitor,
  Users,
  Ticket,
  UserRoundCog,
  Landmark,
  RefreshCw,
  CircleAlert,
  CalendarDays,
} from "lucide-react";

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
    description: "View and manage government office locations.",
    icon: Building2,
    path: "/admin/offices",
    number: "01",
  },
  {
    title: "Services",
    description: "Organize the services offered at each office.",
    icon: FileText,
    path: "/admin/services",
    number: "02",
  },
  {
    title: "Counters",
    description: "Configure counters for citizen assistance.",
    icon: Monitor,
    path: "/admin/counters",
    number: "03",
  },
  {
    title: "Staff",
    description: "Manage operators and their assignments.",
    icon: UserRoundCog,
    path: "/admin/staff",
    number: "04",
  },
  {
    title: "Analytics",
    description: "Review queue activity, totals and peak hours.",
    icon: ChartNoAxesCombined,
    path: "/admin/analytics",
    number: "05",
  },
];

const TOKEN_CARDS = [
  {
    key: "waitingTokens",
    label: "Waiting",
    description: "Awaiting assistance",
    icon: Clock3,
    color: "text-[#9A7220]",
    background: "bg-[#FBF3DA]",
  },
  {
    key: "calledTokens",
    label: "Called",
    description: "Ready at the counter",
    icon: RadioIcon,
    color: "text-[#81703F]",
    background: "bg-[#F5F0DF]",
  },
  {
    key: "servingTokens",
    label: "Serving",
    description: "Currently in progress",
    icon: Users,
    color: "text-[#64764C]",
    background: "bg-[#EEF1E5]",
  },
  {
    key: "completedTokens",
    label: "Completed",
    description: "Successfully served",
    icon: CheckCircle2,
    color: "text-[#65774D]",
    background: "bg-[#F0F3E9]",
  },
  {
    key: "skippedTokens",
    label: "Skipped",
    description: "Skipped in the queue",
    icon: ArrowDownRight,
    color: "text-[#A77A35]",
    background: "bg-[#F9F0E1]",
  },
  {
    key: "cancelledTokens",
    label: "Cancelled",
    description: "Cancelled tokens",
    icon: CircleAlert,
    color: "text-[#8C8980]",
    background: "bg-[#F1F0EB]",
  },
];

// A small icon component for the "Called" token card.
function RadioIcon(props) {
  return <Ticket {...props} />;
}

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
      <div className="min-h-screen bg-[#FAF9F5] px-4 py-6 font-sans text-[#292820] sm:px-6 sm:py-8 lg:px-10">

        {/* PAGE INTRODUCTION */}
        <section className="mx-auto max-w-[1500px]">
          <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#82754E]">
                <Landmark size={14} strokeWidth={1.7} />
                QueueLess Administration
              </div>

              <PageHeader
                title="Administration Dashboard"
                description="A clear overview of government offices, staff and citizen queue activity."
              />

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#89867B]">
                Manage public services with confidence. Monitor daily
                activity and keep every service moving smoothly.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start rounded-full bg-[#F1EBD8] px-4 py-2.5 lg:self-auto">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B6A05D] opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9A8345]" />
              </span>
              <span className="text-xs font-semibold text-[#76683E]">
                Administration overview
              </span>
            </div>
          </div>

          {/* TOP SUMMARY */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="relative overflow-hidden rounded-[22px] bg-[#F0EAD6] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#83754E]">
                    Government offices
                  </p>
                  <p className="mt-5 text-5xl font-semibold tracking-[-0.055em] text-[#332F23]">
                    {data ? data.offices.length : "—"}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#81775C]">
                    <CheckCircle2 size={14} />
                    Registered office locations
                  </div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-[#8A7743]">
                  <Building2 size={23} strokeWidth={1.6} />
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-12 -right-5 h-32 w-32 rounded-full bg-[#E3D8B4]/50" />
            </div>

            <div className="relative overflow-hidden rounded-[22px] bg-white p-6 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#888477]">
                    Staff and operators
                  </p>
                  <p className="mt-5 text-5xl font-semibold tracking-[-0.055em] text-[#302F28]">
                    {data ? data.staff.length : "—"}
                  </p>

                  {data && unassigned > 0 ? (
                    <p className="mt-4 flex items-center gap-2 text-xs text-[#A2783B]">
                      <CircleAlert size={14} />
                      {unassigned} unassigned operator(s)
                    </p>
                  ) : (
                    <p className="mt-4 flex items-center gap-2 text-xs text-[#7A8466]">
                      <CheckCircle2 size={14} />
                      {data ? "All staff assigned" : "Staff overview"}
                    </p>
                  )}
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4F0E3] text-[#8B7B4D]">
                  <Users size={23} strokeWidth={1.6} />
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[22px] bg-[#28271F] p-6 text-white sm:p-7 sm:col-span-2 xl:col-span-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D2C79E]">
                    Total queue tokens
                  </p>
                  <p className="mt-5 text-5xl font-semibold tracking-[-0.055em] text-[#F1DD79]">
                    {data ? data.queue.totalTokens : "—"}
                  </p>
                  <p className="mt-4 flex items-center gap-2 text-xs text-[#C7C3B4]">
                    <Ticket size={14} />
                    All queue token records
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#F1DD79]">
                  <Ticket size={23} strokeWidth={1.6} />
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-12 -right-4 h-32 w-32 rounded-full bg-[#F1DD79]/10" />
            </div>
          </div>

          {/* QUEUE SUMMARY */}
          <section className="mb-12">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#96865B]">
                  Current activity
                </p>

                <h2 className="text-2xl font-semibold tracking-tight text-[#302F28] sm:text-3xl">
                  Queue summary
                </h2>

                <p className="mt-2 text-sm text-[#89867B]">
                  A real-time overview of tokens by their current status.
                </p>
              </div>

              <Link
                to="/admin/analytics"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F0E7BD] px-5 py-3 text-xs font-semibold text-[#554A2C] transition-colors hover:bg-[#E8DCA2]"
              >
                View analytics
                <ArrowUpRight size={15} />
              </Link>
            </div>

            {loading && (
              <div className="rounded-[22px] bg-white p-6">
                <LoadingBlock label="Loading dashboard..." />
              </div>
            )}

            {!loading && error && (
              <div className="rounded-[22px] bg-white p-6">
                <ErrorBlock message={error} onRetry={load} />
              </div>
            )}

            {!loading && !error && data && (
              <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                {TOKEN_CARDS.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div
                      key={card.key}
                      className="group min-w-0 rounded-[20px] bg-white p-5 transition-colors hover:bg-[#FFFDF6]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.background} ${card.color}`}>
                          <Icon size={19} strokeWidth={1.7} />
                        </div>

                        <span className="text-[10px] font-medium uppercase tracking-wider text-[#B0AA9B]">
                          Tokens
                        </span>
                      </div>

                      <p className={`mt-6 text-4xl font-semibold tracking-tight ${card.color}`}>
                        {data.queue[card.key] ?? 0}
                      </p>

                      <h3 className="mt-2 text-sm font-semibold text-[#39382F]">
                        {card.label}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#989487]">
                        {card.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* MANAGEMENT OVERVIEW */}
          <section className="pb-8">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#96865B]">
                  Workspace
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[#302F28] sm:text-3xl">
                  Management overview
                </h2>
                <p className="mt-2 text-sm text-[#89867B]">
                  Everything you need to run QueueLess from one place.
                </p>
              </div>

              <span className="flex items-center gap-2 text-xs text-[#938D7D]">
                <CalendarDays size={15} />
                Administration workspace
              </span>
            </div>

            <div className="grid gap-x-7 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
              {QUICK_LINKS.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="group flex min-h-[150px] items-start gap-4 rounded-[20px] bg-white p-5 transition-colors hover:bg-[#FFFDF6] sm:p-6"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F5F0DF] text-[#877444] transition-colors group-hover:bg-[#F0E5B7]">
                      <Icon size={22} strokeWidth={1.6} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-[#302F28]">
                          {item.title}
                        </h3>

                        <span className="text-xs font-medium text-[#B4A77C]">
                          {item.number}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-[#89867B]">
                        {item.description}
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#82713E]">
                        Open section
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* FOOTER NOTE */}
          <div className="flex flex-col gap-3 border-t border-[#EAE6DA] py-6 text-xs text-[#989285] sm:flex-row sm:items-center sm:justify-between">
            <p>QueueLess · Digital queue management</p>

            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-[#817143] transition-colors hover:text-[#4F4529] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={loading ? "animate-spin" : ""}
              />
              Refresh dashboard
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
