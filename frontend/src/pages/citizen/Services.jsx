
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import {
  getOfficeServices,
  getOfficeById,
} from "../../services/citizenApi";

export default function Services({ user }) {
  const navigate = useNavigate();
  const { officeId } = useParams();

  const [office, setOffice] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOfficeAndServices() {
      try {
        setLoading(true);
        setError(null);

        const [officeRes, servicesRes] = await Promise.all([
          getOfficeById(officeId),
          getOfficeServices(officeId),
        ]);

        if (officeRes.success) {
          setOffice(officeRes.office);
        }

        if (servicesRes.success) {
          setServices(servicesRes.services || []);
        } else {
          setError(servicesRes.message || "Failed to load services");
        }
      } catch (err) {
        console.error("Failed to load services:", err);
        setError("Could not load services for this office.");
      } finally {
        setLoading(false);
      }
    }

    if (officeId) {
      loadOfficeAndServices();
    }
  }, [officeId]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900">
      <CitizenNavbar user={user} />

      {/* OFFICIAL OFFICE HEADER */}
      <section className="relative overflow-hidden bg-[#15396B]">
        {/* Decorative background */}
        <div className="absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#F4B544]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />
        </div>

        {/* Subtle official grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
          {/* Back navigation */}
          <button
            type="button"
            onClick={() => navigate("/citizen")}
            className="mb-10 flex items-center gap-2 text-sm font-semibold text-blue-100 transition hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10">
              ←
            </span>
            Back to offices
          </button>

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            {/* Office information */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#F4B544]/40 bg-[#F4B544]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#FFD783]">
                <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
                Official Digital Service Portal
              </div>

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#F4B544]">
                {office?.name || "Government Office"}
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Government
                <span className="block text-[#F4B544]">
                  services made simpler.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                Access public services with ease. Check live queue conditions
                and get a virtual token before visiting your government office.
              </p>

              {/* Key benefits */}
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur">
                  <span className="font-black text-[#F4B544]">✓</span>
                  Less waiting
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur">
                  <span className="font-black text-[#F4B544]">✓</span>
                  Live queue status
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur">
                  <span className="font-black text-[#F4B544]">✓</span>
                  Virtual tokens
                </div>
              </div>
            </div>

            {/* Office status card */}
            <div className="w-full lg:w-[320px]">
              <div className="rounded-2xl border border-white/20 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4B544]/15 text-xl">
                      🏛️
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                        Department
                      </p>

                      <p className="mt-1 max-w-[190px] truncate text-sm font-bold text-white">
                        {office?.name || "Government Office"}
                      </p>
                    </div>
                  </div>

                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-bold text-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Online
                  </span>
                </div>

                <div className="my-5 h-px bg-white/15" />

                <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                  Available services
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-black text-white">
                    {loading ? "—" : services.length}
                  </span>

                  <span className="mb-1 text-sm text-blue-200">
                    services
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-[#FFD783]">
                  <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
                  Choose a service to check its queue
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Saffron divider */}
        <div className="relative h-1 bg-[#F4B544]" />
      </section>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Section heading */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#15396B]">
                Citizen services
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#15396B] sm:text-3xl">
              What do you need today?
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Select a service to view the current queue and get your virtual
              token.
            </p>
          </div>

          {/* Peak hours */}
          <button
            type="button"
            onClick={() =>
              navigate(`/citizen/offices/${officeId}/crowd`)
            }
            className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#15396B] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#F4B544] hover:shadow-md"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#15396B]/5 text-lg text-[#15396B]">
              ◷
            </span>

            View peak hours

            <span className="transition group-hover:translate-x-1">→</span>
          </button>
        </section>

        {/* ERROR */}
        {error && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="border-l-4 border-red-500 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  ⚠️
                </div>

                <div>
                  <p className="font-bold text-red-800">
                    Unable to load services
                  </p>

                  <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && !error && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-12 w-12 rounded-xl bg-slate-200" />
                <div className="mt-6 h-6 w-3/4 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
                <div className="mt-6 h-7 w-24 rounded-full bg-slate-100" />
                <div className="mt-7 h-4 w-28 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && services.length === 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="px-6 py-16 text-center sm:px-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#15396B]/5 text-3xl">
                📋
              </div>

              <h3 className="mt-6 text-xl font-black text-[#15396B]">
                No services available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                There are currently no active services available at this
                office. Please check again later.
              </p>

              <button
                type="button"
                onClick={() => navigate("/citizen")}
                className="mt-6 rounded-xl bg-[#15396B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102D56]"
              >
                Return to offices
              </button>
            </div>
          </div>
        )}

        {/* SERVICE CARDS */}
        {!loading && !error && services.length > 0 && (
          <section className="mt-8">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const unavailable = service.isActive === false;

                return (
                  <button
                    key={service._id}
                    type="button"
                    disabled={unavailable}
                    onClick={() =>
                      navigate(
                        `/citizen/offices/${officeId}/services/${service._id}/queue`
                      )
                    }
                    className={`group relative overflow-hidden rounded-2xl border bg-white p-6 text-left transition-all duration-300 ${
                      unavailable
                        ? "cursor-not-allowed border-slate-200 opacity-60"
                        : "border-slate-200 shadow-sm hover:-translate-y-1 hover:border-[#F4B544] hover:shadow-lg"
                    }`}
                  >
                    {/* Top accent */}
                    {!unavailable && (
                      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#15396B] via-[#F4B544] to-[#15396B] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    )}

                    {/* Card header */}
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-xl text-xl ${
                          unavailable
                            ? "bg-slate-100"
                            : "bg-[#15396B]/5"
                        }`}
                      >
                        {index % 3 === 0
                          ? "📄"
                          : index % 3 === 1
                            ? "🏛️"
                            : "✓"}
                      </div>

                      {!unavailable && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-[#F4B544]/20 group-hover:text-[#15396B]">
                          →
                        </div>
                      )}
                    </div>

                    {/* Service name */}
                    <h3 className="mt-6 text-xl font-black tracking-tight text-[#15396B]">
                      {service.name}
                    </h3>

                    {/* Description */}
                    {service.description && (
                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-600">
                        {service.description}
                      </p>
                    )}

                    {/* Service information */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Service time
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {service.averageServiceTime
                            ? `${service.averageServiceTime} min`
                            : "Varies"}
                        </p>
                      </div>

                      {/* Status */}
                      {unavailable ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Unavailable
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      )}
                    </div>

                    {/* Call to action */}
                    <div
                      className={`mt-5 flex items-center justify-between text-sm font-bold ${
                        unavailable
                          ? "text-slate-400"
                          : "text-[#15396B]"
                      }`}
                    >
                      <span>
                        {unavailable
                          ? "Currently unavailable"
                          : "Check live queue"}
                      </span>

                      {!unavailable && (
                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* OFFICIAL TRUST SECTION */}
        {!loading && !error && services.length > 0 && (
          <section className="mt-12">
            <div className="overflow-hidden rounded-2xl bg-[#15396B] shadow-lg">
              <div className="relative px-6 py-8 sm:px-8 sm:py-9">
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#F4B544]/10 blur-2xl" />
                <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#FFD783]">
                      <span className="h-2 w-2 rounded-full bg-[#F4B544]" />
                      QueueLess Citizen Services
                    </div>

                    <h2 className="mt-2 text-2xl font-black text-white">
                      Save time before you visit.
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                      Check queue conditions, choose your service, and arrive
                      closer to your turn instead of waiting at the office.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/citizen/offices/${officeId}/crowd`)
                    }
                    className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-[#F4B544] px-5 py-3.5 text-sm font-extrabold text-[#15396B] shadow-md transition hover:-translate-y-0.5 hover:bg-[#FFD783]"
                  >
                    Check crowd levels
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="h-6" />
      </main>
    </div>
  );
}
