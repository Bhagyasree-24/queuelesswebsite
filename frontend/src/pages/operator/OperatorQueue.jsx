import { useNavigate } from "react-router-dom";

export default function OperatorQueue() {
  const navigate = useNavigate();

  const currentToken = {
    tokenNumber: "A-16",
    citizen: "Citizen #1042",
    service: "Driving License",
    status: "CALLED",
  };

  const waitingTokens = [
    {
      tokenNumber: "A-17",
      service: "Driving License",
      waitingTime: "10 min",
      status: "WAITING",
    },
    {
      tokenNumber: "A-18",
      service: "Driving License",
      waitingTime: "20 min",
      status: "WAITING",
    },
    {
      tokenNumber: "A-19",
      service: "Vehicle Registration",
      waitingTime: "30 min",
      status: "WAITING",
    },
    {
      tokenNumber: "A-20",
      service: "Driving License",
      waitingTime: "40 min",
      status: "WAITING",
    },
  ];

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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
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

        {/* Counter Info */}
        <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Assigned Counter</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Counter 1
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              RTO Office • Driving License
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-green-700">
              Counter Active
            </span>
          </div>
        </section>

        {/* Current Token */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Current Token
              </p>

              <div className="mt-2 flex items-center gap-4">
                <h2 className="text-5xl font-bold text-slate-900">
                  {currentToken.tokenNumber}
                </h2>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  {currentToken.status}
                </span>
              </div>

              <div className="mt-4 space-y-1 text-sm text-slate-500">
                <p>
                  Citizen:{" "}
                  <span className="font-medium text-slate-700">
                    {currentToken.citizen}
                  </span>
                </p>

                <p>
                  Service:{" "}
                  <span className="font-medium text-slate-700">
                    {currentToken.service}
                  </span>
                </p>
              </div>
            </div>

            {/* Current Token Actions */}
            <div className="grid gap-3 sm:grid-cols-2 lg:w-96">
              <button
                type="button"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
              >
                Start Serving
              </button>

              <button
                type="button"
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-100"
              >
                Skip Token
              </button>

              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Complete
              </button>

              <button
                type="button"
                className="rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 font-semibold text-purple-600 transition hover:bg-purple-100"
              >
                Recall
              </button>
            </div>
          </div>
        </section>

        {/* Call Next */}
        <section className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-100">
                Next in Queue
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                A-17
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                Driving License • 1 person ahead
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Call Next
            </button>
          </div>
        </section>

        {/* Waiting Queue */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Waiting Queue
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {waitingTokens.length} tokens currently waiting
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {waitingTokens.map((token, index) => (
              <div
                key={token.tokenNumber}
                className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-500 shadow-sm">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      {token.tokenNumber}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {token.service}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      Estimated wait
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {token.waitingTime}
                    </p>
                  </div>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    {token.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Queue Actions Note */}
        <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-3">
            <span className="text-xl">ℹ️</span>

            <div>
              <h3 className="font-semibold text-slate-900">
                Queue handling
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                If a citizen does not arrive after their token is called,
                use Skip Token. A skipped token can be recalled when the
                citizen arrives.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}