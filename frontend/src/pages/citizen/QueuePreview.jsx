
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import {
  getQueueInfo,
  getOfficeById,
  getOfficeServices,
  createToken,
} from "../../services/citizenApi";

export default function QueuePreview({ user }) {
  const navigate = useNavigate();
  const { officeId, serviceId } = useParams();

  const [office, setOffice] = useState(null);
  const [service, setService] = useState(null);
  const [queueTokens, setQueueTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  /* API functionality - unchanged */

  useEffect(() => {
    async function loadQueuePreview() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const [officeRes, servicesRes, queueRes] = await Promise.all([
          getOfficeById(officeId),
          getOfficeServices(officeId),
          getQueueInfo(officeId, serviceId),
        ]);

        if (officeRes.success) {
          setOffice(officeRes.office);
        }

        if (servicesRes.success) {
          const selected = servicesRes.services.find(
            (s) => s._id.toString() === serviceId
          );

          setService(selected || null);
        }

        if (queueRes.success) {
          setQueueTokens(queueRes.queue || []);
        } else {
          setErrorMessage(
            queueRes.message || "Failed to fetch queue data"
          );
        }
      } catch (err) {
        console.error("Queue preview load error:", err);
        setErrorMessage(
          "Network error. Could not fetch queue information."
        );
      } finally {
        setLoading(false);
      }
    }

    if (officeId && serviceId) {
      loadQueuePreview();
    }
  }, [officeId, serviceId]);

  const peopleWaiting = queueTokens.filter(
    (t) => t.status === "WAITING"
  ).length;

  const currentServingToken =
    queueTokens.find(
      (t) => t.status === "SERVING" || t.status === "CALLED"
    )?.tokenNumber || "None";

  const avgTime = service?.averageServiceTime || 10;

  const estimatedWaitTime = Math.max(
    0,
    peopleWaiting * avgTime
  );

  const handleGenerateToken = async () => {
    try {
      setGenerating(true);
      setErrorMessage(null);

      const res = await createToken(officeId, serviceId);

      if (res.success && res.token?._id) {
        navigate(`/citizen/token/${res.token._id}`);
      } else {
        setErrorMessage(
          res.message || "Failed to generate token."
        );
      }
    } catch (err) {
      console.error("Token creation error:", err);
      setErrorMessage(
        "Error connecting to server to generate token."
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900">
      {/* NAVBAR */}
      <CitizenNavbar user={user} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#15396B]">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-200/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
          {/* Back button */}
          <button
            type="button"
            onClick={() =>
              navigate(`/citizen/offices/${officeId}/services`)
            }
            className="group mb-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-sm transition hover:border-amber-400/50 hover:bg-white/10 hover:text-amber-300"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back to services
          </button>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_430px]">
            {/* Hero text */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Official Digital Queue
              </div>

              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.12em] text-amber-300">
                {office?.name || "Government Office"}
              </p>

              <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Check the queue.
                <br />
                <span className="text-[#F4B544]">
                  Save your time.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                See the live queue before visiting the office.
                Get an estimate of your waiting time and join
                the virtual queue when you're ready.
              </p>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#F4B544]">✓</span>
                  Live queue status
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#F4B544]">✓</span>
                  Virtual token
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#F4B544]">✓</span>
                  Real-time tracking
                </div>
              </div>
            </div>

            {/* MINI QUEUE PREVIEW CARD */}
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 rounded-[2rem] bg-amber-400/10 blur-2xl" />

              <div className="relative rounded-[2rem] border border-white/30 bg-[#F7F8FA] p-5 shadow-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-xl">
                      🏛️
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Current Queue
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {service?.name || "Service Counter"}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Live
                  </span>
                </div>

                {/* Wait time */}
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-7 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Estimated Wait
                  </p>

                  <div className="mt-2">
                    <span className="text-5xl font-extrabold tracking-tight text-[#15396B]">
                      {estimatedWaitTime}
                    </span>
                    <span className="ml-2 text-lg font-semibold text-slate-500">
                      min
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">
                      People waiting
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#15396B]">
                      {peopleWaiting}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Serving now
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#15396B]">
                      {currentServingToken}
                    </p>
                  </div>
                </div>

                {/* Decorative queue indicator */}
                <div className="mt-5">
                  <div className="flex gap-2">
                    <span className="h-2 flex-1 rounded-full bg-[#15396B]" />
                    <span className="h-2 flex-1 rounded-full bg-[#315B8E]" />
                    <span className="h-2 flex-1 rounded-full bg-[#F4B544]" />
                    <span className="h-2 flex-1 rounded-full bg-slate-200" />
                    <span className="h-2 flex-1 rounded-full bg-slate-200" />
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#15396B]">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Queue is moving normally
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading */}
        {loading ? (
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#15396B] border-t-transparent" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#15396B]">
              Checking the live queue
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Getting the latest queue information...
            </p>
          </div>
        ) : (
          <>
            {/* Error */}
            {errorMessage && (
              <div className="mx-auto mb-6 max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                    !
                  </div>

                  <div>
                    <p className="font-semibold text-red-800">
                      Unable to load queue
                    </p>
                    <p className="mt-1 text-sm text-red-700">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN QUEUE SECTION */}
            <div className="mx-auto max-w-5xl">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                      📊
                    </span>
                    <p className="text-sm font-bold uppercase tracking-wider text-[#15396B]">
                      Live queue
                    </p>
                  </div>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#15396B] sm:text-3xl">
                    {service?.name || "Service Queue"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Current queue status for this government service
                  </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  Live
                </div>
              </div>

              {/* BIG QUEUE CARD */}
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
                <div className="h-1.5 bg-gradient-to-r from-[#15396B] via-[#315B8E] to-[#F4B544]" />

                <div className="p-5 sm:p-8">
                  {/* Main stats */}
                  <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                    {/* Estimated wait */}
                    <div className="relative overflow-hidden rounded-[1.5rem] bg-[#15396B] p-7 sm:p-9">
                      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/10 blur-2xl" />

                      <div className="relative">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-amber-200">
                              Estimated waiting time
                            </p>
                            <p className="mt-1 text-xs text-slate-300">
                              Based on the current queue
                            </p>
                          </div>

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                            ⏱
                          </div>
                        </div>

                        <div className="mt-8 flex items-end gap-3">
                          <span className="text-6xl font-extrabold tracking-tight text-white sm:text-7xl">
                            {estimatedWaitTime}
                          </span>
                          <span className="mb-2 text-lg font-semibold text-amber-200">
                            minutes
                          </span>
                        </div>

                        <div className="mt-7 flex items-center gap-2 text-sm font-medium text-slate-200">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          Queue is currently active
                        </div>
                      </div>
                    </div>

                    {/* People waiting */}
                    <div className="rounded-[1.5rem] border border-slate-200 bg-[#F7F8FA] p-7 sm:p-8">
                      <p className="text-sm font-semibold text-slate-500">
                        People waiting
                      </p>

                      <div className="mt-4 flex items-end justify-between">
                        <span className="text-5xl font-extrabold tracking-tight text-[#15396B]">
                          {peopleWaiting}
                        </span>
                        <span className="mb-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-[#15396B]">
                          In queue
                        </span>
                      </div>

                      <div className="mt-7 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#15396B] to-[#F4B544]"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(12, peopleWaiting * 6)
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        Current number of waiting tokens
                      </p>
                    </div>
                  </div>

                  {/* INFORMATION CARDS */}
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">
                          Currently serving
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm">
                          🎟️
                        </span>
                      </div>
                      <p className="mt-3 text-2xl font-bold text-[#15396B]">
                        {currentServingToken}
                      </p>
                    </div>

                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">
                          Service time
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-sm">
                          ⏱️
                        </span>
                      </div>
                      <p className="mt-3 text-2xl font-bold text-[#15396B]">
                        {avgTime}
                        <span className="ml-1 text-sm font-medium text-slate-400">
                          min
                        </span>
                      </p>
                    </div>

                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">
                          Queue status
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        </span>
                      </div>
                      <p className="mt-3 text-2xl font-bold text-emerald-600">
                        Active
                      </p>
                    </div>
                  </div>

                  {/* HOW IT WORKS */}
                  <div className="mt-7 rounded-2xl border border-slate-200 bg-[#F7F8FA] p-5">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-sm font-bold text-[#15396B]">
                          What happens next?
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Join remotely and monitor your position.
                        </p>
                      </div>

                      <div className="hidden h-px flex-1 bg-slate-200 sm:block" />

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-bold text-[#15396B] shadow-sm">
                            1
                          </span>
                          Get token
                        </div>

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-bold text-[#15396B] shadow-sm">
                            2
                          </span>
                          Track queue
                        </div>

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white font-bold text-[#15396B] shadow-sm">
                            3
                          </span>
                          Visit your counter
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CALL TO ACTION */}
                  <div className="mt-7 rounded-[1.5rem] bg-[#15396B] p-6 sm:p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-white">
                        <p className="text-lg font-bold">
                          Ready to skip the waiting room?
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          Get your virtual token and track your position
                          from anywhere.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateToken}
                        disabled={generating}
                        className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#F4B544] px-6 py-3.5 text-sm font-bold text-[#15396B] shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {generating
                          ? "Generating Token..."
                          : "Get Virtual Token"}

                        {!generating && (
                          <span className="transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-center text-xs text-slate-500">
                    Your token can be tracked in real time after joining
                    the queue.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <div className="h-10" />
    </div>
  );
}
