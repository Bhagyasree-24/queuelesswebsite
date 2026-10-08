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
          setErrorMessage(queueRes.message || "Failed to fetch queue data");
        }
      } catch (err) {
        console.error("Queue preview load error:", err);
        setErrorMessage("Network error. Could not fetch queue information.");
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
  const estimatedWaitTime = Math.max(0, peopleWaiting * avgTime);

  const handleGenerateToken = async () => {
    try {
      setGenerating(true);
      setErrorMessage(null);

      const res = await createToken(officeId, serviceId);

      if (res.success && res.token?._id) {
        navigate(`/citizen/token/${res.token._id}`);
      } else {
        setErrorMessage(res.message || "Failed to generate token.");
      }
    } catch (err) {
      console.error("Token creation error:", err);
      setErrorMessage("Error connecting to server to generate token.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Citizen Navbar */}
      <CitizenNavbar user={user} />

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(`/citizen/offices/${officeId}/services`)}
          className="mb-8 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          ← Back to services
        </button>

        {loading ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="mt-4 text-slate-600">
              Loading current queue information...
            </p>
          </div>
        ) : (
          <>
            {/* Heading */}
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-3xl">
                🏛️
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-blue-600">
                {office?.name || "Government Office"}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                {service?.name || "Service Queue"}
              </h1>

              <p className="mt-3 text-slate-600">
                Check the current queue before taking your virtual token.
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Queue Card */}
            <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {/* Live status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Current queue</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {peopleWaiting} {peopleWaiting === 1 ? "person" : "people"}{" "}
                    waiting
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
                  {estimatedWaitTime}
                  <span className="ml-2 text-xl font-semibold text-slate-500">
                    min
                  </span>
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Approximate wait time calculated for new tokens
                </p>
              </div>

              {/* Queue information */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="text-sm text-slate-500">People waiting</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {peopleWaiting}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="text-sm text-slate-500">Currently serving</p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {currentServingToken}
                  </p>
                </div>
              </div>

              {/* Service information */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                <div>
                  <p className="text-sm text-slate-500">Average service time</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {avgTime} minutes per token
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-500">Queue status</p>
                  <p className="mt-1 font-semibold text-green-600">Active</p>
                </div>
              </div>

              {/* Get Token Button */}
              <button
                type="button"
                onClick={handleGenerateToken}
                disabled={generating}
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generating ? "Generating Token..." : "Get Virtual Token"}
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                You can track your real-time position after joining the queue.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}