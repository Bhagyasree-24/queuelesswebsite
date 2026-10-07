import { useNavigate, useParams } from "react-router-dom";

export default function ActiveToken() {
  const navigate = useNavigate();
  const { tokenId } = useParams();

  // Temporary data.
  // Later this will come from:
  // GET /api/tokens/:tokenId

  const token = {
    tokenNumber: "A-24",
    status: "WAITING",
    peopleAhead: 8,
    estimatedWaitTime: 20,
    currentServingToken: "A-16",
    activeCounters: 3,
    officeName: "RTO Office",
    serviceName: "Driving License",
  };

  const handleCancel = () => {
    // Later:
    // PATCH /api/tokens/:tokenId/cancel
    console.log("Cancel token:", tokenId);
  };

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
            className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-slate-100 sm:gap-3 sm:px-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 font-semibold text-blue-600">
              N
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-900">
                Nithin Kumar
              </p>

              <p className="text-xs text-slate-500">
                Citizen
              </p>
            </div>
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/citizen")}
          className="mb-8 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          ← Back to home
        </button>

        {/* Heading */}
        <div className="text-center">

          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            You're in the queue
          </span>

          <h1 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">
            Your Virtual Token
          </h1>

          <p className="mt-2 text-slate-600">
            {token.officeName} · {token.serviceName}
          </p>

        </div>

        {/* Token Card */}
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Token number */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 py-8 text-center">

            <p className="text-sm font-medium text-slate-500">
              Token Number
            </p>

            <p className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-7xl font-bold tracking-tight text-transparent">
              {token.tokenNumber}
            </p>

            <span className="mt-4 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-sm">
              {token.status}
            </span>

          </div>

          {/* Main stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl bg-blue-50 p-5 text-center">
              <p className="text-sm text-slate-500">
                People ahead
              </p>

              <p className="mt-1 text-4xl font-bold text-slate-900">
                {token.peopleAhead}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                people waiting before you
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-5 text-center">
              <p className="text-sm text-slate-500">
                Estimated wait
              </p>

              <p className="mt-1 text-4xl font-bold text-slate-900">
                {token.estimatedWaitTime}
                <span className="ml-1 text-lg font-medium">
                  min
                </span>
              </p>

              <p className="mt-1 text-xs text-slate-500">
                approximate waiting time
              </p>
            </div>

          </div>

          {/* Queue information */}
          <div className="mt-6 rounded-2xl border border-slate-200 p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Currently serving
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {token.currentServingToken}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500">
                  Active counters
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {token.activeCounters}
                </p>
              </div>

            </div>

          </div>

          {/* Progress */}
          <div className="mt-6">

            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                Queue progress
              </span>

              <span className="text-slate-500">
                {token.peopleAhead} ahead
              </span>
            </div>

            <div className="mt-3 flex gap-1.5">
              <span className="h-2 flex-1 rounded-full bg-blue-600" />
              <span className="h-2 flex-1 rounded-full bg-blue-500" />
              <span className="h-2 flex-1 rounded-full bg-purple-500" />
              <span className="h-2 flex-1 rounded-full bg-slate-200" />
              <span className="h-2 flex-1 rounded-full bg-slate-200" />
            </div>

            <p className="mt-3 text-center text-xs text-slate-500">
              This information updates as the queue moves.
            </p>

          </div>

          {/* Cancel */}
          <button
            type="button"
            onClick={handleCancel}
            className="mt-8 w-full rounded-xl border border-red-200 bg-white px-6 py-3.5 font-semibold text-red-600 transition hover:bg-red-50"
          >
            Cancel Token
          </button>

        </div>

        {/* Notice */}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center text-sm text-blue-700">
          Please arrive at the office before your turn is called.
        </div>

      </main>
    </div>
  );
}