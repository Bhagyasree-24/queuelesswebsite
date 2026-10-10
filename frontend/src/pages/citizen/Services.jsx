
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CitizenNavbar from "../../components/citizen/CitizenNavbar";
import {
  getOfficeServices,
  getOfficeById,
} from "../../services/citizenApi";

// Document requirements for common government services
const SERVICE_DOCUMENTS = {
  driving: [
    "Valid age proof (Aadhaar / PAN / Passport)",
    "Address proof",
    "Medical certificate, if required",
    "Passport-size photographs",
  ],
  license: [
    "Valid age proof (Aadhaar / PAN / Passport)",
    "Address proof",
    "Medical certificate, if required",
    "Passport-size photographs",
  ],
  vehicle: [
    "Vehicle purchase invoice",
    "Valid identity proof",
    "Address proof",
    "Vehicle insurance certificate",
    "PUC certificate, if applicable",
  ],
  registration: [
    "Vehicle purchase invoice",
    "Valid identity proof",
    "Address proof",
    "Vehicle insurance certificate",
    "PUC certificate, if applicable",
  ],
  passport: [
    "Proof of date of birth",
    "Address proof",
    "Identity proof",
    "Recent passport-size photographs, if required",
    "Previous passport, for renewal",
  ],
  birth: [
    "Hospital birth record, if available",
    "Parents' identity proof",
    "Address proof",
    "Application form",
  ],
  income: [
    "Aadhaar card or identity proof",
    "Address proof",
    "Income proof (salary slip / ITR, as applicable)",
    "Application form",
  ],
  caste: [
    "Identity proof",
    "Address proof",
    "Community or caste proof, if required",
    "Supporting family records, if applicable",
    "Application form",
  ],
  residence: [
    "Identity proof",
    "Address proof",
    "Utility bill or residence evidence",
    "Application form",
  ],
  domicile: [
    "Identity proof",
    "Address proof",
    "Residence history evidence, if required",
    "Application form",
  ],
  pension: [
    "Identity proof",
    "Age proof",
    "Bank passbook or account details",
    "Income proof, if required",
    "Application form",
  ],
  ration: [
    "Identity proof of family members",
    "Address proof",
    "Income proof, if required",
    "Existing ration card, if applicable",
    "Application form",
  ],
  aadhaar: [
    "Proof of identity",
    "Proof of address",
    "Proof of date of birth, if needed",
    "Supporting documents for the requested update",
  ],
  property: [
    "Identity proof",
    "Property ownership documents",
    "Latest property tax receipt, if applicable",
    "Application form",
  ],
  tax: [
    "Identity proof",
    "Property or assessment details",
    "Previous tax receipt, if applicable",
    "Supporting financial documents, if required",
  ],
  default: [
    "Valid identity proof",
    "Address proof",
    "Relevant supporting documents",
    "Completed application form",
  ],
};

function getRequiredDocuments(service) {
  const apiDocuments =
    service.requiredDocuments ||
    service.requiredCertificates ||
    service.documentsRequired;

  if (Array.isArray(apiDocuments) && apiDocuments.length > 0) {
    return apiDocuments.map((document) =>
      typeof document === "string"
        ? document
        : document.name || document.title || "Supporting document"
    );
  }

  const name = `${service.name || ""} ${
    service.description || ""
  }`.toLowerCase();

  const matchedKey = Object.keys(SERVICE_DOCUMENTS).find(
    (key) => key !== "default" && name.includes(key)
  );

  return SERVICE_DOCUMENTS[matchedKey || "default"];
}

function getServiceIcon(serviceName = "", index = 0) {
  const name = serviceName.toLowerCase();

  if (name.includes("driving") || name.includes("license")) return "DL";
  if (name.includes("vehicle") || name.includes("registration")) return "VR";
  if (name.includes("passport")) return "PA";
  if (name.includes("birth")) return "BR";
  if (name.includes("income")) return "IN";
  if (name.includes("caste")) return "CA";
  if (name.includes("pension")) return "PE";
  if (name.includes("ration")) return "RA";
  if (name.includes("aadhaar")) return "ID";

  return ["GS", "OF", "CS"][index % 3];
}

function ArrowIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
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

function ClockIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function DocumentIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v6h5M9 13h6M9 17h6" />
    </svg>
  );
}

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
    } else {
      setLoading(false);
      setError("Office information is missing.");
    }
  }, [officeId]);

  const activeServices = services.filter(
    (service) => service.isActive !== false
  ).length;

  return (
    <div className="min-h-screen overflow-hidden bg-[#F5F5F1] text-[#171717]">
      {/* SINGLE NAVIGATION HEADER */}
      <CitizenNavbar user={user} />

      {/* HERO */}
      <section className="px-4 pb-7 pt-4 sm:px-7 sm:pt-6">
        <div className="relative mx-auto max-w-[1440px] overflow-hidden bg-[#EBDD6C]">
          <div className="grid min-h-[410px] lg:grid-cols-[1.05fr_0.95fr]">
            {/* Hero text */}
            <div className="relative z-10 flex flex-col items-start px-6 py-8 sm:px-10 sm:py-11 lg:px-14 lg:py-12">
              <button
                type="button"
                onClick={() => navigate("/citizen")}
                className="mb-9 inline-flex items-center gap-2 border-b border-black/30 pb-1 text-[10px] font-extrabold uppercase tracking-[0.12em] transition hover:border-black"
              >
                <span aria-hidden="true">←</span>
                Back to offices
              </button>

              <span className="inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em]">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
                Official digital portal
              </span>

              <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.16em]">
                {office?.name || "Government services"}
              </p>

              <h1 className="mt-3 max-w-[560px] text-[clamp(2.7rem,6vw,5.5rem)] font-black uppercase leading-[0.82] tracking-[-0.075em]">
                Skip the
                <br />
                queue.
                <br />
                <span className="relative z-0 mt-1 inline-block">
                  <span className="absolute inset-x-[-4px] inset-y-0 -z-10 -rotate-1 bg-white/75" />
                  Save your
                </span>
                <br />
                time.
              </h1>

              <p className="mt-6 max-w-sm text-xs leading-5 text-black/75 sm:text-sm sm:leading-6">
                Explore government services, check document requirements, and
                view queue information before visiting your selected office.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("popular-services")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-3 bg-black px-5 py-3 text-[10px] font-extrabold uppercase tracking-wide text-white transition hover:bg-black/80"
                >
                  Explore services
                  <ArrowIcon />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/citizen/offices/${officeId}/crowd`)
                  }
                  className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wide underline decoration-black/40 underline-offset-4 transition hover:decoration-black"
                >
                  View peak hours
                  <ArrowIcon className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Editorial visual panel */}
            <div className="relative min-h-[260px] overflow-hidden bg-[#D5D5CE] lg:min-h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5F1] via-[#D5D5CE] to-[#AAA99D]" />

              <div className="absolute -bottom-24 -left-8 h-72 w-72 rounded-full bg-[#EBDD6C] sm:h-96 sm:w-96" />

              <div className="absolute right-7 top-7 text-3xl font-light text-black/30">
                +
              </div>
              <div className="absolute bottom-24 left-8 text-3xl font-light text-black/30">
                +
              </div>

              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="relative w-full max-w-[390px]">
                  <div className="absolute -right-2 -top-4 h-16 w-16 border-r border-t border-black/40" />

                  <div className="bg-[#F5F5F1] p-5 shadow-[10px_10px_0_rgba(0,0,0,0.09)] sm:p-7">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-black/50">
                          Your selected office
                        </p>
                        <h2 className="mt-3 max-w-[250px] text-2xl font-black uppercase leading-[0.95] tracking-tight sm:text-3xl">
                          {office?.name || "Public services"}
                        </h2>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#EBDD6C] text-lg">
                        <span aria-hidden="true">⌂</span>
                      </div>
                    </div>

                    <div className="my-5 h-px bg-black/15" />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-black/50">
                          Active services
                        </p>
                        <p className="mt-1 text-4xl font-black tracking-tight">
                          {loading ? "—" : activeServices}
                        </p>
                      </div>

                      <div className="border-l border-black/15 pl-4">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-black/50">
                          Portal status
                        </p>
                        <p className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold uppercase">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              loading
                                ? "bg-amber-500"
                                : error
                                  ? "bg-red-600"
                                  : "bg-emerald-600"
                            }`}
                          />
                          {loading ? "Loading" : error ? "Check status" : "Ready"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-3 left-5 right-5 h-3 bg-black/10" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-3 border border-black/10 bg-white px-3 py-2 sm:bottom-6 sm:right-6">
                <span className="flex h-8 w-8 items-center justify-center bg-[#EBDD6C]">
                  <ClockIcon />
                </span>
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-wider text-black/50">
                    Plan ahead
                  </p>
                  <p className="text-[10px] font-black uppercase">
                    Check before you go
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-2 bg-black" />
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <div className="bg-[#EBDD6C]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-5 gap-y-3 px-5 py-4 sm:px-8">
          {[
            "Citizen services",
            "Document checklist",
            "Virtual tokens",
            "Queue updates",
            "Office information",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-wide text-black/80"
            >
              <span className="h-1.5 w-1.5 bg-black" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* SINGLE MAIN CONTENT SECTION */}
      <main
        id="popular-services"
        className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
      >
        {/* Section heading */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-black/50">
              Start here
            </p>

            <h2 className="mt-2 max-w-3xl text-3xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-5xl">
              Popular
              <span className="relative ml-2 inline-block">
                <span className="absolute inset-x-0 bottom-1 h-3 -rotate-1 bg-[#EBDD6C]" />
                <span className="relative">services.</span>
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-black/60">
              Find the service you need, prepare your documents, and check the
              queue before you visit.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/citizen/offices/${officeId}/crowd`)}
            className="group inline-flex items-center gap-3 self-start border-b border-black pb-2 text-[10px] font-extrabold uppercase tracking-wide transition hover:border-[#A38E00] sm:self-auto"
          >
            View peak hours
            <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </section>

        {/* ERROR STATE */}
        {error && (
          <div
            role="alert"
            className="mt-9 border border-red-200 bg-white p-6"
          >
            <p className="text-lg font-black uppercase">Unable to load services.</p>
            <p className="mt-2 text-sm text-black/60">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 bg-black px-4 py-3 text-[10px] font-extrabold uppercase tracking-wide text-white hover:bg-black/75"
            >
              Try again
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && !error && (
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse border border-black/10 bg-white p-5"
              >
                <div className="h-11 w-11 bg-[#EBDD6C]/60" />
                <div className="mt-6 h-6 w-3/4 bg-black/10" />
                <div className="mt-3 h-3 w-full bg-black/5" />
                <div className="mt-2 h-3 w-5/6 bg-black/5" />
                <div className="mt-6 h-24 bg-[#F0F0EB]" />
                <div className="mt-5 h-10 bg-black/10" />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && services.length === 0 && (
          <div className="mt-9 border border-black/10 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-[#EBDD6C]">
              <DocumentIcon className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-2xl font-black uppercase tracking-tight">
              No services available.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/60">
              There are currently no active services available at this office.
              Please check again later.
            </p>

            <button
              type="button"
              onClick={() => navigate("/citizen")}
              className="mt-6 inline-flex items-center gap-3 bg-black px-5 py-3 text-[10px] font-extrabold uppercase tracking-wide text-white hover:bg-black/75"
            >
              Return to offices
              <ArrowIcon />
            </button>
          </div>
        )}

        {/* SERVICE CARDS */}
        {!loading && !error && services.length > 0 && (
          <section className="mt-9">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-black/15 pb-3">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/55">
                Showing {services.length} service
                {services.length === 1 ? "" : "s"}
              </p>

              <p className="text-[9px] font-bold uppercase tracking-wider text-black/45">
                Select a service to continue ↘
              </p>
            </div>

            <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const unavailable = service.isActive === false;
                const documents = getRequiredDocuments(service);

                return (
                  <article
                    key={service._id}
                    className={`group relative flex h-full flex-col border bg-white transition duration-300 ${
                      unavailable
                        ? "border-black/10 opacity-65"
                        : "border-black/10 hover:-translate-y-1 hover:border-black/40 hover:shadow-[7px_7px_0_#EBDD6C]"
                    }`}
                  >
                    {/* Card top */}
                    <div className="flex items-start justify-between px-5 pt-5 sm:px-6 sm:pt-6">
                      <div
                        className={`flex h-12 w-12 items-center justify-center text-xs font-black tracking-wide ${
                          index % 2 === 0
                            ? "bg-[#EBDD6C] text-black"
                            : "bg-[#F0F0EB] text-black"
                        }`}
                      >
                        {getServiceIcon(service.name, index)}
                      </div>

                      <span className="flex h-8 w-8 items-center justify-center border border-black/15 text-black transition group-hover:border-black group-hover:bg-[#EBDD6C]">
                        {unavailable ? "–" : <ArrowIcon />}
                      </span>
                    </div>

                    {/* Service title and description */}
                    <div className="px-5 pt-5 sm:px-6">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-black/45">
                        Service {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="mt-2 text-xl font-black uppercase leading-[1.05] tracking-tight">
                        {service.name}
                      </h3>

                      <p className="mt-3 min-h-[42px] text-xs leading-5 text-black/60">
                        {service.description ||
                          "Access this government service through the QueueLess portal."}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-[#F0F0EB] px-2.5 py-2 text-[10px] font-bold">
                          <ClockIcon className="h-3.5 w-3.5" />
                          {service.averageServiceTime
                            ? `${service.averageServiceTime} min`
                            : "Time varies"}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-2 text-[10px] font-bold ${
                            unavailable
                              ? "bg-black/5 text-black/45"
                              : "bg-[#EBDD6C]/50 text-black"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              unavailable ? "bg-black/35" : "bg-black"
                            }`}
                          />
                          {unavailable ? "Unavailable" : "Available"}
                        </span>
                      </div>
                    </div>

                    {/* Required documents */}
                    <div className="mx-5 mt-5 flex-1 border-t border-black/10 pt-4 sm:mx-6">
                      <div className="flex items-center gap-2">
                        <DocumentIcon className="h-4 w-4" />
                        <div>
                          <h4 className="text-[10px] font-extrabold uppercase tracking-wide">
                            Required certificates
                          </h4>
                          <p className="mt-1 text-[10px] text-black/45">
                            Documents to prepare
                          </p>
                        </div>
                      </div>

                      <ul className="mt-4 space-y-3">
                        {documents.map((document, documentIndex) => (
                          <li
                            key={`${service._id}-document-${documentIndex}`}
                            className="flex items-start gap-2.5 text-[11px] leading-[1.5] text-black/65"
                          >
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center bg-[#EBDD6C] text-[9px] font-black text-black">
                              ✓
                            </span>
                            <span>{document}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="mt-4 border-t border-black/10 pt-3 text-[10px] leading-4 text-black/45">
                        Requirements may vary. Confirm with the relevant office.
                      </p>
                    </div>

                    {/* Queue navigation */}
                    <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
                      <button
                        type="button"
                        disabled={unavailable}
                        onClick={() =>
                          navigate(
                            `/citizen/offices/${officeId}/services/${service._id}/queue`
                          )
                        }
                        className={`group/button flex w-full items-center justify-between gap-3 px-4 py-3.5 text-[10px] font-extrabold uppercase tracking-wide transition ${
                          unavailable
                            ? "cursor-not-allowed bg-black/5 text-black/35"
                            : "bg-black text-white hover:bg-[#EBDD6C] hover:text-black"
                        }`}
                      >
                        {unavailable ? "Service unavailable" : "View queue"}
                        {!unavailable && (
                          <ArrowIcon className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* PROMOTIONAL BANNER */}
        {!loading && !error && services.length > 0 && (
          <section className="mt-14">
            <div className="grid bg-[#EBDD6C] lg:grid-cols-2">
              <div className="relative flex min-h-[250px] flex-col justify-between overflow-hidden bg-[#22221D] p-7 text-white sm:p-10">
                <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full border-[35px] border-white/5" />
                <p className="relative text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#EBDD6C]">
                  Your time matters
                </p>

                <h2 className="relative mt-8 max-w-lg text-4xl font-black uppercase leading-[0.87] tracking-[-0.06em] sm:text-5xl">
                  Less waiting.
                  <br />
                  More living.
                </h2>

                <p className="relative mt-5 max-w-sm text-xs leading-5 text-white/65">
                  Make your next office visit simpler by checking your service
                  and queue details before you leave.
                </p>
              </div>

              <div className="flex flex-col items-start justify-center p-7 sm:p-10">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-black/55">
                  Your next step
                </p>

                <h3 className="mt-4 max-w-md text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-5xl">
                  Join the queue
                  <br />
                  from anywhere.
                </h3>

                <p className="mt-4 max-w-sm text-xs leading-5 text-black/65">
                  Check crowd levels and explore queue information for your
                  selected government office.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/citizen/offices/${officeId}/crowd`)
                  }
                  className="mt-6 inline-flex items-center gap-4 bg-black px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-wide text-white transition hover:bg-black/75"
                >
                  Check crowd levels
                  <ArrowIcon />
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-5 bg-white">
        <div className="h-2 bg-[#EBDD6C]" />

        <div className="mx-auto grid max-w-[1440px] gap-9 px-5 py-9 sm:px-8 md:grid-cols-[1.4fr_0.7fr_0.9fr] lg:px-12 lg:py-12">
          <div>
            <button
              type="button"
              onClick={() => navigate("/citizen")}
              className="flex items-center gap-2"
            >
              <span className="flex h-8 w-8 items-center justify-center bg-[#EBDD6C] text-sm font-black">
                Q
              </span>
              <span className="text-sm font-black uppercase tracking-tight">
                QueueLess
              </span>
            </button>

            <p className="mt-4 max-w-sm text-xs leading-6 text-black/55">
              Digital queue management for simpler public services and a
              better citizen experience.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em]">
              Explore
            </h3>
            <div className="mt-4 flex flex-col items-start gap-3 text-xs text-black/60">
              <button
                type="button"
                onClick={() => navigate("/citizen")}
                className="transition hover:text-black"
              >
                Home / Offices
              </button>

              <button
                type="button"
                onClick={() => navigate(`/citizen/offices/${officeId}/crowd`)}
                className="transition hover:text-black"
              >
                Peak hours
              </button>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("popular-services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="transition hover:text-black"
              >
                Services
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-[0.15em]">
              Before visiting
            </h3>
            <p className="mt-4 text-xs leading-6 text-black/55">
              Review the document checklist on your selected service card.
              Contact the relevant department to confirm original documents,
              copies, fees, and eligibility.
            </p>
          </div>
        </div>

        <div className="border-t border-black/10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-4 text-[9px] font-medium uppercase tracking-wide text-black/50 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
            <p>
              © {new Date().getFullYear()} QueueLess. All rights reserved.
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C7B536]" />
              Serving citizens, one token at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
