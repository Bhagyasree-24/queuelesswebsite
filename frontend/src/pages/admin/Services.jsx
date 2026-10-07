import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();

  const [manageService, setManageService] = useState(null);

  const services = [
    {
      id: 1,
      name: "Driving License",
      office: "RTO Office",
      averageTime: 10,
      counters: 2,
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Vehicle Registration",
      office: "RTO Office",
      averageTime: 15,
      counters: 1,
      status: "ACTIVE",
    },
    {
      id: 3,
      name: "Document Verification",
      office: "RTO Office",
      averageTime: 5,
      counters: 1,
      status: "ACTIVE",
    },
    {
      id: 4,
      name: "Birth Certificate",
      office: "Municipal Office",
      averageTime: 8,
      counters: 1,
      status: "ACTIVE",
    },
    {
      id: 5,
      name: "Property Tax",
      office: "Municipal Office",
      averageTime: 12,
      counters: 2,
      status: "ACTIVE",
    },
    {
      id: 6,
      name: "Water Connection",
      office: "Municipal Office",
      averageTime: 10,
      counters: 1,
      status: "ACTIVE",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-slate-900">Queue</span>
            <span className="text-blue-600">Less</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Services
          </h1>

          <p className="mt-2 text-slate-600">
            Manage the services offered by each government office.
          </p>
        </section>

        {/* Summary */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Services</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">6</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Active Services</p>
            <p className="mt-2 text-3xl font-bold text-green-600">6</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Average Service Time
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              10 min
            </p>
          </div>
        </section>

        {/* Services Table */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900">
            Available Services
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Services currently configured in QueueLess.
          </p>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Service
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Office
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Avg. Time
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Counters
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {services.map((service) => (
                    <tr
                      key={service.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">
                            📋
                          </div>

                          <span className="font-semibold text-slate-900">
                            {service.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-600">
                        {service.office}
                      </td>

                      <td className="px-5 py-5 text-sm font-medium text-slate-700">
                        {service.averageTime} min
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-600">
                        {service.counters}
                      </td>

                      <td className="px-5 py-5">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          {service.status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <button
                          type="button"
                          onClick={() => setManageService(service)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Manage Service Modal */}
      {manageService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setManageService(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Manage Service
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update service configuration
                </p>
              </div>

              <button
                type="button"
                onClick={() => setManageService(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5 p-6">
              {/* Service Name */}
              <div>
                <label
                  htmlFor="serviceName"
                  className="text-sm font-semibold text-slate-700"
                >
                  Service Name
                </label>

                <input
                  id="serviceName"
                  type="text"
                  defaultValue={manageService.name}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Office */}
              <div>
                <label
                  htmlFor="serviceOffice"
                  className="text-sm font-semibold text-slate-700"
                >
                  Government Office
                </label>

                <select
                  id="serviceOffice"
                  defaultValue={manageService.office}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="RTO Office">RTO Office</option>
                  <option value="Municipal Office">
                    Municipal Office
                  </option>
                </select>
              </div>

              {/* Average Time */}
              <div>
                <label
                  htmlFor="averageTime"
                  className="text-sm font-semibold text-slate-700"
                >
                  Average Service Time
                </label>

                <div className="mt-2 flex">
                  <input
                    id="averageTime"
                    type="number"
                    min="1"
                    defaultValue={manageService.averageTime}
                    className="w-full rounded-l-xl border border-r-0 border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <span className="flex items-center rounded-r-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500">
                    min
                  </span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="serviceStatus"
                  className="text-sm font-semibold text-slate-700"
                >
                  Service Status
                </label>

                <select
                  id="serviceStatus"
                  defaultValue={manageService.status}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {/* Counters */}
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Assigned Counters
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Counters currently handling this service
                    </p>
                  </div>

                  <span className="text-2xl font-bold text-blue-600">
                    {manageService.counters}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-slate-200 p-6">
              <button
                type="button"
                onClick={() => setManageService(null)}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log("Save service changes");
                  setManageService(null);
                }}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
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