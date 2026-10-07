import { useNavigate } from "react-router-dom";

export default function CounterControl() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/operator")}
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-slate-900">Queue</span>
            <span className="text-blue-600">Less</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/operator")}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Counter Management
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Counter Control
          </h1>

          <p className="mt-2 text-slate-600">
            Manage your assigned counter and serving status.
          </p>
        </section>

        {/* Current Counter */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-2xl">
                🖥️
              </div>

              <div>
                <p className="text-sm text-slate-500">Assigned Counter</p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Counter 1
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  RTO Office
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-sm font-semibold text-green-700">
                Active
              </span>
            </div>
          </div>
        </section>

        {/* Counter Status */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Counter Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Control whether your counter is available.
            </p>

            <div className="mt-6 rounded-xl bg-green-50 p-5">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-green-500" />

                <div>
                  <p className="font-semibold text-green-800">
                    Counter is Active
                  </p>

                  <p className="mt-1 text-sm text-green-700">
                    You are currently serving citizens.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="rounded-xl border border-orange-200 bg-orange-50 px-5 py-3 font-semibold text-orange-600 transition hover:bg-orange-100"
              >
                Pause Counter
              </button>

              <button
                type="button"
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-100"
              >
                Close Counter
              </button>
            </div>
          </div>

          {/* Assigned Service */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Assigned Service
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Service currently handled at this counter.
            </p>

            <div className="mt-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Current Service
              </p>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Driving License
              </h3>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Average service time
                </span>

                <span className="font-semibold text-blue-600">
                  ~10 min
                </span>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Change Service
            </button>
          </div>
        </section>

        {/* Counter Summary */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Today's Counter Summary
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Tokens Completed
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                42
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Tokens Skipped
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                3
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Avg. Service Time
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                10 min
              </p>
            </div>
          </div>
        </section>

        {/* Counter Selection */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Counter Assignment
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your current assigned counter is Counter 1.
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-100"
            >
              Request Counter Change
            </button>
          </div>
        </section>

        {/* Back to Queue */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate("/operator/queue")}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Queue Management
          </button>
        </div>
      </main>
    </div>
  );
}