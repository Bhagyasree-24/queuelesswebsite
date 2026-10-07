import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Offices() {
  const navigate = useNavigate();

  const [selectedOffice, setSelectedOffice] = useState(null);
  const [manageOffice, setManageOffice] = useState(null);

  const offices = [
    {
      id: "rto-office",
      name: "RTO Office",
      location: "Main City Office",
      services: [
        "Driving License",
        "Vehicle Registration",
        "Document Verification",
      ],
      counters: [
        {
          id: "C-01",
          service: "Driving License",
          operator: "Operator 01",
          status: "ACTIVE",
        },
        {
          id: "C-02",
          service: "Driving License",
          operator: "Operator 02",
          status: "ACTIVE",
        },
        {
          id: "C-03",
          service: "Vehicle Registration",
          operator: "Operator 03",
          status: "PAUSED",
        },
        {
          id: "C-04",
          service: "Document Verification",
          operator: "Operator 04",
          status: "ACTIVE",
        },
      ],
      staff: [
        "Operator 01",
        "Operator 02",
        "Operator 03",
        "Operator 04",
      ],
      status: "ACTIVE",
    },

    {
      id: "municipal-office",
      name: "Municipal Office",
      location: "Central Municipal Office",
      services: [
        "Birth Certificate",
        "Property Tax",
        "Water Connection",
      ],
      counters: [
        {
          id: "C-05",
          service: "Birth Certificate",
          operator: "Operator 05",
          status: "ACTIVE",
        },
        {
          id: "C-06",
          service: "Property Tax",
          operator: "Operator 06",
          status: "ACTIVE",
        },
        {
          id: "C-07",
          service: "Property Tax",
          operator: "Operator 07",
          status: "PAUSED",
        },
        {
          id: "C-08",
          service: "Water Connection",
          operator: "Operator 08",
          status: "ACTIVE",
        },
      ],
      staff: [
        "Operator 05",
        "Operator 06",
        "Operator 07",
        "Operator 08",
      ],
      status: "ACTIVE",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-slate-900">Queue</span>
            <span className="text-blue-600">Less</span>
          </button>

          {/* Dashboard */}
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Government Offices
          </h1>

          <p className="mt-2 text-slate-600">
            View and manage the government offices available in QueueLess.
          </p>
        </section>

        {/* ================= SUMMARY ================= */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Offices</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              2
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Active Offices</p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              2
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Counters</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              8
            </p>
          </div>
        </section>

        {/* ================= OFFICES ================= */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Available Offices
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Currently configured government offices
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {offices.map((office) => (
              <div
                key={office.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                {/* Office Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-xl">
                      🏛️
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {office.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {office.location}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {office.status}
                  </span>
                </div>

                {/* Office Stats */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-50 p-4 text-center">
                    <p className="text-xl font-bold text-slate-900">
                      {office.services.length}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Services
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 text-center">
                    <p className="text-xl font-bold text-slate-900">
                      {office.counters.length}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Counters
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 text-center">
                    <p className="text-xl font-bold text-slate-900">
                      {office.staff.length}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Staff
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  {/* View Details */}
                  <button
                    type="button"
                    onClick={() => setSelectedOffice(office)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
                  >
                    View Details
                  </button>

                  {/* Manage */}
                  <button
                    type="button"
                    onClick={() => setManageOffice(office)}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* VIEW DETAILS MODAL */}
      {/* ========================================================= */}

      {selectedOffice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setSelectedOffice(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-xl">
                  🏛️
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedOffice.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedOffice.location}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOffice(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-6 p-6">
              {/* Status */}
              <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
                <span className="font-medium text-slate-700">
                  Office Status
                </span>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {selectedOffice.status}
                </span>
              </div>

              {/* Services */}
              <div>
                <h3 className="font-bold text-slate-900">
                  Services
                </h3>

                <div className="mt-3 space-y-2">
                  {selectedOffice.services.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                    >
                      <span className="text-blue-600">📋</span>

                      <span className="text-sm font-medium text-slate-700">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Counters */}
              <div>
                <h3 className="font-bold text-slate-900">
                  Counters
                </h3>

                <div className="mt-3 space-y-2">
                  {selectedOffice.counters.map((counter) => (
                    <div
                      key={counter.id}
                      className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {counter.id}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {counter.service} • {counter.operator}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                          counter.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {counter.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff */}
              <div>
                <h3 className="font-bold text-slate-900">
                  Assigned Staff
                </h3>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {selectedOffice.staff.map((member) => (
                    <div
                      key={member}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-sm font-semibold text-blue-600">
                        O
                      </div>

                      <span className="text-sm font-medium text-slate-700">
                        {member}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-6">
              <button
                type="button"
                onClick={() => setSelectedOffice(null)}
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MANAGE OFFICE MODAL */}
      {/* ========================================================= */}

      {manageOffice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setManageOffice(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Manage Office
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update office information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setManageOffice(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 p-6">
              {/* Office Name */}
              <div>
                <label
                  htmlFor="officeName"
                  className="text-sm font-semibold text-slate-700"
                >
                  Office Name
                </label>

                <input
                  id="officeName"
                  type="text"
                  defaultValue={manageOffice.name}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="officeLocation"
                  className="text-sm font-semibold text-slate-700"
                >
                  Location
                </label>

                <input
                  id="officeLocation"
                  type="text"
                  defaultValue={manageOffice.location}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="officeStatus"
                  className="text-sm font-semibold text-slate-700"
                >
                  Office Status
                </label>

                <select
                  id="officeStatus"
                  defaultValue={manageOffice.status}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {/* Existing Resources */}
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Current Configuration
                </p>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-white p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      {manageOffice.services.length}
                    </p>

                    <p className="text-xs text-slate-500">
                      Services
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      {manageOffice.counters.length}
                    </p>

                    <p className="text-xs text-slate-500">
                      Counters
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">
                      {manageOffice.staff.length}
                    </p>

                    <p className="text-xs text-slate-500">
                      Staff
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-slate-200 p-6">
              <button
                type="button"
                onClick={() => setManageOffice(null)}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log("Save office changes");
                  setManageOffice(null);
                }}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white transition hover:from-blue-700 hover:from-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}