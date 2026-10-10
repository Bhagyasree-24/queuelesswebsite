
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Users,
  Ticket,
  ShieldCheck,
  RefreshCw,
  Building2,
  CheckCircle2,
  Radio,
  CalendarClock,
} from "lucide-react";

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

  const steps = [
    {
      number: "01",
      title: "Get your token",
      description:
        "Generate a virtual token for your selected service.",
      icon: Ticket,
    },
    {
      number: "02",
      title: "Track your queue",
      description:
        "Monitor your queue position and estimated waiting time.",
      icon: Radio,
    },
    {
      number: "03",
      title: "Plan your visit",
      description:
        "Visit the office when your token is getting closer.",
      icon: CalendarClock,
    },
  ];

  const categories = [
    { label: "Citizen services", icon: Building2 },
    { label: "Queue tracking", icon: Radio },
    { label: "Virtual tokens", icon: Ticket },
    { label: "Wait-time estimates", icon: Clock3 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#171717]">
      <CitizenNavbar user={user} />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        {/* Brand row */}
        <div className="flex items-center justify-between gap-4 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F2E36D] text-[#171717]">
              <Ticket size={19} strokeWidth={2.2} />
            </div>

            <div>
              <p className="text-base font-extrabold tracking-tight">
                QueueLess
              </p>
              <p className="mt-0.5 text-[11px] text-[#77766D]">
                Your time matters
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-xs font-medium text-[#66645B] sm:flex">
            <ShieldCheck size={16} className="text-[#82792D]" />
            Digital public services
          </div>
        </div>

        {/* Main hero */}
        <div className="grid overflow-hidden rounded-2xl bg-[#EAE9E2] lg:min-h-[430px] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <button
              type="button"
              onClick={() =>
                navigate(`/citizen/offices/${officeId}/services`)
              }
              className="mb-9 flex w-fit items-center gap-2 text-sm font-medium text-[#65645C] transition hover:text-black"
            >
              <ArrowLeft size={16} />
              Back to services
            </button>

            <div className="mb-5 flex w-fit items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#57564D]">
              <span className="h-2 w-2 rounded-full bg-[#D7C943]" />
              Simple. Smart. Stress-free.
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#77756A]">
              {office?.name || "Government office"}
            </p>

            <h1 className="mt-5 max-w-xl text-[clamp(2.8rem,6vw,5.1rem)] font-black leading-[0.91] tracking-[-0.065em] text-[#171717]">
              WAIT LESS.
              <br />
              DO MORE.
              <br />
              <span className="box-decoration-clone bg-[#F2E36D] px-1">
                YOUR TIME.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-[#68675F] sm:text-[15px]">
              Check the live queue before you leave home. Get a
              virtual token, see your estimated waiting time, and
              plan your visit without standing in a long line.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button
                type="button"
                onClick={handleGenerateToken}
                disabled={generating || loading || !service}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#171717] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#393830] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating ? "Generating token..." : "Get a token"}
                {!generating && <ArrowRight size={16} />}
              </button>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("queue-details")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex min-h-12 items-center gap-2 text-sm font-bold text-[#292923] transition hover:text-[#82792D]"
              >
                View queue
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#66665C]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#8A7E21]" />
                Live queue status
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#8A7E21]" />
                Virtual tokens
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#8A7E21]" />
                Easy access
              </span>
            </div>
          </div>

          {/* Queue overview */}
          <div className="flex items-center bg-[#F1EFAF] p-4 sm:p-7 lg:p-8">
            <div className="w-full rounded-xl bg-[#FCFBF6] p-5 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#858174]">
                    Your queue overview
                  </p>
                  <h2 className="mt-3 break-words text-xl font-bold tracking-tight text-[#202019] sm:text-2xl">
                    {service?.name || "Service counter"}
                  </h2>
                  <p className="mt-1 break-words text-xs text-[#77756B]">
                    {office?.name || "Government office"}
                  </p>
                </div>

                <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#55522F]">
                  <span className="h-2 w-2 rounded-full bg-[#A89A26]" />
                  {loading ? "Updating" : "Live"}
                </span>
              </div>

              <div className="mt-8 bg-[#F4F1D9] p-5 sm:p-6">
                <div className="flex items-center gap-2 text-sm text-[#696752]">
                  <Clock3 size={16} />
                  Estimated waiting time
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-6xl font-black leading-none tracking-[-0.06em] text-[#1C1C16] sm:text-7xl">
                    {loading ? "—" : estimatedWaitTime}
                  </span>
                  <span className="text-sm text-[#777467]">
                    minutes
                  </span>
                </div>

                <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#E2DFC5]">
                  <div
                    className="h-full rounded-full bg-[#D3C74C] transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(12, peopleWaiting * 6)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-5">
                <div className="py-2">
                  <div className="flex items-center gap-2 text-xs text-[#77756B]">
                    <Users size={15} />
                    People waiting
                  </div>
                  <p className="mt-3 text-4xl font-bold tracking-tight text-[#202019]">
                    {loading ? "—" : peopleWaiting}
                  </p>
                  <p className="mt-1 text-xs text-[#8A887D]">
                    In the queue
                  </p>
                </div>

                <div className="py-2">
                  <div className="flex items-center gap-2 text-xs text-[#77756B]">
                    <Radio size={15} />
                    Serving now
                  </div>
                  <p className="mt-3 break-words text-3xl font-bold tracking-tight text-[#202019]">
                    {loading ? "—" : currentServingToken}
                  </p>
                  <p className="mt-1 text-xs text-[#8A887D]">
                    Current token
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-[#77756B]">
                <span className="h-2 w-2 rounded-full bg-[#A89A26]" />
                {loading
                  ? "Getting the latest queue information..."
                  : "Queue information is up to date"}
              </div>
            </div>
          </div>
        </div>

        {/* Service strip */}
        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 bg-[#F2E875] px-4 py-5 sm:grid-cols-4 sm:px-6">
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-2.5 text-xs font-bold text-[#39372A]"
              >
                <Icon size={16} className="shrink-0" />
                {item.label}
              </div>
            );
          })}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main
        id="queue-details"
        className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      >
        {/* Section heading */}
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8778]">
              Start here
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[#171717] sm:text-4xl">
              QUEUE STATUS
            </h2>
            <p className="mt-3 text-sm text-[#77756B]">
              {service?.name || "Your selected service"} · Current
              queue information
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 text-xs font-semibold text-[#666149]">
            <span className="h-2 w-2 rounded-full bg-[#C5B838]" />
            {loading ? "Updating queue" : "Queue overview"}
          </div>
        </div>

        {loading ? (
          <div className="bg-white px-6 py-16 text-center">
            <RefreshCw
              className="mx-auto animate-spin text-[#A79A32]"
              size={30}
            />
            <h2 className="mt-5 text-lg font-bold text-[#24241E]">
              Checking the live queue
            </h2>
            <p className="mt-2 text-sm text-[#858276]">
              Getting the latest queue information...
            </p>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 bg-[#F8E9E3] p-5 text-[#963F32]"
              >
                <p className="text-sm font-bold">
                  Unable to load queue
                </p>
                <p className="mt-2 text-sm leading-6">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="bg-[#F2E875] p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#5E592C]">
                    Estimated waiting time
                  </p>
                  <Clock3 size={21} className="text-[#5E592C]" />
                </div>

                <p className="mt-8 text-5xl font-black tracking-[-0.06em] text-[#1D1D17]">
                  {estimatedWaitTime}
                  <span className="ml-2 text-sm font-semibold tracking-normal text-[#5E592C]">
                    min
                  </span>
                </p>
                <p className="mt-3 text-xs text-[#69643C]">
                  Based on the current waiting queue
                </p>
              </div>

              <div className="bg-white p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#77756B]">
                    People waiting
                  </p>
                  <Users size={21} className="text-[#8B812E]" />
                </div>

                <p className="mt-8 text-5xl font-black tracking-[-0.06em] text-[#1D1D17]">
                  {peopleWaiting}
                </p>
                <p className="mt-3 text-xs text-[#858276]">
                  People in the waiting queue
                </p>
              </div>

              <div className="bg-[#EFEEE6] p-6 sm:col-span-2 sm:p-7 xl:col-span-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-[#77756B]">
                    Currently serving
                  </p>
                  <Ticket size={21} className="text-[#8B812E]" />
                </div>

                <p className="mt-8 break-words text-4xl font-black tracking-tight text-[#1D1D17]">
                  {currentServingToken}
                </p>
                <p className="mt-3 text-xs text-[#858276]">
                  Current serving or called token
                </p>
              </div>
            </div>

            {/* Service details heading */}
            <div className="mb-7 mt-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8778]">
                Everything you need to know
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[#171717] sm:text-4xl">
                YOUR SERVICE DETAILS
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              {/* Office details */}
              <section className="bg-white p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F2E875] text-[#29281D]">
                    <Building2 size={21} />
                  </div>

                  <div>
                    <p className="text-xs text-[#858276]">
                      Office information
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-[#22221C]">
                      Selected service
                    </h3>
                  </div>
                </div>

                <div className="mt-8 space-y-7">
                  <div>
                    <p className="text-xs text-[#858276]">
                      Government office
                    </p>
                    <p className="mt-2 break-words text-base font-semibold text-[#25251F]">
                      {office?.name || "Government Office"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#858276]">
                      Service name
                    </p>
                    <p className="mt-2 break-words text-base font-semibold text-[#25251F]">
                      {service?.name || "Service Counter"}
                    </p>
                  </div>

                  <div className="bg-[#F6F4E8] p-5">
                    <div className="flex items-center gap-2 text-xs text-[#777365]">
                      <Clock3 size={15} />
                      Average service time
                    </div>
                    <p className="mt-3 text-3xl font-black tracking-tight text-[#22221C]">
                      {avgTime}
                      <span className="ml-2 text-xs font-medium tracking-normal text-[#777365]">
                        minutes per service
                      </span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Process */}
              <section className="bg-white p-6 sm:p-8">
                <p className="text-xs text-[#858276]">
                  A simple three-step process
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[#22221C]">
                  What happens next?
                </h3>

                <div className="mt-6 space-y-2">
                  {steps.map((step) => {
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.number}
                        className="flex items-center gap-4 px-2 py-4 transition-colors hover:bg-[#FAF9F3]"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F2E875] text-[#343223]">
                          <Icon size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#292921]">
                            {step.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[#858276]">
                            {step.description}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-bold text-[#9A8F35]">
                          {step.number}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Token CTA */}
            <section className="mt-10 bg-[#EAE9E2] px-6 py-9 sm:px-9 sm:py-11 lg:px-12">
              <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#77715A]">
                    <Ticket size={15} />
                    Your next step
                  </div>

                  <h2 className="mt-4 text-3xl font-black leading-[1.05] tracking-[-0.05em] text-[#171717] sm:text-4xl">
                    YOUR TIME IS
                    <br />
                    TOO VALUABLE TO WAIT.
                  </h2>

                  <p className="mt-4 max-w-lg text-sm leading-7 text-[#6D6B61]">
                    Get your virtual token and track your queue
                    position before visiting the office.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateToken}
                  disabled={generating || loading || !service}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 self-start rounded-md bg-[#171717] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#393830] disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
                >
                  {generating ? "Generating token..." : "Get virtual token"}
                  {!generating && <ArrowRight size={17} />}
                </button>
              </div>
            </section>

            <p className="mt-6 text-center text-xs leading-5 text-[#898679]">
              Queue information is based on the latest data returned
              by the server.
            </p>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 bg-[#EEEDE5]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F2E875] text-xl font-black text-[#22221B]">
                Q
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-tight text-[#24241D]">
                  QueueLess
                </p>
                <p className="mt-1 text-xs text-[#858276]">
                  Digital queue management
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-[#77756B] sm:items-end">
              <button
                type="button"
                onClick={() => navigate("/citizen")}
                className="w-fit font-bold text-[#292921] transition hover:text-[#8A7D24]"
              >
                Citizen dashboard
                <ArrowRight className="ml-2 inline" size={14} />
              </button>
              <p className="text-xs">
                Serving citizens. Saving time.
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-2 text-[11px] text-[#898679] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} QueueLess. All rights reserved.
            </p>
            <p>Digital services at your convenience.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
