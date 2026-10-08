import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import { getOfficeServices, getOfficeById } from "../../services/citizenApi";

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
    <div className="min-h-screen bg-slate-50">
      {/* Citizen Navbar */}
      <CitizenNavbar user={user} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/citizen")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <span>←</span>
          Back to offices
        </button>

        {/* Office Header */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {office ? office.name : "Government Services"}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Available Services
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Select a service to check the current queue and get a virtual token.
          </p>
        </section>

        {/* Services Section */}
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="text-xl font-bold text-slate-900">Services</h2>

            {/* Peak Hours */}
            <button
              type="button"
              onClick={() => navigate(`/citizen/offices/${officeId}/crowd`)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
            >
              View peak hours
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && !error && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="mt-3 text-sm text-slate-500">
                Loading available services...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && services.length === 0 && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                📋
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No services available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                There are currently no active services available at this office.
              </p>
            </div>
          )}

          {/* Service Cards */}
          {!loading && !error && services.length > 0 && (
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <button
                  key={service._id}
                  type="button"
                  disabled={service.isActive === false}
                  onClick={() =>
                    navigate(
                      `/citizen/offices/${officeId}/services/${service._id}/queue`
                    )
                  }
                  className={`group rounded-2xl border bg-white p-6 text-left shadow-sm transition ${
                    service.isActive === false
                      ? "cursor-not-allowed border-slate-200 opacity-60"
                      : "border-slate-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-2xl">
                      📄
                    </div>

                    <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                      →
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {service.name}
                  </h3>

                  {service.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {service.description}
                    </p>
                  )}

                  {service.averageServiceTime && (
                    <p className="mt-4 text-xs text-slate-500">
                      Average service time:{" "}
                      <span className="font-semibold text-slate-700">
                        {service.averageServiceTime} min
                      </span>
                    </p>
                  )}

                  <div className="mt-5">
                    {service.isActive === false ? (
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        Currently unavailable
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                        Available
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-5 text-sm font-semibold ${
                      service.isActive === false
                        ? "text-slate-400"
                        : "text-blue-600"
                    }`}
                  >
                    {service.isActive === false
                      ? "Unavailable"
                      : "View queue →"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}