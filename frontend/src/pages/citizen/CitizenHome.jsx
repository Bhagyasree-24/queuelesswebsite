import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import { getOffices, getMyActiveToken } from "../../services/citizenApi";

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Citizen Navbar */}
      <CitizenNavbar user={user} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Citizen Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Where do you need to go?
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Choose a government office to view its available services and join
            the virtual queue.
          </p>
        </section>

        {/* Government Offices */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Government Offices
          </h2>

          {/* Error state */}
          {officesError && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              <p className="font-semibold">{officesError}</p>
            </div>
          )}

          {/* Loading */}
          {loadingOffices && !officesError && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="mt-3 text-sm text-slate-500">
                Loading government offices...
              </p>
            </div>
          )}

          {/* Empty */}
          {!loadingOffices && !officesError && offices.length === 0 && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🏢
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No offices available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                There are currently no government offices available.
              </p>
            </div>
          )}

          {/* Offices List */}
          {!loadingOffices && !officesError && offices.length > 0 && (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {offices.map((office) => (
                <button
                  key={office._id}
                  type="button"
                  onClick={() =>
                    navigate(`/citizen/offices/${office._id}/services`)
                  }
                  className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-2xl">
                      {office.type === "REVENUE" ? "🏛️" : "🏢"}
                    </div>

                    <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                      →
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {office.name}
                  </h3>

                  {office.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {office.description}
                    </p>
                  )}

                  {(office.mandal || office.district || office.state) && (
                    <p className="mt-3 text-xs text-slate-500">
                      {[office.mandal, office.district, office.state]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}

                  <p className="mt-5 text-sm font-semibold text-blue-600">
                    View services →
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Active Token Section */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-900">Your active token</h2>

          {loadingToken ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <p className="mt-2 text-xs text-slate-500">
                Checking active tokens...
              </p>
            </div>
          ) : activeToken ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white sm:flex sm:items-center sm:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    Status: {activeToken.status}
                  </span>

                  <h3 className="mt-3 text-3xl font-bold tracking-tight">
                    Token #{activeToken.tokenNumber}
                  </h3>

                  <p className="mt-1 text-sm text-blue-100">
                    {activeToken.officeId?.name} · {activeToken.serviceId?.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/citizen/token/${activeToken._id}`)}
                  className="mt-4 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-600 shadow transition hover:bg-blue-50 sm:mt-0"
                >
                  View Token Details
                </button>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Queue Position</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {queuePosition ? `#${queuePosition}` : "In Progress"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Estimated Wait</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {estimatedWait !== null && estimatedWait !== undefined
                      ? `${estimatedWait} min`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  🎟️
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  No active token
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Choose an office and service to get a virtual token and track
                  your place in the queue.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}