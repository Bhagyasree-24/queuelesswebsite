
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Clock3,
  MapPin,
  Ticket,
  Users,
  ShieldCheck,
} from "lucide-react";

import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import {
  getOffices,
  getMyActiveToken,
} from "../../services/citizenApi";

const YELLOW = "#F2E36B";
const CREAM = "#F7F6F2";
const INK = "#171717";

const officeImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85",
];

const eyebrow =
  "text-[10px] font-extrabold uppercase tracking-[0.18em]";

const primaryButton =
  "inline-flex items-center justify-center gap-3 rounded-md bg-black px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-neutral-800";

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

        const [officesRes, tokenRes] = await Promise.all([
          getOffices(),
          getMyActiveToken(),
        ]);

        if (officesRes.success) {
          setOffices(officesRes.offices || []);
          setOfficesError(null);
        } else {
          setOfficesError(
            officesRes.message || "Failed to load offices"
          );
        }

        if (tokenRes.success && tokenRes.token) {
          setActiveTokenData(tokenRes);
        } else {
          setActiveTokenData(null);
        }
      } catch (error) {
        console.error("Failed to load home data:", error);
        setOfficesError(
          "Network error. Could not connect to server."
        );
      } finally {
        setLoadingOffices(false);
        setLoadingToken(false);
      }
    }

    loadData();
  }, []);

  const activeToken = activeTokenData?.token;
  const queuePosition = activeTokenData?.queuePosition;
  const estimatedWait =
    activeTokenData?.estimatedWaitTimeMinutes;

  const firstName = user?.name?.split(" ")?.[0] || "Citizen";

  const scrollToOffices = () => {
    document
      .getElementById("government-offices")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const openToken = () => {
    if (activeToken?._id) {
      navigate(`/citizen/token/${activeToken._id}`);
    }
  };

  return (
    <div
      className="min-h-screen overflow-hidden text-[#171717]"
      style={{ backgroundColor: CREAM }}
    >
      {/* Government-style announcement bar */}
      <div className="bg-[#171717] px-4 py-2.5 text-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-6 flex-col overflow-hidden rounded-[2px]">
              <span className="h-1/3 bg-[#FF9933]" />
              <span className="h-1/3 bg-white" />
              <span className="h-1/3 bg-[#138808]" />
            </span>
            <span className={eyebrow}>
              Digital public service portal
            </span>
          </div>

          <span className="hidden text-[10px] text-white/60 sm:block">
            Public services, made simpler
          </span>
        </div>
      </div>

      <CitizenNavbar user={user} />

      {/* Hero section */}
      <section className="px-3 pb-5 pt-3 sm:px-5 sm:pt-5">
        <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-xl bg-[#E9E7E1] lg:grid-cols-2">
          {/* Hero copy */}
          <div className="flex flex-col items-start justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#D5C42C]" />
              <span className={eyebrow}>
                Digital public service portal
              </span>
            </span>

            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-black/50">
              Welcome back, {firstName}
            </p>

            <h1 className="mt-5 text-[clamp(3.5rem,7vw,6.5rem)] font-black uppercase leading-[0.82] tracking-[-0.075em]">
              Skip the
              <br />
              queue.
              <br />
              <span className="relative inline-block">
                <span className="absolute inset-x-0 bottom-[5%] -z-10 h-[78%] bg-[#F2E36B]" />
                Save your
              </span>
              <br />
              time.
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-7 text-black/65 sm:text-base">
              Get a virtual token before visiting a public service
              office. Track your queue position and plan your visit
              without unnecessary waiting.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToOffices}
                className={primaryButton}
              >
                Get a token
                <ArrowUpRight size={16} />
              </button>

              <button
                type="button"
                onClick={scrollToOffices}
                className="inline-flex items-center gap-2 px-2 py-3 text-xs font-extrabold uppercase tracking-wider hover:opacity-60"
              >
                Explore services <ArrowRight size={15} />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-black/10 pt-4 text-[10px] font-bold uppercase tracking-wider text-black/55">
              <span>✓ Virtual tokens</span>
              <span>✓ Queue tracking</span>
              <span>✓ Less waiting</span>
            </div>
          </div>

          {/* Indian public-service-inspired image */}
          <div className="relative min-h-[400px] overflow-hidden bg-[#D9D6CC] sm:min-h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=90"
              alt="Modern civic office architecture"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

            <div className="absolute right-5 top-5 h-32 w-32 rounded-full bg-[#F2E36B]/90 sm:h-44 sm:w-44" />

            <div className="absolute right-8 top-8 flex h-16 w-16 items-center justify-center rounded-full border border-black/20 bg-white/70 sm:right-12 sm:top-12 sm:h-20 sm:w-20">
              <Building2 size={34} />
            </div>

            <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8">
              <div className="ml-auto max-w-[390px] rounded-xl bg-white p-5 shadow-xl sm:p-6">
                <div className="flex items-start justify-between gap-3 border-b border-black/10 pb-4">
                  <div>
                    <p className={eyebrow + " text-black/45"}>
                      Your queue snapshot
                    </p>
                    <h2 className="mt-2 text-xl font-black uppercase">
                      {loadingToken
                        ? "Checking status"
                        : activeToken
                        ? "You're in line."
                        : "Ready when you are."}
                    </h2>
                    <p className="mt-1 text-xs text-black/55">
                      {activeToken?.officeId?.name ||
                        "Public service portal"}
                    </p>
                  </div>

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F2E36B]">
                    <Ticket size={23} />
                  </span>
                </div>

                {loadingToken ? (
                  <div className="mt-5 animate-pulse">
                    <div className="h-10 w-36 rounded bg-black/10" />
                    <div className="mt-4 h-20 rounded bg-black/5" />
                  </div>
                ) : activeToken ? (
                  <>
                    <p className={eyebrow + " mt-5 text-black/45"}>
                      Token number
                    </p>

                    <p className="mt-1 break-words text-5xl font-black tracking-[-0.06em]">
                      {activeToken.tokenNumber}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-full border border-[#D5C42C] bg-[#FFF8C9] px-3 py-2 text-[10px] font-extrabold uppercase">
                        {activeToken.status}
                      </span>

                      <button
                        type="button"
                        onClick={openToken}
                        className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase hover:underline"
                      >
                        View details <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-[#F7F6F2] p-3">
                        <Users size={18} />
                        <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-black/50">
                          People ahead
                        </p>
                        <p className="mt-1 text-2xl font-black">
                          {queuePosition != null
                            ? Math.max(queuePosition - 1, 0)
                            : "—"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-[#F7F6F2] p-3">
                        <Clock3 size={18} />
                        <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-black/50">
                          Est. wait
                        </p>
                        <p className="mt-1 text-2xl font-black">
                          {estimatedWait ?? "—"}
                          {estimatedWait != null && (
                            <span className="ml-1 text-[10px]">MIN</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-5">
                    <p className="text-sm leading-6 text-black/60">
                      You don't have an active token yet. Choose an
                      office to explore available services.
                    </p>

                    <button
                      type="button"
                      onClick={scrollToOffices}
                      className={primaryButton + " mt-4"}
                    >
                      Find an office <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yellow service strip */}
      <section className="bg-[#F2E36B] px-3 sm:px-5">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-black/10 sm:grid-cols-4">
          {[
            { icon: Ticket, title: "Virtual tokens", text: "Join the queue online" },
            { icon: Clock3, title: "Save time", text: "Plan your visit" },
            { icon: Users, title: "Queue status", text: "Know your position" },
            { icon: ShieldCheck, title: "Easy access", text: "Explore public services" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 px-3 py-5 sm:px-5">
              <Icon size={22} />
              <div>
                <p className="text-[10px] font-black uppercase">{title}</p>
                <p className="mt-1 text-[10px] text-black/60">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Government offices */}
      <main className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <section id="government-offices" className="scroll-mt-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={eyebrow + " text-black/45"}>
                Public services / 01
              </p>

              <h2 className="mt-3 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-6xl">
                Find your
                <br />
                nearest <span className="bg-[#F2E36B] px-1">office.</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-black/60">
                Browse available government offices and select a service
                to get started with your virtual token.
              </p>
            </div>

            <span className="w-fit rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider">
              {loadingOffices
                ? "Loading offices"
                : `${offices.length} offices available`}
            </span>
          </div>

          {officesError && (
            <div className="mt-7 rounded-lg border border-red-200 bg-white p-6">
              <p className="font-extrabold">Unable to load offices</p>
              <p className="mt-2 text-sm text-black/60">
                {officesError}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 text-xs font-extrabold uppercase underline"
              >
                Refresh page
              </button>
            </div>
          )}

          {loadingOffices && !officesError && (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse rounded-lg bg-white p-4">
                  <div className="aspect-[4/3] rounded-md bg-[#E9E7E1]" />
                  <div className="mt-5 h-4 w-2/3 rounded bg-black/10" />
                  <div className="mt-3 h-3 rounded bg-black/5" />
                </div>
              ))}
            </div>
          )}

          {!loadingOffices && !officesError && offices.length === 0 && (
            <div className="mt-7 rounded-xl border border-black/10 bg-white p-10 text-center">
              <Building2 size={36} className="mx-auto" />
              <h3 className="mt-4 text-xl font-black uppercase">
                No offices available
              </h3>
              <p className="mt-2 text-sm text-black/60">
                There are currently no offices available for virtual queues.
              </p>
            </div>
          )}

          {!loadingOffices && !officesError && offices.length > 0 && (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {offices.map((office, index) => (
                <button
                  key={office._id}
                  type="button"
                  onClick={() =>
                    navigate(`/citizen/offices/${office._id}/services`)
                  }
                  className="group overflow-hidden rounded-lg border border-black/10 bg-white text-left transition duration-300 hover:-translate-y-1 hover:shadow-[7px_7px_0_#F2E36B] focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E9E7E1]">
                    <img
                      src={officeImages[index % officeImages.length]}
                      alt={`${office.name} office`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 bg-white px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider">
                      Public office / {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#F2E36B] transition group-hover:bg-white">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-black uppercase leading-tight">
                      {office.name}
                    </h3>

                    {office.address && (
                      <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-black/55">
                        <MapPin size={16} className="mt-1 shrink-0" />
                        {office.address}
                      </p>
                    )}

                    {office.description && (
                      <p className="mt-3 text-sm leading-6 text-black/60">
                        {office.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">
                        Explore services
                      </span>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Closing promotional section */}
        <section className="mt-16 grid overflow-hidden rounded-xl bg-[#E9E7E1] lg:mt-24 lg:grid-cols-2">
          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[350px]">
            <img
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85"
              alt="Public service office interior"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-6 left-6 text-white sm:bottom-10 sm:left-10">
              <p className={eyebrow}>QueueLess / Made for citizens</p>
              <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] sm:text-5xl">
                Your time
                <br />
                matters.
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-start justify-center bg-[#F2E36B] p-7 sm:p-10 lg:p-14">
            <p className={eyebrow}>Public services, made simpler</p>
            <h2 className="mt-5 text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-5xl">
              Less waiting.
              <br />
              More living.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-black/65">
              Choose a service, reserve your place in the queue, and
              check your token before visiting the office.
            </p>
            <button
              type="button"
              onClick={scrollToOffices}
              className="mt-6 inline-flex items-center gap-3 bg-black px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-neutral-800"
            >
              Explore offices <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-[#171717] px-5 py-8 text-white">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xl font-black uppercase">
              Queue<span className="text-[#F2E36B]">Less.</span>
            </p>
            <p className="mt-1 text-xs text-white/55">
              Digital public service portal
            </p>
          </div>

          <p className="text-[10px] uppercase tracking-wider text-white/45">
            Serving citizens. Saving time.
          </p>
        </div>
      </footer>
    </div>
  );
}
