import { useNavigate } from "react-router-dom";

export default function OperatorDashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      label: "People Waiting",
      value: "8",
      description: "Across active queues",
      icon: "👥",
    },
    {
      label: "Serving Now",
      value: "3",
      description: "Currently being served",
      icon: "🎟️",
    },
    {
      label: "Completed Today",
      value: "42",
      description: "Tokens completed",
      icon: "✓",
    },
    {
      label: "Avg. Service Time",
      value: "10 min",
      description: "Today's average",
      icon: "⏱️",
    },
  ];

  const currentToken = {
    tokenNumber: "A-16",
    citizen: "Citizen #1042",
    service: "Driving License",
    counter: "Counter 1",
    waiting: 8,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/operator")}
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-slate-900">Queue</span>
            <span className="text-blue-600">Less</span>
          </button>

          {/* Account */}
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 font-semibold text-blue-600">
              O
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-900">
                Operator
              </p>
              <p className="text-xs text-slate-500">Government Staff</p>
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
            Operator Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Good morning, Operator
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your assigned queue and keep citizens moving.
          </p>
        </section>

        {/* Office / Counter Info */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Assigned Office
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                RTO Office
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Counter 1 • Driving License Services
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-700">
                Counter Active
              </span>
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

        {/* Current Queue */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Current Token */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Current Token
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Token currently being served
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                SERVING
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Token Number
                  </p>

                  <p className="mt-1 text-5xl font-bold text-blue-600">
                    {currentToken.tokenNumber}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div>
                    <p className="text-slate-500">Citizen</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {currentToken.citizen}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Counter</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {currentToken.counter}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Service</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {currentToken.service}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Waiting</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {currentToken.waiting} people
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => navigate("/operator/queue")}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
              >
                Manage Queue
              </button>

              <button
                type="button"
                onClick={() => navigate("/operator/counter")}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Counter Control
              </button>

              <button
                type="button"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Complete Token
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your counter and queue
            </p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => navigate("/operator/queue")}
                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg">
                  🎟️
                </span>

                <div>
                  <p className="font-semibold text-slate-900">
                    View Queue
                  </p>
                  <p className="text-xs text-slate-500">
                    Manage waiting tokens
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate("/operator/counter")}
                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-lg">
                  🖥️
                </span>

                <div>
                  <p className="font-semibold text-slate-900">
                    Counter Control
                  </p>
                  <p className="text-xs text-slate-500">
                    Manage counter status
                  </p>
                </div>
              </button>

              <button
                type="button"
                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-lg">
                  ⏸️
                </span>

                <div>
                  <p className="font-semibold text-slate-900">
                    Pause Counter
                  </p>
                  <p className="text-xs text-slate-500">
                    Temporarily stop serving
                  </p>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* Queue Preview */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Queue Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current waiting tokens at your counter
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/operator/queue")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View full queue →
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="px-4 py-3 font-medium">Token</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Position</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["A-17", "Driving License", "1", "Waiting"],
                  ["A-18", "Driving License", "2", "Waiting"],
                  ["A-19", "Driving License", "3", "Waiting"],
                  ["A-20", "Driving License", "4", "Waiting"],
                ].map((row) => (
                  <tr
                    key={row[0]}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {row[0]}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row[1]}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-slate-700">
                      #{row[2]}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        {row[3]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}