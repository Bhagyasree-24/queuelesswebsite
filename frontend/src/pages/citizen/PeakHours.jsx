import { useNavigate } from "react-router-dom";

export default function PeakHours() {
  const navigate = useNavigate();

  const hours = [
    {
      time: "9:00 AM – 10:00 AM",
      level: "Low",
      color: "green",
      people: 4,
    },
    {
      time: "10:00 AM – 11:00 AM",
      level: "Moderate",
      color: "yellow",
      people: 8,
    },
    {
      time: "11:00 AM – 1:00 PM",
      level: "High",
      color: "red",
      people: 16,
    },
    {
      time: "1:00 PM – 2:00 PM",
      level: "Moderate",
      color: "yellow",
      people: 9,
    },
    {
      time: "2:00 PM – 4:00 PM",
      level: "Low",
      color: "green",
      people: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/citizen")}
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-slate-900">Queue</span>
            <span className="text-blue-600">Less</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/citizen")}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page heading */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Crowd Information
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Best time to visit
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Check expected crowd levels and choose a time with a shorter
            waiting period.
          </p>
        </section>

        {/* Current status */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Current crowd level
              </p>

              <div className="mt-2 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Low Crowd
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Around 4 people currently waiting
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 px-6 py-4">
              <p className="text-sm text-slate-500">Estimated wait</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                ~10 min
              </p>
            </div>
          </div>
        </section>

        {/* Legend */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Crowd forecast
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <p className="font-semibold text-slate-900">Low</p>
                <p className="text-xs text-slate-500">Shorter wait</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <div>
                <p className="font-semibold text-slate-900">Moderate</p>
                <p className="text-xs text-slate-500">Average wait</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <div>
                <p className="font-semibold text-slate-900">High</p>
                <p className="text-xs text-slate-500">Longer wait</p>
              </div>
            </div>
          </div>
        </section>

        {/* Time slots */}
        <section className="mt-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Today's forecast
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Expected crowd throughout the day
                </p>
              </div>

              <span className="hidden rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 sm:block">
                Today
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {hours.map((hour) => (
                <div
                  key={hour.time}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`h-3 w-3 shrink-0 rounded-full ${
                        hour.color === "green"
                          ? "bg-green-500"
                          : hour.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />

                    <div>
                      <p className="font-semibold text-slate-900">
                        {hour.time}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Around {hour.people} people waiting
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      hour.color === "green"
                        ? "bg-green-100 text-green-700"
                        : hour.color === "yellow"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {hour.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendation */}
        <section className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg sm:p-8">
          <p className="text-sm font-semibold text-blue-100">
            Recommended
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Visit between 2:00 PM – 4:00 PM
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
            This period is expected to have fewer people waiting and shorter
            queue times.
          </p>

          <button
            type="button"
            onClick={() => navigate("/citizen")}
            className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Choose an office
          </button>
        </section>
      </main>
    </div>
  );
}