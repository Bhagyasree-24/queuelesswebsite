import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Staff() {
  const navigate = useNavigate();

  // State to handle modal visibility and editing
  const [manageStaff, setManageStaff] = useState(null);

  // Replaced custom `id` ("ST-001") with standard DB `_id`
  const [staffList, setStaffList] = useState([
    {
      _id: "6501a01",
      name: "Operator 01",
      email: "operator01@example.com",
      office: "RTO Office",
      counter: "C-01",
      status: "ACTIVE",
    },
    {
      _id: "6501a02",
      name: "Operator 02",
      email: "operator02@example.com",
      office: "RTO Office",
      counter: "C-02",
      status: "ACTIVE",
    },
    {
      _id: "6501a03",
      name: "Operator 03",
      email: "operator03@example.com",
      office: "RTO Office",
      counter: "C-03",
      status: "PAUSED",
    },
    {
      _id: "6501a04",
      name: "Operator 04",
      email: "operator04@example.com",
      office: "RTO Office",
      counter: "C-04",
      status: "ACTIVE",
    },
    {
      _id: "6501a05",
      name: "Operator 05",
      email: "operator05@example.com",
      office: "Municipal Office",
      counter: "C-05",
      status: "ACTIVE",
    },
    {
      _id: "6501a06",
      name: "Operator 06",
      email: "operator06@example.com",
      office: "Municipal Office",
      counter: "C-06",
      status: "ACTIVE",
    },
    {
      _id: "6501a07",
      name: "Operator 07",
      email: "operator07@example.com",
      office: "Municipal Office",
      counter: "C-07",
      status: "PAUSED",
    },
    {
      _id: "6501a08",
      name: "Operator 08",
      email: "operator08@example.com",
      office: "Municipal Office",
      counter: "C-08",
      status: "ACTIVE",
    },
  ]);

  // Handle saving changes from the modal form
  const handleSave = (e) => {
    e.preventDefault();
    setStaffList((prev) =>
      prev.map((item) => (item._id === manageStaff._id ? manageStaff : item))
    );
    setManageStaff(null);
  };

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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Staff
          </h1>

          <p className="mt-2 text-slate-600">
            Manage government staff and their office and counter assignments.
          </p>
        </section>

        {/* Summary Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Staff</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {staffList.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Active</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {staffList.filter((s) => s.status === "ACTIVE").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Paused</p>
            <p className="mt-2 text-3xl font-bold text-orange-500">
              {staffList.filter((s) => s.status === "PAUSED").length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Assigned Counters</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {staffList.filter((s) => s.counter && s.counter !== "-").length}
            </p>
          </div>
        </section>

        {/* Staff Table */}
        <section className="mt-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Staff Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current operators and their assignments.
            </p>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Staff
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Email
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Office
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-slate-600">
                      Counter
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
                  {staffList.map((member, index) => (
                    <tr
                      key={member._id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 font-semibold text-blue-600">
                            {member.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {member.name}
                            </p>

                            {/* Dynamic Display Tag (No need for custom ST-XXX in database) */}
                            <p className="mt-0.5 text-xs text-slate-500">
                              ID: #{String(index + 1).padStart(3, "0")}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-600">
                        {member.email}
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-600">
                        {member.office}
                      </td>

                      <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                        {member.counter}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            member.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <button
                          type="button"
                          onClick={() => setManageStaff({ ...member })}
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
                Staff assignments
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Each operator is assigned to a government office and counter.
                Operators manage queue activity from the Operator Portal.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Manage Staff Modal */}
      {manageStaff && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setManageStaff(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Manage Staff Member
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update staff details and assignments
                </p>
              </div>

              <button
                type="button"
                onClick={() => setManageStaff(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ×
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSave} className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 space-y-5 overflow-y-auto p-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="staffName"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="staffName"
                    type="text"
                    value={manageStaff.name}
                    onChange={(e) =>
                      setManageStaff({ ...manageStaff, name: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="staffEmail"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="staffEmail"
                    type="email"
                    value={manageStaff.email}
                    onChange={(e) =>
                      setManageStaff({ ...manageStaff, email: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                {/* Government Office */}
                <div>
                  <label
                    htmlFor="staffOffice"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Assigned Office
                  </label>
                  <select
                    id="staffOffice"
                    value={manageStaff.office}
                    onChange={(e) =>
                      setManageStaff({ ...manageStaff, office: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="RTO Office">RTO Office</option>
                    <option value="Municipal Office">Municipal Office</option>
                  </select>
                </div>

                {/* Counter Assignment */}
                <div>
                  <label
                    htmlFor="staffCounter"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Assigned Counter
                  </label>
                  <select
                    id="staffCounter"
                    value={manageStaff.counter}
                    onChange={(e) =>
                      setManageStaff({ ...manageStaff, counter: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="C-01">C-01</option>
                    <option value="C-02">C-02</option>
                    <option value="C-03">C-03</option>
                    <option value="C-04">C-04</option>
                    <option value="C-05">C-05</option>
                    <option value="C-06">C-06</option>
                    <option value="C-07">C-07</option>
                    <option value="C-08">C-08</option>
                  </select>
                </div>

                {/* Account Status */}
                <div>
                  <label
                    htmlFor="staffStatus"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Account Status
                  </label>
                  <select
                    id="staffStatus"
                    value={manageStaff.status}
                    onChange={(e) =>
                      setManageStaff({ ...manageStaff, status: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex shrink-0 gap-3 border-t border-slate-200 p-6">
                <button
                  type="button"
                  onClick={() => setManageStaff(null)}
                  className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white transition hover:from-blue-700 hover:to-purple-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}