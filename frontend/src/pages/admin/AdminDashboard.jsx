import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Government Offices",
      value: "2",
      description: "Active offices",
      icon: "🏛️",
    },
    {
      label: "Services",
      value: "6",
      description: "Available services",
      icon: "📋",
    },
    {
      label: "Counters",
      value: "8",
      description: "Total counters",
      icon: "🖥️",
    },
    {
      label: "Staff",
      value: "12",
      description: "Registered operators",
      icon: "👥",
    },
  ];

  const quickActions = [
    {
      title: "Manage Offices",
      description: "View and manage government offices",
      icon: "🏛️",
      path: "/admin/offices",
    },
    {
      title: "Manage Services",
      description: "Configure available services",
      icon: "📋",
      path: "/admin/services",
    },
    {
      title: "Manage Counters",
      description: "Manage counters and assignments",
      icon: "🖥️",
      path: "/admin/counters",
    },
    {
      title: "Manage Staff",
      description: "Manage operators and assignments",
      icon: "👥",
      path: "/admin/staff",
    },
    {
      title: "View Analytics",
      description: "Monitor queue performance",
      icon: "📊",
      path: "/admin/analytics",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-slate-900">Queue</span>
            <span className="text-blue-600">Less</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 font-semibold text-blue-600">
              A
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-900">
                Administrator
              </p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>

            <span className="text-xs text-slate-400">▼</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Admin Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Administration Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-slate-600">
            Manage offices, services, counters, staff, and monitor the
            QueueLess system.
          </p>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-xl">
                  {stat.icon}
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {stat.description}
              </p>
            </div>
          ))}
        </section>

        {/* System Status */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                System Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current QueueLess system overview
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-700">
                All Systems Operational
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Active Tokens</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                18
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Active Counters</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                6
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Completed Today</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                86
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Administration
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage the different parts of the QueueLess system.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <button
                key={action.title}
                type="button"
                onClick={() => navigate(action.path)}
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-xl">
                    {action.icon}
                  </div>

                  <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Today's Activity */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Today's Activity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Overall queue activity across offices
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/analytics")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View analytics →
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Tokens Served
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                86
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Across all active offices
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Average Waiting Time
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                18 min
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Current system average
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}