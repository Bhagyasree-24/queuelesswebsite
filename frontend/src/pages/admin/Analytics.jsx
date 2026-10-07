import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const navigate = useNavigate();

  const officeStats = [
    {
      office: "RTO Office",
      tokens: 48,
      completed: 42,
      skipped: 3,
      averageWait: "18 min",
    },
    {
      office: "Municipal Office",
      tokens: 44,
      completed: 44,
      skipped: 2,
      averageWait: "16 min",
    },
  ];

  const serviceStats = [
    {
      service: "Driving License",
      tokens: 28,
      averageWait: "20 min",
      averageService: "10 min",
    },
    {
      service: "Vehicle Registration",
      tokens: 12,
      averageWait: "22 min",
      averageService: "15 min",
    },
    {
      service: "Document Verification",
      tokens: 8,
      averageWait: "10 min",
      averageService: "5 min",
    },
    {
      service: "Birth Certificate",
      tokens: 16,
      averageWait: "14 min",
      averageService: "8 min",
    },
    {
      service: "Property Tax",
      tokens: 18,
      averageWait: "19 min",
      averageService: "12 min",
    },
    {
      service: "Water Connection",
      tokens: 10,
      averageWait: "15 min",
      averageService: "10 min",
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
            onClick={() => navigate("/admin")}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Analytics
          </h1>

          <p className="mt-2 text-slate-600">
            Monitor queue performance and service activity across offices.
          </p>
        </section>

        {/* Overview */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Tokens Today</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">92</p>
            <p className="mt-2 text-xs text-green-600">
              +12% from yesterday
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-green-600">86</p>
            <p className="mt-2 text-xs text-slate-500">
              93% completion rate
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Average Wait</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">17 min</p>
            <p className="mt-2 text-xs text-slate-500">
              Across all services
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Skipped Tokens</p>
            <p className="mt-2 text-3xl font-bold text-orange-500">5</p>
            <p className="mt-2 text-xs text-slate-500">
              5% of total tokens
            </p>
          </div>
        </section>

        {/* Activity Overview */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Token Activity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Today's Token Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Tokens processed throughout the day
            </p>

            <div className="mt-6 flex h-48 items-end justify-between gap-3">
              {[
                { time: "9 AM", value: 8 },
                { time: "10 AM", value: 14 },
                { time: "11 AM", value: 20 },
                { time: "12 PM", value: 17 },
                { time: "1 PM", value: 12 },
                { time: "2 PM", value: 10 },
                { time: "3 PM", value: 7 },
                { time: "4 PM", value: 4 },
              ].map((item) => (
                <div
                  key={item.time}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-medium text-slate-500">
                    {item.value}
                  </span>

                  <div
                    className="w-full max-w-8 rounded-t-lg bg-gradient-to-t from-blue-600 to-purple-500"
                    style={{
                      height: `${(item.value / 20) * 100}%`,
                    }}
                  />

                  <span className="text-[10px] text-slate-400 sm:text-xs">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Queue Performance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Queue Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current system performance
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Completion Rate
                  </span>
                  <span className="font-semibold text-slate-900">
                    93%
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-[93%] rounded-full bg-green-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Counter Utilization
                  </span>
                  <span className="font-semibold text-slate-900">
                    75%
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-3/4 rounded-full bg-blue-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    On-time Service
                  </span>
                  <span className="font-semibold text-slate-900">
                    82%
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-[82%] rounded-full bg-purple-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Skipped Rate
                  </span>
                  <span className="font-semibold text-slate-900">
                    5%
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-[5%] rounded-full bg-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Analytics */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Office Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Compare queue performance between government offices.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Office
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Tokens
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Completed
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Skipped
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Avg. Wait
                  </th>
                </tr>
              </thead>

              <tbody>
                {officeStats.map((office) => (
                  <tr
                    key={office.office}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {office.office}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {office.tokens}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-green-600">
                      {office.completed}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-orange-600">
                      {office.skipped}
                    </td>

                    <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                      {office.averageWait}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Service Analytics */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Service Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Waiting and service times by service.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Service
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Tokens
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Avg. Wait
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-600">
                    Avg. Service
                  </th>
                </tr>
              </thead>

              <tbody>
                {serviceStats.map((service) => (
                  <tr
                    key={service.service}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {service.service}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {service.tokens}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-blue-600">
                      {service.averageWait}
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-slate-700">
                      {service.averageService}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Note */}
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-3">
            <span className="text-xl">ℹ️</span>

            <div>
              <h3 className="font-semibold text-slate-900">
                Analytics
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                These metrics will later be calculated from actual token,
                counter, and service activity. For now, this page uses sample
                data for the frontend.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}