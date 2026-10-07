import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CitizenHome() {
  const navigate = useNavigate();

  const [showAccount, setShowAccount] = useState(false);

  const offices = [
    {
      id: "rto-office",
      name: "RTO Office",
      description: "Transport and vehicle related services",
      icon: "🚗",
    },
    {
      id: "municipal-office",
      name: "Municipal Office",
      description: "Municipal and civic services",
      icon: "🏛️",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/citizen")}
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-slate-900">Queue</span>
            <span className="text-blue-600">Less</span>
          </button>

          {/* Account Button */}
          <button
            type="button"
            onClick={() => setShowAccount(true)}
            className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-slate-100 sm:gap-3 sm:px-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 font-semibold text-blue-600">
              N
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-900">
                Nithin Kumar
              </p>

              <p className="text-xs text-slate-500">
                Citizen
              </p>
            </div>

            <span className="text-xs text-slate-400">
              ▼
            </span>
          </button>
        </div>
      </header>

      {/* Account Sliding Window */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          showAccount
            ? "visible bg-slate-900/30"
            : "invisible bg-transparent"
        }`}
        onClick={() => setShowAccount(false)}
      >

        {/* Sliding Panel */}
        <aside
          onClick={(event) => event.stopPropagation()}
          className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            showAccount
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >

          {/* Panel Header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">

            <h2 className="text-lg font-bold text-slate-900">
              Account
            </h2>

            <button
              type="button"
              onClick={() => setShowAccount(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              ×
            </button>

          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-5">

            {/* User Card */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-lg font-bold text-blue-600">
                  N
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-slate-900">
                    Nithin Kumar
                  </h3>

                  <p className="truncate text-sm text-slate-500">
                    citizen@example.com
                  </p>
                </div>

              </div>

              <span className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                Citizen
              </span>

            </div>

            {/* Account Options */}
            <div className="mt-6">

              <button
                type="button"
                className="flex w-full items-center rounded-xl px-4 py-3 text-left font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <span className="mr-3 text-lg">
                  👤
                </span>

                My Account
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log("Logout");
                }}
                className="mt-1 flex w-full items-center rounded-xl px-4 py-3 text-left font-medium text-red-600 transition hover:bg-red-50"
              >
                <span className="mr-3 text-lg">
                  ↪
                </span>

                Logout
              </button>

            </div>

          </div>

        </aside>
      </div>

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
            Choose a government office to view its available services and
            join the virtual queue.
          </p>
        </section>

        {/* Government Offices */}
        <section className="mt-10">

          <h2 className="text-xl font-bold text-slate-900">
            Government Offices
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            {offices.map((office) => (
              <button
                key={office.id}
                type="button"
                onClick={() =>
                  navigate(`/citizen/offices/${office.id}/services`)
                }
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-2xl">
                    {office.icon}
                  </div>

                  <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                    →
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {office.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {office.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-blue-600">
                  View services →
                </p>

              </button>
            ))}

          </div>
        </section>

        {/* Active Token */}
        <section className="mt-12">

          <h2 className="text-xl font-bold text-slate-900">
            Your active token
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">

            <div className="py-6 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🎟️
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No active token
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Choose an office and service to get a virtual token and
                track your place in the queue.
              </p>

            </div>

          </div>
        </section>

      </main>
    </div>
  );
}