
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import { getOffices, getMyActiveToken } from "../../services/citizenApi";

/* =========================================================
   Small Icons
========================================================= */

function BuildingIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 21h18" />
      <path d="M5 21V8l7-4 7 4v13" />
      <path d="M9 21v-4h6v4" />
      <path d="M8 10h1" />
      <path d="M12 10h1" />
      <path d="M16 10h1" />
      <path d="M8 13h1" />
      <path d="M12 13h1" />
      <path d="M16 13h1" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function TicketIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5V9a2 2 0 0 0 0 4v4.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5V13a2 2 0 0 0 0-4V6.5Z" />
      <path d="M9 8v1" />
      <path d="M9 12v1" />
      <path d="M9 16v1" />
    </svg>
  );
}

function ClockIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function UsersIcon({ className = "h-6 w-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 11a3 3 0 1 0 0-6" />
      <path d="M17 14.5a5.5 5.5 0 0 1 3.5 5" />
    </svg>
  );
}

function LocationIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/* =========================================================
   Citizen Home
========================================================= */

export default function CitizenHome({ user }) {
  const navigate = useNavigate();

  const [offices, setOffices] = useState([]);
  const [loadingOffices, setLoadingOffices] = useState(true);
  const [officesError, setOfficesError] = useState(null);

  const [activeTokenData, setActiveTokenData] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingOffices(true);
        setLoadingToken(true);

        const [officesRes, activeTokenRes] = await Promise.all([
          getOffices(),
          getMyActiveToken(),
        ]);

        if (officesRes.success) {
          setOffices(officesRes.offices || []);
        } else {
          setOfficesError(officesRes.message || "Failed to load offices");
        }

        if (activeTokenRes.success && activeTokenRes.token) {
          setActiveTokenData(activeTokenRes);
        } else {
          setActiveTokenData(null);
        }
      } catch (error) {
        console.error("Failed to load home data:", error);
        setOfficesError("Network error. Could not connect to server.");
      } finally {
        setLoadingOffices(false);
        setLoadingToken(false);
      }
    }

    loadData();
  }, []);

  const activeToken = activeTokenData?.token;
  const queuePosition = activeTokenData?.queuePosition;
  const estimatedWait = activeTokenData?.estimatedWaitTimeMinutes;

  const firstName = user?.name?.split(" ")?.[0] || "Citizen";

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900 selection:bg-amber-200 selection:text-[#15396B]">

      {/* System announcement */}
      <div className="border-b border-white/10 bg-[#15396B] px-4 py-2.5 text-sm text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="shrink-0 rounded-sm bg-[#F4B544] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#15396B]">
              LIVE PORTAL
            </span>
            <span className="hidden text-blue-100 sm:block">
              Real-time queue tracking across available service offices.
            </span>
            <span className="text-xs text-blue-100 sm:hidden">
              Queue tracking is active.
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/citizen")}
            className="hidden shrink-0 text-xs font-bold text-[#F4B544] transition hover:text-white sm:block"
          >
            Live status →
          </button>
        </div>
      </div>

      <CitizenNavbar user={user} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-100/70 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-[#F7F8FA]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">

            {/* Hero introduction */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 border border-blue-100 bg-blue-50 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#15396B]">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Citizen Service Portal
              </div>

              <p className="mt-7 text-sm font-semibold text-slate-500">
                Welcome back, <span className="text-[#15396B]">{firstName}</span>
              </p>

              <h1 className="mt-3 text-5xl font-black leading-[1.02] tracking-tight text-[#15396B] sm:text-6xl lg:text-7xl">
                Skip the queue.
                <br />
                <span className="relative inline-block">
                  Save your time.
                  <span className="absolute bottom-1 left-0 -z-0 h-2 w-full bg-[#F4B544]/60 sm:h-3" />
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Get a virtual token before visiting a government office.
                Track your queue position and know approximately when
                your turn will arrive.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    const section = document.getElementById("government-offices");
                    section?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#15396B] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-950/10 transition hover:-translate-y-0.5 hover:bg-[#102D55] focus:outline-none focus:ring-2 focus:ring-[#15396B]/30"
                >
                  Get a Token
                  <ArrowRightIcon className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/citizen/how-it-works")}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-7 py-4 text-sm font-bold text-[#15396B] transition hover:border-[#15396B] hover:bg-blue-50"
                >
                  How it works
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-slate-200 pt-6 text-sm font-semibold text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-800">✓</span>
                  Less waiting
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-800">✓</span>
                  Live queue status
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-800">✓</span>
                  Simple and convenient
                </span>
              </div>
            </div>

            {/* Active token preview */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-[#15396B]/5 blur-xl" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
                <div className="h-1.5 bg-[#F4B544]" />

                <div className="p-5 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#15396B]">
                        <BuildingIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Current Queue
                        </p>
                        <p className="mt-1 max-w-[220px] truncate text-base font-extrabold text-[#15396B] sm:text-lg">
                          {activeToken?.officeId?.name || "Government Service"}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  </div>

                  {loadingToken ? (
                    <div className="mt-7 rounded-xl border border-slate-100 bg-[#F7F8FA] p-10 text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#15396B]/20 border-t-[#15396B]" />
                      <p className="mt-3 text-sm font-medium text-slate-500">
                        Checking your queue...
                      </p>
                    </div>
                  ) : activeToken ? (
                    <>
                      <div className="mt-7 rounded-xl border border-slate-200 bg-[#F7F8FA] px-5 py-7 text-center">
                        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-500">
                          Your Token
                        </p>
                        <p className="mt-2 break-words text-6xl font-black tracking-tight text-[#15396B] sm:text-7xl">
                          {activeToken.tokenNumber}
                        </p>
                        <span className="mt-4 inline-flex rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-800">
                          {activeToken.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
                          <div className="flex items-center gap-2 text-slate-500">
                            <UsersIcon className="h-4 w-4" />
                            <p className="text-xs font-semibold">People ahead</p>
                          </div>
                          <p className="mt-3 text-3xl font-black text-[#15396B]">
                            {queuePosition ? Math.max(queuePosition - 1, 0) : "—"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 p-4 sm:p-5">
                          <div className="flex items-center gap-2 text-slate-500">
                            <ClockIcon className="h-4 w-4" />
                            <p className="text-xs font-semibold">Estimated wait</p>
                          </div>
                          <p className="mt-3 text-3xl font-black text-[#15396B]">
                            {estimatedWait !== null && estimatedWait !== undefined
                              ? estimatedWait
                              : "—"}
                            {estimatedWait !== null && estimatedWait !== undefined && (
                              <span className="ml-1 text-sm font-bold text-slate-500">min</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full w-2/5 rounded-full bg-[#F4B544]" />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Queue information available
                          </p>
                          <button
                            type="button"
                            onClick={() => navigate(`/citizen/token/${activeToken._id}`)}
                            className="inline-flex items-center gap-1 text-sm font-extrabold text-[#15396B] transition hover:text-amber-700"
                          >
                            View token <ArrowRightIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="mt-7 rounded-xl border border-dashed border-slate-300 bg-[#F7F8FA] p-7 text-center sm:p-8">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                        <TicketIcon className="h-7 w-7" />
                      </div>
                      <h3 className="mt-4 text-lg font-extrabold text-[#15396B]">
                        No active token
                      </h3>
                      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                        Choose a government office and get a virtual token
                        without waiting in line.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          document.getElementById("government-offices")?.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#15396B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102D55]"
                      >
                        Find an Office <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main content */}
      <main id="government-offices" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Government offices */}
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-700">
                DIGITAL GOVERNMENT SERVICES
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-[#15396B] sm:text-4xl">
                Where do you need to go?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Select a government office to view available services
                and join its virtual queue.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Services available
            </div>
          </div>

          {officesError && (
            <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white font-black text-red-600">
                  !
                </div>
                <div>
                  <p className="font-bold text-red-800">Unable to load offices</p>
                  <p className="mt-1 text-sm leading-6 text-red-700">{officesError}</p>
                </div>
              </div>
            </div>
          )}

          {loadingOffices && !officesError && (
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {[1, 2].map((item) => (
                <div key={item} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="h-14 w-14 rounded-xl bg-slate-200" />
                  <div className="mt-6 h-6 w-2/3 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                  <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
                  <div className="mt-7 h-10 w-32 rounded-lg bg-slate-200" />
                </div>
              ))}
            </div>
          )}

          {!loadingOffices && !officesError && offices.length === 0 && (
            <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-[#15396B]">
                <BuildingIcon className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-[#15396B]">
                No offices available
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                There are currently no government offices available for
                virtual queue services.
              </p>
            </div>
          )}

          {!loadingOffices && !officesError && offices.length > 0 && (
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              {offices.map((office) => {
                const isRevenue = office.type === "REVENUE";

                return (
                  <button
                    key={office._id}
                    type="button"
                    onClick={() => navigate(`/citizen/offices/${office._id}/services`)}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5 focus:outline-none focus:ring-2 focus:ring-[#15396B]/30"
                  >
                    <div className={`h-1.5 w-full ${isRevenue ? "bg-[#F4B544]" : "bg-[#15396B]"}`} />

                    <div className="p-6 sm:p-7">
                      <div className="flex items-start justify-between">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${isRevenue ? "bg-amber-50 text-amber-800" : "bg-blue-50 text-[#15396B]"}`}>
                          <BuildingIcon className="h-7 w-7" />
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-[#15396B] group-hover:bg-blue-50 group-hover:text-[#15396B]">
                          <ArrowRightIcon className="h-5 w-5 transition group-hover:translate-x-0.5" />
                        </div>
                      </div>

                      <div className="mt-6">
                        <span className="inline-flex border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                          Digital Queue
                        </span>

                        <h3 className="mt-3 text-2xl font-black tracking-tight text-[#15396B]">
                          {office.name}
                        </h3>

                        {office.description && (
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                            {office.description}
                          </p>
                        )}

                        {(office.mandal || office.district || office.state) && (
                          <div className="mt-4 flex items-start gap-2 text-sm text-slate-500">
                            <LocationIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                            <span>
                              {[office.mandal, office.district, office.state]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                        <span className="text-sm font-extrabold text-[#15396B]">
                          View available services
                        </span>
                        <ArrowRightIcon className="h-4 w-4 text-amber-700 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Active token */}
        <section className="mt-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-700">
              YOUR QUEUE
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#15396B] sm:text-3xl">
              Your active token
            </h2>
          </div>

          {loadingToken ? (
            <div className="mt-6 animate-pulse rounded-2xl border border-slate-200 bg-white p-7">
              <div className="h-7 w-40 rounded bg-slate-200" />
              <div className="mt-4 h-5 w-72 max-w-full rounded bg-slate-100" />
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="h-24 rounded-xl bg-slate-100" />
                <div className="h-24 rounded-xl bg-slate-100" />
              </div>
            </div>
          ) : activeToken ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-1.5 bg-[#F4B544]" />

              <div className="bg-[#15396B] px-6 py-7 text-white sm:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <span className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold">
                      <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
                      {activeToken.status}
                    </span>

                    <h3 className="mt-4 break-words text-4xl font-black tracking-tight sm:text-5xl">
                      {activeToken.tokenNumber}
                    </h3>

                    <p className="mt-2 text-sm text-blue-100">
                      {activeToken.officeId?.name}{" "}
                      {activeToken.serviceId?.name ? `• ${activeToken.serviceId.name}` : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/citizen/token/${activeToken._id}`)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F4B544] px-5 py-3.5 text-sm font-extrabold text-[#15396B] transition hover:bg-amber-300"
                  >
                    Track My Token
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
                <div className="rounded-xl border border-slate-200 bg-[#F7F8FA] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-[#15396B]">
                      <UsersIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Queue position</p>
                      <p className="mt-1 text-2xl font-black text-[#15396B]">
                        {queuePosition ? `#${queuePosition}` : "In Progress"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#F7F8FA] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                      <ClockIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Estimated waiting time</p>
                      <p className="mt-1 text-2xl font-black text-[#15396B]">
                        {estimatedWait !== null && estimatedWait !== undefined
                          ? `${estimatedWait} min`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-6 sm:px-7">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#F4B544] transition-all duration-700"
                    style={{
                      width:
                        queuePosition && queuePosition > 0
                          ? `${Math.max(15, Math.min(100, 100 - queuePosition * 8))}%`
                          : "75%",
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>Joined queue</span>
                  <span className="font-bold text-[#15396B]">Live queue tracking</span>
                  <span>Your turn</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-1.5 bg-[#F4B544]" />
              <div className="grid items-center gap-6 p-7 sm:p-9 lg:grid-cols-[auto_1fr_auto]">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
                  <TicketIcon className="h-8 w-8" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-[#15396B]">
                    No active token right now
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Choose a government office above, select a service, and get
                    your virtual token without standing in a physical queue.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("government-offices")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#15396B] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#102D55]"
                >
                  Get a Token <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Benefits */}
        <section className="mt-16">
          <div className="mb-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-700">
              SIMPLE. CONVENIENT. ACCESSIBLE.
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#15396B] sm:text-3xl">
              A better way to access services
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
                <TicketIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-extrabold text-[#15396B]">Get a virtual token</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Join a government service queue remotely before arriving at the office.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#15396B]">
                <ClockIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-extrabold text-[#15396B]">Track your waiting time</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                See your queue position and estimated waiting time in one place.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <UsersIcon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-extrabold text-[#15396B]">Spend less time waiting</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Arrive closer to your turn instead of spending unnecessary time in a queue.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            <span className="font-extrabold tracking-wide text-[#15396B]">QUEUELESS</span>
            {" "}· Digital queue management
          </p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Queue services at your convenience
          </div>
        </div>
      </footer>
    </div>
  );
}
