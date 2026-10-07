import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background decoration */}
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">

          {/* Hero Content */}
          <div>
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-700">
              Smart Government Services
            </span>

            <h1 className="mt-6 max-w-2xl text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
              Skip the queue.
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Save your time.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Get a virtual token before visiting a government office.
              Track your queue position and know approximately when your
              turn will arrive.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Get a Token
              </Link>

              <a
                href="#how-it-works"
                className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-center font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
              >
                How it works
              </a>
            </div>

            {/* Small benefits */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
              <span>✓ Less waiting</span>
              <span>✓ Live queue status</span>
              <span>✓ Easy to use</span>
            </div>
          </div>

          {/* Queue Preview */}
          <div className="relative mx-auto w-full max-w-md">

            {/* Glow */}
            <div className="absolute inset-4 rounded-3xl bg-gradient-to-r from-blue-300/30 to-purple-300/30 blur-2xl" />

            <div className="relative rounded-3xl border border-white/80 bg-white/90 p-6 shadow-2xl shadow-blue-100 backdrop-blur">

              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                    🏛️
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Current queue
                    </p>

                    <h2 className="font-bold text-slate-900">
                      Service Counter
                    </h2>
                  </div>
                </div>

                <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Live
                </span>
              </div>

              <div className="my-6 h-px bg-slate-100" />

              {/* Token */}
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Your Token
                </p>

                <p className="mt-2 text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  A-24
                </p>
              </div>

              {/* Stats */}
              <div className="mt-7 grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-blue-50 p-4">
                  <p className="text-sm text-slate-500">
                    People ahead
                  </p>

                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    8
                  </p>
                </div>

                <div className="rounded-2xl bg-purple-50 p-4">
                  <p className="text-sm text-slate-500">
                    Estimated wait
                  </p>

                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    20
                    <span className="ml-1 text-base font-medium">
                      min
                    </span>
                  </p>
                </div>

              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex gap-1.5">
                  <span className="h-2 flex-1 rounded-full bg-blue-600" />
                  <span className="h-2 flex-1 rounded-full bg-blue-500" />
                  <span className="h-2 flex-1 rounded-full bg-purple-500" />
                  <span className="h-2 flex-1 rounded-full bg-slate-200" />
                  <span className="h-2 flex-1 rounded-full bg-slate-200" />
                </div>

                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  Queue is moving
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-white py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">
            <span className="rounded-full bg-purple-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-purple-700">
              Simple Process
            </span>

            <h2 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">
              How QueueLess{" "}
              <span className="text-purple-600">works</span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Get your virtual token in just a few simple steps.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <Step
              number="01"
              title="Choose an office"
              description="Select the government office you need to visit."
              color="blue"
            />

            <Step
              number="02"
              title="Choose a service"
              description="Select the service you want from that office."
              color="purple"
            />

            <Step
              number="03"
              title="Get your token"
              description="Take a virtual token and track your queue remotely."
              color="pink"
            />

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Everything you need to wait smarter
            </h2>

            <p className="mt-3 text-slate-600">
              QueueLess makes government office visits simpler.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <Feature
              title="Virtual Token"
              description="Get your place in the queue without standing there."
              bg="bg-green-50"
              icon="🎟️"
            />

            <Feature
              title="Live Queue"
              description="See how many people are currently ahead of you."
              bg="bg-blue-50"
              icon="📊"
            />

            <Feature
              title="Estimated Wait"
              description="Get an approximate idea of your waiting time."
              bg="bg-amber-50"
              icon="⏱️"
            />

            <Feature
              title="Turn Alerts"
              description="Know when your turn is getting closer."
              bg="bg-pink-50"
              icon="🔔"
            />

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          QueueLess — Smart Virtual Queue Management
        </div>
      </footer>
    </div>
  );
}


/* Step Component */

function Step({ number, title, description, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    pink: "bg-pink-100 text-pink-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start gap-4">

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold ${colors[color]}`}
        >
          {number}
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
}


/* Feature Component */

function Feature({ title, description, bg, icon }) {
  return (
    <div
      className={`rounded-2xl p-6 ${bg} transition hover:-translate-y-1`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}