
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import {
  getOfficePeakHours,
  getOfficeById,
} from "../../services/citizenApi";

const COLORS = {
  yellow: "#EBDD6C",
  paper: "#F5F5F1",
  ink: "#171717",
};

function ArrowIcon({ className = "h-4 w-4", left = false }) {
  return (
    <svg
      className={`${className} ${left ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function ClockIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ChartIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 20h18" />
      <path d="M6 16v-5" />
      <path d="M12 16V7" />
      <path d="M18 16V4" />
    </svg>
  );
}

function SparkIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" />
    </svg>
  );
}

function formatHourSlot(hour) {
  const h = Number(hour);

  if (!Number.isFinite(h) || h < 0 || h > 23) {
    return "Time unavailable";
  }

  const formatTime = (value) => {
    const hour24 = value % 24;
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 || 12;

    return `${hour12}:00 ${period}`;
  };

  return `${formatTime(h)} – ${formatTime(h + 1)}`;
}

function getCrowdLevel(count) {
  if (count <= 5) {
    return {
      label: "Low",
      description: "Lower historical activity",
      dot: "bg-emerald-600",
      bar: "bg-emerald-600",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    };
  }

  if (count <= 12) {
    return {
      label: "Moderate",
      description: "Moderate historical activity",
      dot: "bg-amber-500",
      bar: "bg-amber-400",
      badge: "border-amber-200 bg-amber-50 text-amber-900",
    };
  }

  return {
    label: "High",
    description: "Higher historical activity",
    dot: "bg-rose-600",
    bar: "bg-rose-600",
    badge: "border-rose-200 bg-rose-50 text-rose-800",
  };
}

function Metric({ label, value, detail }) {
  return (
    <div className="border-t border-black/15 pt-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-black/55">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-black/60">{detail}</p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/55">
      {children}
    </p>
  );
}

export default function PeakHours({ user }) {
  const navigate = useNavigate();
  const { officeId } = useParams();

  const [office, setOffice] = useState(null);
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const servicesPath = `/citizen/offices/${officeId}/services`;

  useEffect(() => {
    if (!officeId) {
      setError("Office information is missing.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadPeakHours() {
      setLoading(true);
      setError("");
      setOffice(null);
      setPeakHoursData([]);

      try {
        const [officeResult, peakResult] = await Promise.all([
          getOfficeById(officeId),
          getOfficePeakHours(officeId),
        ]);

        if (cancelled) return;

        if (officeResult?.success) {
          setOffice(officeResult.office);
        }

        if (peakResult?.success) {
          setPeakHoursData(
            Array.isArray(peakResult.peakHours)
              ? peakResult.peakHours
              : []
          );
        } else {
          setError(
            peakResult?.message || "Unable to load queue activity."
          );
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Unable to load peak hours:", err);
        setError("Unable to connect to the service. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPeakHours();

    return () => {
      cancelled = true;
    };
  }, [officeId, retry]);

  const slots = useMemo(() => {
    return peakHoursData
      .map((slot) => ({
        ...slot,
        hour: Number(slot.hour),
        tokenCount: Math.max(0, Number(slot.tokenCount) || 0),
      }))
      .filter(
        (slot) =>
          Number.isInteger(slot.hour) &&
          slot.hour >= 0 &&
          slot.hour <= 23
      )
      .sort((a, b) => a.hour - b.hour);
  }, [peakHoursData]);

  const summary = useMemo(() => {
    if (!slots.length) {
      return {
        total: 0,
        average: 0,
        peak: 0,
        highSlots: 0,
        quietest: null,
      };
    }

    const total = slots.reduce(
      (sum, slot) => sum + slot.tokenCount,
      0
    );

    const quietest = [...slots].sort(
      (a, b) =>
        a.tokenCount - b.tokenCount || a.hour - b.hour
    )[0];

    return {
      total,
      average: Math.round(total / slots.length),
      peak: Math.max(...slots.map((slot) => slot.tokenCount)),
      highSlots: slots.filter((slot) => slot.tokenCount > 12).length,
      quietest,
    };
  }, [slots]);

  const goToServices = () => navigate(servicesPath);

  return (
    <div className="min-h-screen bg-[#F5F5F1] text-[#171717]">
      {/* Public service notice */}
      <div className="bg-[#171717] px-4 py-2 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#EBDD6C] text-[10px] font-black text-black">
              Q
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.15em]">
              QueueLess
            </span>
            <span className="hidden text-[10px] text-white/45 sm:inline">
              / PUBLIC SERVICE PORTAL
            </span>
          </div>

          <span className="text-[9px] font-semibold uppercase tracking-wider text-white/70">
            Citizen services · Queue information
          </span>
        </div>
      </div>

      <CitizenNavbar user={user} />

      {/* Hero */}
      <section className="px-3 pb-5 pt-4 sm:px-6 sm:pt-6">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#EBDD6C]">
          <div className="grid min-h-[470px] lg:min-h-[490px] lg:grid-cols-12">
            {/* Hero typography */}
            <div className="relative z-10 flex flex-col items-start px-6 py-8 sm:px-10 sm:py-10 lg:col-span-7 lg:px-12 lg:py-12">
              <button
                type="button"
                onClick={goToServices}
                className="mb-9 inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/60 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] transition hover:bg-white"
              >
                <ArrowIcon left className="h-3 w-3" />
                Back to services
              </button>

              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-black" />
                <SectionLabel>Plan your visit smarter</SectionLabel>
              </div>

              <h1 className="max-w-3xl text-[clamp(3.2rem,8vw,6.7rem)] font-black uppercase leading-[0.79] tracking-[-0.075em]">
                SKIP THE
                <br />
                QUEUE.
                <br />
                <span className="mt-2 inline-block bg-white px-2 pb-2 pt-1">
                  SAVE YOUR
                </span>
                <br />
                TIME.
              </h1>

              <p className="mt-7 max-w-md text-sm font-medium leading-relaxed text-black/70">
                Understand historical queue patterns before visiting your
                government service office. Choose a convenient time and plan
                your day with confidence.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={goToServices}
                  className="inline-flex items-center gap-3 bg-black px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-black/75"
                >
                  Explore services
                  <ArrowIcon />
                </button>

                <a
                  href="#hourly-activity"
                  className="inline-flex items-center gap-2 px-2 py-3 text-[10px] font-extrabold uppercase tracking-[0.1em] transition hover:underline"
                >
                  View crowd data
                  <ArrowIcon className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Abstract editorial illustration and queue card */}
            <div className="relative min-h-[270px] overflow-hidden lg:col-span-5 lg:min-h-full">
              <div className="absolute inset-0 bg-white/20" />

              <div className="absolute -right-20 top-8 h-72 w-72 rounded-full border-[45px] border-white/45 sm:h-96 sm:w-96" />

              <div className="absolute right-[12%] top-[12%] flex h-12 w-12 items-center justify-center rounded-full border border-black/20 bg-white/70 text-xl">
                +
              </div>

              <div className="absolute bottom-8 left-[8%] flex h-10 w-10 items-center justify-center rounded-full border border-black/20 text-lg">
                +
              </div>

              <div className="absolute right-[7%] top-[18%] h-[62%] w-[72%] rounded-t-[48%] bg-[#171717] sm:w-[65%]" />

              <div className="absolute bottom-0 right-0 h-[32%] w-full bg-black/5" />

              <div className="absolute right-[15%] top-[26%] flex h-[44%] w-[55%] flex-col justify-end overflow-hidden rounded-t-[45%] border-x border-t border-black/20 bg-[#F5F5F1]/60 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="text-[9px] font-extrabold uppercase tracking-widest">
                    Queue insights
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-[85%] bg-black/10" />
                  <div className="h-2 w-[60%] bg-black/10" />
                  <div className="h-2 w-[72%] bg-black/10" />
                </div>
              </div>

              <div className="absolute bottom-6 left-4 right-4 rounded-xl border border-black/15 bg-white p-4 shadow-lg sm:left-8 sm:right-8">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-3 w-24 bg-black/10" />
                    <div className="mt-3 h-6 w-40 bg-black/10" />
                  </div>
                ) : summary.quietest ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-black/50">
                        Lowest recorded activity
                      </p>
                      <p className="mt-1 truncate text-xl font-black tracking-tight">
                        {formatHourSlot(summary.quietest.hour)}
                      </p>
                    </div>

                    <div className="shrink-0 border-l border-black/10 pl-4">
                      <p className="text-[9px] font-bold uppercase text-black/50">
                        Tokens
                      </p>
                      <p className="text-2xl font-black">
                        {summary.quietest.tokenCount}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-semibold">
                    Queue insights will appear when data is available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yellow service ticker */}
      <div className="border-y border-black/10 bg-[#EBDD6C]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
          {[
            "Office services",
            "Crowd forecast",
            "Public records",
            "Visit planning",
            "Citizen support",
          ].map((label, index) => (
            <div
              key={label}
              className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.12em]"
            >
              <span className="flex h-4 w-4 items-center justify-center border border-black/20 text-[8px]">
                {index + 1}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Section introduction */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Public service intelligence</SectionLabel>
            <h2 className="mt-3 text-4xl font-black uppercase leading-[0.92] tracking-[-0.06em] sm:text-5xl">
              KNOW BEFORE
              <br />
              <span className="relative inline-block">
                YOU GO.
                <span className="absolute bottom-0 left-0 -z-10 h-3 w-full bg-[#EBDD6C]" />
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-black/60">
              Explore token activity by hour, understand crowd levels, and
              identify a potentially quieter time to visit.
            </p>
          </div>

          <div className="max-w-xs border-l-2 border-[#D2C44C] pl-4">
            <SectionLabel>Selected office</SectionLabel>
            <p className="mt-2 text-sm font-extrabold">
              {office?.name || "Government service office"}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-black/55">
              {loading
                ? "Loading office information..."
                : "Historical activity helps with visit planning."}
            </p>
          </div>
        </section>

        {/* Error state */}
        {error && (
          <section
            role="alert"
            className="mt-9 border border-rose-200 bg-white p-6 sm:p-8"
          >
            <p className="text-xs font-extrabold uppercase tracking-widest text-rose-700">
              Unable to load data
            </p>
            <p className="mt-2 text-sm text-black/70">{error}</p>
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-5 inline-flex items-center gap-2 bg-black px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black/75"
            >
              Try again
              <ArrowIcon />
            </button>
          </section>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse border border-black/10 bg-white p-6"
              >
                <div className="h-3 w-24 bg-black/10" />
                <div className="mt-5 h-9 w-20 bg-black/10" />
                <div className="mt-3 h-3 w-32 bg-black/5" />
              </div>
            ))}
          </div>
        )}

        {/* Activity content */}
        {!loading && !error && (
          <>
            {/* Summary metrics */}
            <section className="mt-9 grid gap-x-8 gap-y-6 border-y border-black/15 bg-white px-5 py-6 sm:grid-cols-3 sm:px-7">
              <Metric
                label="Total recorded tokens"
                value={summary.total}
                detail="Across the returned time slots"
              />
              <Metric
                label="Average per time slot"
                value={summary.average}
                detail="Rounded historical average"
              />
              <Metric
                label="High-activity slots"
                value={summary.highSlots}
                detail="More than 12 tokens recorded"
              />
            </section>

            {/* Crowd level guide */}
            <section className="mt-12">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <SectionLabel>Understand the numbers</SectionLabel>
                  <h3 className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                    THE CROWD GUIDE.
                  </h3>
                </div>
                <p className="max-w-xs text-xs leading-relaxed text-black/55">
                  These are indicative levels based on token counts, not
                  guaranteed waiting times.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "LOW ACTIVITY",
                    range: "0–5 tokens",
                    body: "A lower-volume period in the recorded data.",
                    color: "bg-emerald-600",
                    number: "01",
                  },
                  {
                    title: "MODERATE",
                    range: "6–12 tokens",
                    body: "A moderate-volume period in the recorded data.",
                    color: "bg-[#D5B400]",
                    number: "02",
                  },
                  {
                    title: "HIGH ACTIVITY",
                    range: "13+ tokens",
                    body: "A higher-volume period; consider other available times.",
                    color: "bg-rose-600",
                    number: "03",
                  },
                ].map((item) => (
                  <article
                    key={item.number}
                    className="group border border-black/15 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className={`h-1.5 ${item.color}`} />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center justify-between">
                        <SectionLabel>{item.title}</SectionLabel>
                        <span className="text-xs font-bold text-black/35">
                          {item.number}
                        </span>
                      </div>
                      <h4 className="mt-5 text-2xl font-black tracking-tight">
                        {item.range}
                      </h4>
                      <p className="mt-3 text-sm leading-relaxed text-black/60">
                        {item.body}
                      </p>
                    </div>
                    <div className="flex items-center justify-between border-t border-black/10 px-5 py-3 sm:px-6">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/45">
                        Historical indicator
                      </span>
                      <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Hourly chart */}
            <section
              id="hourly-activity"
              className="mt-14 scroll-mt-28"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-black/20 pb-5 sm:flex-row sm:items-end">
                <div>
                  <SectionLabel>Historical queue data</SectionLabel>
                  <h3 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] sm:text-4xl">
                    HOURLY ACTIVITY.
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-black/55">
                  <ChartIcon className="h-4 w-4" />
                  <span>{slots.length} recorded time slots</span>
                </div>
              </div>

              {slots.length === 0 ? (
                <div className="mt-6 border border-black/10 bg-white px-6 py-12 text-center">
                  <ChartIcon className="mx-auto h-8 w-8 text-black/35" />
                  <h4 className="mt-4 font-extrabold uppercase">
                    No activity data yet
                  </h4>
                  <p className="mt-2 text-sm text-black/55">
                    Historical queue information will appear here when
                    available.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                  {/* Bar chart */}
                  <div className="border border-black/10 bg-white p-5 sm:p-7 lg:col-span-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <SectionLabel>Token volume</SectionLabel>
                        <p className="mt-2 text-sm font-bold">
                          Tokens recorded by hour
                        </p>
                      </div>
                      <span className="bg-[#EBDD6C] px-2 py-1 text-[10px] font-extrabold uppercase">
                        {summary.peak} max
                      </span>
                    </div>

                    <div className="mt-8 flex h-56 items-end gap-2 overflow-x-auto border-b border-black/15 pb-2 sm:gap-3">
                      {slots.map((slot) => {
                        const crowd = getCrowdLevel(slot.tokenCount);
                        const height =
                          summary.peak > 0
                            ? (slot.tokenCount / summary.peak) * 100
                            : 0;

                        return (
                          <div
                            key={slot.hour}
                            className="group flex h-full min-w-8 flex-1 flex-col items-center justify-end sm:min-w-10"
                            title={`${formatHourSlot(slot.hour)}: ${slot.tokenCount} tokens`}
                          >
                            <span className="mb-2 text-[10px] font-bold opacity-0 transition group-hover:opacity-100">
                              {slot.tokenCount}
                            </span>
                            <div
                              className={`w-full max-w-10 border border-black/10 transition-all group-hover:opacity-75 ${crowd.bar}`}
                              style={{
                                height:
                                  slot.tokenCount === 0
                                    ? "3px"
                                    : `${Math.max(height, 5)}%`,
                              }}
                            />
                            <span className="mt-2 text-[9px] font-semibold text-black/50">
                              {slot.hour % 12 || 12}
                              {slot.hour >= 12 ? "p" : "a"}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {[
                        ["bg-emerald-600", "Low"],
                        ["bg-amber-400", "Moderate"],
                        ["bg-rose-600", "High"],
                      ].map(([color, label]) => (
                        <div
                          key={label}
                          className="flex items-center gap-2"
                        >
                          <span className={`h-2.5 w-2.5 ${color}`} />
                          <span className="text-[10px] font-semibold text-black/60">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quietest time card */}
                  <div className="flex flex-col justify-between bg-[#EBDD6C] p-6 sm:p-8 lg:col-span-5">
                    <div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-white/50">
                        <ClockIcon />
                      </div>
                      <SectionLabel>Suggested time window</SectionLabel>
                      <h4 className="mt-5 text-3xl font-black uppercase leading-[0.95] tracking-[-0.05em] sm:text-4xl">
                        GO WHEN
                        <br />
                        IT'S QUIETER.
                      </h4>

                      {summary.quietest && (
                        <>
                          <p className="mt-5 text-sm font-semibold text-black/65">
                            Lowest recorded token volume among the returned
                            time slots:
                          </p>
                          <div className="mt-4 border-y border-black/20 py-4">
                            <p className="text-2xl font-black">
                              {formatHourSlot(summary.quietest.hour)}
                            </p>
                            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-black/60">
                              {summary.quietest.tokenCount} tokens recorded
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-6">
                      <p className="mb-4 text-xs leading-relaxed text-black/65">
                        This recommendation uses historical token counts.
                        Actual queues can vary by day, service, and staffing.
                      </p>
                      <button
                        type="button"
                        onClick={goToServices}
                        className="flex w-full items-center justify-between bg-black px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-black/75"
                      >
                        Choose your service
                        <ArrowIcon />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Hourly detail table */}
              {slots.length > 0 && (
                <div className="mt-8 border border-black/10 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 px-5 py-5 sm:px-7">
                    <div>
                      <SectionLabel>Time-slot breakdown</SectionLabel>
                      <h4 className="mt-1 text-xl font-black uppercase">
                        ALL RECORDED HOURS.
                      </h4>
                    </div>
                    <span className="text-xs text-black/50">
                      Sorted by time
                    </span>
                  </div>

                  <div className="divide-y divide-black/10">
                    {slots.map((slot) => {
                      const crowd = getCrowdLevel(slot.tokenCount);
                      const progress =
                        summary.peak > 0
                          ? (slot.tokenCount / summary.peak) * 100
                          : 0;

                      return (
                        <div
                          key={slot.hour}
                          className="grid gap-3 px-5 py-4 sm:grid-cols-12 sm:items-center sm:px-7"
                        >
                          <div className="sm:col-span-4">
                            <p className="text-sm font-extrabold">
                              {formatHourSlot(slot.hour)}
                            </p>
                            <p className="mt-1 text-[10px] uppercase tracking-wider text-black/45">
                              Hour {slot.hour}
                            </p>
                          </div>

                          <div className="sm:col-span-5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-black/55">
                                Recorded tokens
                              </span>
                              <span className="font-extrabold">
                                {slot.tokenCount}
                              </span>
                            </div>
                            <div className="mt-2 h-1.5 overflow-hidden bg-black/5">
                              <div
                                className={`h-full ${crowd.bar}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3 sm:text-right">
                            <span
                              className={`inline-flex border px-3 py-1 text-[10px] font-bold uppercase ${crowd.badge}`}
                            >
                              {crowd.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            {/* Bottom CTA */}
            <section className="mt-14 grid overflow-hidden border border-black/10 bg-white md:grid-cols-2">
              <div className="flex min-h-64 flex-col items-start justify-center bg-[#EBDD6C] p-7 sm:p-10">
                <SectionLabel>Your time matters</SectionLabel>
                <h3 className="mt-4 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-5xl">
                  LESS
                  <br />
                  WAITING.
                  <br />
                  MORE LIVING.
                </h3>
              </div>

              <div className="flex flex-col items-start justify-center p-7 sm:p-10">
                <SectionLabel>QueueLess citizen services</SectionLabel>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-black/60">
                  Explore available government services, review your options,
                  and prepare for your visit before leaving home.
                </p>
                <button
                  type="button"
                  onClick={goToServices}
                  className="mt-6 inline-flex items-center gap-4 bg-black px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-black/75"
                >
                  Explore all services
                  <ArrowIcon />
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 bg-[#171717] text-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center bg-[#EBDD6C] text-sm font-black text-black">
                  Q
                </span>
                <span className="text-lg font-black uppercase tracking-tight">
                  QueueLess
                </span>
              </div>
              <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/55">
                A digital queue information portal designed to help citizens
                understand service activity and plan their office visits.
              </p>
            </div>

            <div>
              <SectionLabel>Explore</SectionLabel>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={goToServices}
                  className="block text-xs text-white/65 transition hover:text-[#EBDD6C]"
                >
                  Office services
                </button>
                <a
                  href="#hourly-activity"
                  className="block text-xs text-white/65 transition hover:text-[#EBDD6C]"
                >
                  Peak hours
                </a>
                <button
                  type="button"
                  onClick={() => navigate("/citizen/offices")}
                  className="block text-xs text-white/65 transition hover:text-[#EBDD6C]"
                >
                  Office directory
                </button>
              </div>
            </div>

            <div>
              <SectionLabel>Helpful information</SectionLabel>
              <div className="mt-4 space-y-3 text-xs text-white/65">
                <p>Plan your visit</p>
                <p>Understand crowd levels</p>
                <p>Check available services</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/15 pt-5 text-[10px] text-white/45 sm:flex-row">
            <p>
              © {new Date().getFullYear()} QueueLess. All rights reserved.
            </p>
            <p>Public service information · Accessibility · Privacy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
