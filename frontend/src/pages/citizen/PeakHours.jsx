import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import { getOfficePeakHours, getOfficeById } from "../../services/citizenApi";

export default function PeakHours({ user }) {
  const navigate = useNavigate();
  const { officeId } = useParams();

  const [office, setOffice] = useState(null);
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPeakHours() {
      try {
        setLoading(true);
        setError(null);

        const [officeRes, peakRes] = await Promise.all([
          getOfficeById(officeId),
          getOfficePeakHours(officeId),
        ]);

        if (officeRes.success) {
          setOffice(officeRes.office);
        }

        if (peakRes.success) {
          setPeakHoursData(peakRes.peakHours || []);
        } else {
          setError(peakRes.message || "Failed to load peak hours");
        }
      } catch (err) {
        console.error("Error loading peak hours:", err);
        setError("Network error loading peak hours data.");
      } finally {
        setLoading(false);
      }
    }

    if (officeId) {
      loadPeakHours();
    }
  }, [officeId]);

  function formatHourSlot(hourInt) {
    const h = Number(hourInt);
    const startPeriod = h >= 12 ? "PM" : "AM";
    const start12 = h % 12 === 0 ? 12 : h % 12;

    const nextH = (h + 1) % 24;
    const endPeriod = nextH >= 12 ? "PM" : "AM";
    const end12 = nextH % 12 === 0 ? 12 : nextH % 12;

    return `${start12}:00 ${startPeriod} – ${end12}:00 ${endPeriod}`;
  }

  function getCrowdLevel(count) {
    if (count <= 5)
      return { level: "Low", color: "green", bg: "bg-green-100 text-green-700", dot: "bg-green-500" };
    if (count <= 12)
      return { level: "Moderate", color: "yellow", bg: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" };
    return { level: "High", color: "red", bg: "bg-red-100 text-red-700", dot: "bg-red-500" };
  }

  const lowestSlot = peakHoursData.length
    ? [...peakHoursData].sort((a, b) => a.tokenCount - b.tokenCount)[0]
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Citizen Navbar */}
      <CitizenNavbar user={user} />

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(`/citizen/offices/${officeId}/services`)}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <span>←</span>
          Back to services
        </button>

        {/* Page heading */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {office?.name || "Crowd Information"}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Best time to visit
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Check expected crowd levels based on historical activity and choose a time with a shorter waiting period.
          </p>
        </section>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-3 text-sm text-slate-500">
              Loading peak hours data...
            </p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
          </div>
        ) : (
          <>
            {/* Legend */}
            <section className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">
                Crowd Forecast
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <div>
                    <p className="font-semibold text-slate-900">Low (&le; 5 tokens)</p>
                    <p className="text-xs text-slate-500">Shorter wait</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div>
                    <p className="font-semibold text-slate-900">Moderate (6-12 tokens)</p>
                    <p className="text-xs text-slate-500">Average wait</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <div>
                    <p className="font-semibold text-slate-900">High (&gt; 12 tokens)</p>
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
                      Hourly Activity
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Total historical tokens generated per hour
                    </p>
                  </div>
                </div>

                {peakHoursData.length === 0 ? (
                  <p className="mt-6 text-center text-sm text-slate-500">
                    No historical activity data recorded yet for this office.
                  </p>
                ) : (
                  <div className="mt-6 space-y-3">
                    {peakHoursData.map((slot) => {
                      const meta = getCrowdLevel(slot.tokenCount);
                      return (
                        <div
                          key={slot.hour}
                          className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <span className={`h-3 w-3 shrink-0 rounded-full ${meta.dot}`} />

                            <div>
                              <p className="font-semibold text-slate-900">
                                {formatHourSlot(slot.hour)}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {slot.tokenCount} total tokens generated
                              </p>
                            </div>
                          </div>

                          <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${meta.bg}`}>
                            {meta.level}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Recommendation */}
            {lowestSlot && (
              <section className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg sm:p-8">
                <p className="text-sm font-semibold text-blue-100">Recommended</p>

                <h2 className="mt-2 text-2xl font-bold">
                  Visit around {formatHourSlot(lowestSlot.hour)}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                  This hour historically records the lowest volume of tokens ({lowestSlot.tokenCount} tokens) and shortest waiting times.
                </p>

                <button
                  type="button"
                  onClick={() => navigate(`/citizen/offices/${officeId}/services`)}
                  className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  Select a Service
                </button>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}