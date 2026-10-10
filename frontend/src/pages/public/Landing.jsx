
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const services = [
  {
    title: "Resident Services",
    description:
      "Access identity documents, certificates and essential citizen services.",
    image:
      "https://www.thestatesman.com/wp-content/uploads/2021/10/QT-uidai-1024x683.jpg",
    label: "Citizen Services",
  },
  {
    title: "Licences & Permits",
    description:
      "Access passport services, licences, renewals and applications.",
    image:
      "https://img.inextlive.com/inext/Passport_p_160613.jpg",
    label: "Official Documents",
  },
  {
    title: "Public Services",
    description:
      "Connect with government offices and public service centres.",
    image:
      "https://lms24x7.s3.amazonaws.com/gsktestimonials/uploads/2023/01/03172042/All-About-CSC-2.0.png",
    label: "Digital India",
  },
];

const quickLinks = [
  "Citizen Services",
  "Aadhaar Services",
  "Licensing",
  "Public Records",
  "Appointments",
  "Help Centre",
];

export default function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f4] font-sans text-[#171717]">

      {/* Announcement Bar */}
      <div className="bg-[#171717] px-4 py-2 text-[10px] text-white sm:text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <p className="flex flex-wrap items-center gap-2">
            <span className="bg-[#efdf69] px-2 py-1 font-extrabold uppercase text-black">
              QueueLess Update
            </span>
            Virtual queue tracking for convenient public services.
          </p>

          <a
            href="#how-it-works"
            className="font-semibold underline decoration-[#efdf69] underline-offset-4 hover:text-[#efdf69]"
          >
            Learn More →
          </a>
        </div>
      </div>

      {/* Existing Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="px-3 pb-8 pt-3 sm:px-6 lg:px-8">
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl overflow-hidden rounded-2xl bg-[#e8e7e1] lg:grid-cols-2">

          {/* Hero Text */}
          <div className="relative z-10 flex flex-col items-start justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">

            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em]">
              <span className="h-2 w-2 rounded-full bg-[#c8b632]" />
              Digital Public Service Portal
            </span>

            <h1 className="mt-7 text-[clamp(3.1rem,6.5vw,5.6rem)] font-black uppercase leading-[0.83] tracking-[-0.075em]">
              Skip the
              <br />
              queue.
              <br />

              <span className="relative z-0 inline-block px-1.5">
                <span className="absolute inset-0 -z-10 -rotate-1 bg-[#efdf69]" />
                Save your
              </span>

              <br />
              time.
            </h1>

            <p className="mt-7 max-w-md text-sm leading-6 text-black/65 sm:text-base">
              Get a virtual token before visiting a public service office.
              Track your queue position and plan your visit without
              unnecessary waiting.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center rounded-md bg-black px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-[#333]"
              >
                Get a Token
                <span className="ml-3 text-[#efdf69]">↗</span>
              </Link>

              <a
                href="#how-it-works"
                className="px-3 py-3 text-xs font-extrabold uppercase tracking-wide hover:text-[#8b7b0b]"
              >
                How It Works →
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-black/10 pt-5 text-xs font-medium text-black/65">
              <span>✓ Less Waiting</span>
              <span>✓ Live Queue Status</span>
              <span>✓ Easy Access</span>
            </div>
          </div>

          {/* Indian Public Service Image */}
          <div className="relative min-h-[340px] overflow-hidden lg:min-h-full">
            <img
              src="https://www.thestatesman.com/wp-content/uploads/2021/10/QT-uidai-1024x683.jpg"
              alt="Indian Aadhaar Seva Kendra public service centre"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

            <div className="absolute right-5 top-5 rounded-full border border-white/60 bg-white/80 px-3 py-2 text-[9px] font-extrabold uppercase tracking-widest backdrop-blur">
              Citizen First
            </div>

            {/* Yellow Decorative Shape */}
            <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-[#efdf69]/70 mix-blend-screen sm:h-80 sm:w-80" />

            {/* Queue Preview */}
            <div className="absolute bottom-5 right-4 flex items-center gap-3 rounded-xl bg-white px-3 py-3 shadow-2xl sm:bottom-8 sm:right-8 sm:px-5">

              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#efdf69] text-lg">
                ▦
              </span>

              <div className="border-r border-black/10 pr-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-black/50">
                  Your Token
                </p>
                <p className="text-lg font-black">A-024</p>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-black/50">
                  Estimated Wait
                </p>
                <p className="text-lg font-black">
                  20 <span className="text-xs font-semibold">min</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yellow Service Navigation */}
      <nav
        aria-label="Service categories"
        className="bg-[#efdf69] px-4 py-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-3">
          {quickLinks.map((item) => (
            <a
              key={item}
              href="#popular-services"
              className="text-[9px] font-extrabold uppercase tracking-wide transition hover:underline hover:underline-offset-4 sm:text-[10px]"
            >
              <span className="mr-2">▣</span>
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Popular Services */}
      <section
        id="popular-services"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/55">
              Start Here
            </p>

            <h2 className="text-3xl font-black uppercase tracking-[-0.055em] sm:text-4xl">
              Popular{" "}
              <span className="underline decoration-[#efdf69] decoration-[7px] underline-offset-[-2px]">
                Services
              </span>
            </h2>
          </div>

          <a
            href="#how-it-works"
            className="shrink-0 text-[9px] font-extrabold uppercase tracking-wide hover:underline"
          >
            Explore Services →
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <a
              href="#how-it-works"
              key={service.title}
              className="group block min-w-0"
            >
              <div className="overflow-hidden rounded-xl bg-[#e6e4dc]">
                <img
                  src={service.image}
                  alt={service.label}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                  loading="lazy"
                />
              </div>

              <div className="flex items-start justify-between gap-3 pt-4">
                <div>
                  <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-black/45">
                    {service.label}
                  </p>

                  <h3 className="text-base font-extrabold tracking-tight">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-black/55">
                    {service.description}
                  </p>
                </div>

                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/20 text-sm transition group-hover:border-black group-hover:bg-black group-hover:text-white">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="border-y border-black/5 bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/55">
              Simple Process
            </p>

            <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-[-0.06em] sm:text-5xl">
              A Few Steps.
              <br />
              <span className="text-[#9b8b13]">
                A Lot Less Waiting.
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-black/60">
              Get your virtual token in a few simple steps and follow
              your queue remotely.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <Step
              number="01"
              title="Choose an Office"
              description="Select the government office you need to visit."
            />

            <Step
              number="02"
              title="Choose a Service"
              description="Select the service you want from that office."
            />

            <Step
              number="03"
              title="Get Your Token"
              description="Take a virtual token and track your queue remotely."
            />
          </div>
        </div>
      </section>

      {/* Indian Government Building CTA */}
      <section className="grid bg-[#efdf69] lg:min-h-[430px] lg:grid-cols-2">

        <div className="relative min-h-[280px] overflow-hidden lg:min-h-full">
          <img
            src="https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2022/11/parliament-winter-session-pti-1668189242.jpg"
            alt="Indian Parliament House in New Delhi"
            className="absolute inset-0 h-full w-full object-cover grayscale"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-[#b6a52a]/45 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        </div>

        <div className="flex flex-col items-start justify-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]">
            Your Time Matters
          </p>

          <h2 className="mt-4 max-w-xl text-4xl font-black uppercase leading-[0.88] tracking-[-0.07em] sm:text-6xl">
            Join the
            <br />
            Queue From
            <br />
            Anywhere.
          </h2>

          <p className="mt-5 max-w-md text-sm leading-6 text-black/75">
            Choose a service, reserve your place and continue with your day.
            Plan your visit and reduce unnecessary waiting at public offices.
          </p>

          <p className="mt-4 text-[10px] font-extrabold uppercase tracking-wide">
            A Smarter Way to Access Services
            <span className="mt-1 block font-medium normal-case tracking-normal text-black/65">
              For participating public service centres
            </span>
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center rounded-md bg-black px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-[#333]"
          >
            Get Started
            <span className="ml-3 text-[#efdf69]">↗</span>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/55">
            Built for Simpler Visits
          </p>

          <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.055em] sm:text-4xl">
            Wait Smarter.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            title="Virtual Token"
            description="Get your place in the queue without standing there."
            icon="01"
          />

          <Feature
            title="Live Queue"
            description="See how many people are currently ahead of you."
            icon="02"
          />

          <Feature
            title="Estimated Wait"
            description="Get an approximate idea of your waiting time."
            icon="03"
          />

          <Feature
            title="Turn Alerts"
            description="Know when your turn is getting closer."
            icon="04"
          />
        </div>
      </section>

      {/* COMPLETE FOOTER */}
      <footer className="bg-[#171717] text-white">

        {/* Tricolour Accent */}
        <div className="grid h-1 grid-cols-3">
          <div className="bg-[#ff9933]" />
          <div className="bg-white" />
          <div className="bg-[#138808]" />
        </div>

        {/* Main Footer */}
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            {/* Brand */}
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#efdf69] text-xl text-black">
                  ▦
                </span>

                <span className="text-xl font-black uppercase tracking-tight">
                  QueueLess
                </span>
              </Link>

              <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
                A smarter way to plan public service visits, get virtual
                tokens and spend less time waiting in queues.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/75">
                <span className="h-2 w-2 rounded-full bg-[#138808]" />
                Digital Queue Management
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#efdf69]">
                Quick Links
              </h3>

              <ul className="mt-5 space-y-3 text-sm text-white/65">
                <li>
                  <Link to="/" className="transition hover:text-white">
                    Home
                  </Link>
                </li>

                <li>
                  <a href="#popular-services" className="transition hover:text-white">
                    Popular Services
                  </a>
                </li>

                <li>
                  <a href="#how-it-works" className="transition hover:text-white">
                    How It Works
                  </a>
                </li>

                <li>
                  <Link to="/login" className="transition hover:text-white">
                    Get a Token
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#efdf69]">
                Citizen Services
              </h3>

              <ul className="mt-5 space-y-3 text-sm text-white/65">
                <li>
                  <a href="#popular-services" className="transition hover:text-white">
                    Aadhaar Services
                  </a>
                </li>

                <li>
                  <a href="#popular-services" className="transition hover:text-white">
                    Passport Services
                  </a>
                </li>

                <li>
                  <a href="#popular-services" className="transition hover:text-white">
                    Licences & Permits
                  </a>
                </li>

                <li>
                  <a href="#popular-services" className="transition hover:text-white">
                    Public Records
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#efdf69]">
                Help & Support
              </h3>

              <p className="mt-5 text-sm leading-6 text-white/60">
                Need assistance with the portal or your virtual token?
                Visit the available support section.
              </p>

              <a
                href="#how-it-works"
                className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-white transition hover:text-[#efdf69]"
              >
                View Help Guide →
              </a>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-12 border-t border-white/15 pt-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs leading-5 text-white/50">
                © {new Date().getFullYear()} QueueLess. All rights reserved.
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50">
                <a href="#top" className="transition hover:text-white">
                  Back to Top ↑
                </a>

                <Link to="/login" className="transition hover:text-white">
                  Sign In
                </Link>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-[10px] leading-5 text-white/35">
              QueueLess is a virtual queue management project. It is not an
              official Government of India website and is not affiliated
              with any government department.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* Step Component */
function Step({ number, title, description }) {
  return (
    <div className="border-t-2 border-[#efdf69] bg-[#f7f7f4] p-6 transition hover:-translate-y-1">
      <p className="text-xs font-black tracking-widest text-black/45">
        {number}
      </p>

      <h3 className="mt-5 text-lg font-extrabold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-black/60">
        {description}
      </p>
    </div>
  );
}

/* Feature Component */
function Feature({ title, description, icon }) {
  return (
    <div className="border border-black/10 bg-white p-5 transition hover:border-black/40">
      <div className="flex h-9 w-9 items-center justify-center bg-[#efdf69] text-xs font-black">
        {icon}
      </div>

      <h3 className="mt-5 font-extrabold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-black/60">
        {description}
      </p>
    </div>
  );
}
