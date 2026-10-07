import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Counters() {
  const navigate = useNavigate();

  const [manageCounter, setManageCounter] = useState(null);

  const counters = [
    {
      id: "C-01",
      office: "RTO Office",
      service: "Driving License",
      operator: "Operator 01",
      status: "ACTIVE",
      currentToken: "A-16",
    },
    {
      id: "C-02",
      office: "RTO Office",
      service: "Driving License",
      operator: "Operator 02",
      status: "ACTIVE",
      currentToken: "A-21",
    },
    {
      id: "C-03",
      office: "RTO Office",
      service: "Vehicle Registration",
      operator: "Operator 03",
      status: "PAUSED",
      currentToken: "-",
    },
    {
      id: "C-04",
      office: "RTO Office",
      service: "Document Verification",
      operator: "Operator 04",
      status: "ACTIVE",
      currentToken: "A-08",
    },
    {
      id: "C-05",
      office: "Municipal Office",
      service: "Birth Certificate",
      operator: "Operator 05",
      status: "ACTIVE",
      currentToken: "M-12",
    },
    {
      id: "C-06",
      office: "Municipal Office",
      service: "Property Tax",
      operator: "Operator 06",
      status: "ACTIVE",
      currentToken: "M-19",
    },
    {
      id: "C-07",
      office: "Municipal Office",
      service: "Property Tax",
      operator: "Operator 07",
      status: "PAUSED",
      currentToken: "-",
    },
    {
      id: "C-08",
      office: "Municipal Office",
      service: "Water Connection",
      operator: "Operator 08",
      status: "ACTIVE",
      currentToken: "M-25",
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
            Counters
          </h1>

          <p className="mt-2 text-slate-600">
            Monitor counters, assigned operators, services, and current
            tokens.
          </p>
        </section>

        {/* Summary */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Counters</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">8</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Active</p>
            <p className="mt-2 text-3xl font-bold text-green-600">6</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Paused</p>
            <p className="mt-2 text-3xl font-bold text-orange-500">2</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Currently Serving</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">6</p>
          </div>
        </section>

        {/* Counter Table */}
        <section className="mt-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Counter Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current counter assignments across all offices.
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Counter
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Office
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Service
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Operator
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Current Token
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
                  {counters.map((counter) => (
                    <tr
                      key={counter.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-5">
                        <span className="font-bold text-slate-900">
                          {counter.id}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-600">
                        {counter.office}
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-600">
                        {counter.service}
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-600">
                        {counter.operator}
                      </td>

                      <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                        {counter.currentToken}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            counter.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {counter.status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <button
                          type="button"
                          onClick={() => setManageCounter(counter)}
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

        {/* Info */}
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-3">
            <span className="text-xl">ℹ️</span>

            <div>
              <h3 className="font-semibold text-slate-900">
                Counter management
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Admins can manage counter assignments, services, operators,
                and counter status. Operators manage their queue activity
                from the Operator Portal.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Manage Counter Modal */}
      {manageCounter && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setManageCounter(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Manage Counter
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update counter assignment and status
                </p>
              </div>

              <button
                type="button"
                onClick={() => setManageCounter(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            {/* Form Content - Scrollable area */}
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {/* Counter ID */}
              <div>
                <label
                  htmlFor="counterId"
                  className="text-sm font-semibold text-slate-700"
                >
                  Counter ID
                </label>

                <input
                  id="counterId"
                  type="text"
                  value={manageCounter.id}
                  disabled
                  className="mt-2 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                />
              </div>

              {/* Government Office */}
              <div>
                <label
                  htmlFor="counterOffice"
                  className="text-sm font-semibold text-slate-700"
                >
                  Government Office
                </label>

                <select
                  id="counterOffice"
                  defaultValue={manageCounter.office}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="RTO Office">RTO Office</option>
                  <option value="Municipal Office">
                    Municipal Office
                  </option>
                </select>
              </div>

              {/* Service */}
              <div>
                <label
                  htmlFor="counterService"
                  className="text-sm font-semibold text-slate-700"
                >
                  Service
                </label>

                <select
                  id="counterService"
                  defaultValue={manageCounter.service}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Driving License">
                    Driving License
                  </option>

                  <option value="Vehicle Registration">
                    Vehicle Registration
                  </option>

                  <option value="Document Verification">
                    Document Verification
                  </option>

                  <option value="Birth Certificate">
                    Birth Certificate
                  </option>

                  <option value="Property Tax">
                    Property Tax
                  </option>

                  <option value="Water Connection">
                    Water Connection
                  </option>
                </select>
              </div>

              {/* Operator */}
              <div>
                <label
                  htmlFor="counterOperator"
                  className="text-sm font-semibold text-slate-700"
                >
                  Assigned Operator
                </label>

                <select
                  id="counterOperator"
                  defaultValue={manageCounter.operator}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Operator 01">Operator 01</option>
                  <option value="Operator 02">Operator 02</option>
                  <option value="Operator 03">Operator 03</option>
                  <option value="Operator 04">Operator 04</option>
                  <option value="Operator 05">Operator 05</option>
                  <option value="Operator 06">Operator 06</option>
                  <option value="Operator 07">Operator 07</option>
                  <option value="Operator 08">Operator 08</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="counterStatus"
                  className="text-sm font-semibold text-slate-700"
                >
                  Counter Status
                </label>

                <select
                  id="counterStatus"
                  defaultValue={manageCounter.status}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PAUSED">Paused</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {/* Current Token */}
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Current Token
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Token currently being handled
                    </p>
                  </div>

                  <span className="text-xl font-bold text-blue-600">
                    {manageCounter.currentToken}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex shrink-0 gap-3 border-t border-slate-200 p-6">
              <button
                type="button"
                onClick={() => setManageCounter(null)}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log("Save counter changes");
                  setManageCounter(null);
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