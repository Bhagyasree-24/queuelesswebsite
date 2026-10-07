import { useNavigate, useParams } from "react-router-dom";

export default function QueuePreview() {
  const navigate = useNavigate();
  const { officeId, serviceId } = useParams();

  // Temporary data.
  // Later this will come from:
  // GET /api/offices/:officeId/services/:serviceId/queue

  const office = {
    name: "RTO Office",
    icon: "🚗",
  };

  const service = {
    name: "Driving License",
    averageServiceTime: 10,
  };

  const queue = {
    peopleWaiting: 8,
    activeCounters: 3,
    currentServingToken: "A-16",
    estimatedWaitTime: 20,
  };

  const handleGenerateToken = () => {
    // temporary token creation
    const tokenId = "demo-token";

    navigate(`/citizen/token/${tokenId}`);
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
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate(`/citizen/offices/${officeId}/services`)
          }
          className="mb-8 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          ← Back to services
        </button>

        {/* Heading */}
        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-3xl">
            {office.icon}
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-blue-600">
            {office.name}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            {service.name}
          </h1>

          <p className="mt-3 text-slate-600">
            Check the current queue before taking your virtual token.
          </p>

        </div>

        {/* Queue Card */}
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Live status */}
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Current queue
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                {queue.peopleWaiting} people waiting
              </p>
            </div>

            <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Live
            </span>

          </div>

          {/* Main wait time */}
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-6 text-center">

            <p className="text-sm font-medium text-slate-500">
              Estimated waiting time
            </p>

            <p className="mt-2 text-5xl font-bold text-slate-900">
              {queue.estimatedWaitTime}
              <span className="ml-2 text-xl font-semibold text-slate-500">
                min
              </span>
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Approximate time based on current queue activity
            </p>

          </div>

          {/* Queue information */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                People waiting
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {queue.peopleWaiting}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Active counters
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {queue.activeCounters}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Currently serving
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {queue.currentServingToken}
              </p>
            </div>

          </div>

          {/* Service information */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">

            <div>
              <p className="text-sm text-slate-500">
                Average service time
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {service.averageServiceTime} minutes
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-500">
                Queue status
              </p>

              <p className="mt-1 font-semibold text-green-600">
                Moving normally
              </p>
            </div>

          </div>

          {/* Get Token */}
          <button
            type="button"
            onClick={handleGenerateToken}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Get Virtual Token
          </button>

          <p className="mt-3 text-center text-xs text-slate-500">
            You can track your position after joining the queue.
          </p>

        </div>

      </main>
    </div>
  );
}