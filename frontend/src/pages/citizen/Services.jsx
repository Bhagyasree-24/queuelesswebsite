import { useNavigate, useParams } from "react-router-dom";

export default function Services() {
  const navigate = useNavigate();
  const { officeId } = useParams();

  const offices = {
    "rto-office": {
      name: "RTO Office",
      icon: "🚗",
      description: "Transport and vehicle related services",
    },
    "municipal-office": {
      name: "Municipal Office",
      icon: "🏛️",
      description: "Municipal and civic services",
    },
  };

  const services = [
    {
      id: "driving-license",
      name: "Driving License",
      description: "Apply for or renew your driving license",
      averageTime: 10,
    },
    {
      id: "vehicle-registration",
      name: "Vehicle Registration",
      description: "Register or update your vehicle details",
      averageTime: 15,
    },
    {
      id: "document-verification",
      name: "Document Verification",
      description: "Verify documents for government services",
      averageTime: 5,
    },
  ];

  const office = offices[officeId] || offices["rto-office"];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/citizen")}
            className="text-2xl font-bold tracking-tight"
          >
            <span className="text-slate-900">Queue</span>
            <span className="text-blue-600">Less</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/citizen")}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Office Header */}
        <section>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-2xl">
              {office.icon}
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Government Office
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
                {office.name}
              </h1>

              <p className="mt-2 text-slate-600">
                {office.description}
              </p>
            </div>
          </div>
        </section>

        {/* Peak Hours */}
        <section className="mt-8">
          <button
            type="button"
            onClick={() =>
              navigate(`/citizen/offices/${officeId}/crowd`)
            }
            className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 text-xl">
                  📊
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Check Peak Hours
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Find the best time to visit with lower crowd levels
                  </p>
                </div>
              </div>

              <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                →
              </span>
            </div>
          </button>
        </section>

        {/* Services */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Available Services
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a service to view the current queue.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() =>
                  navigate(
                    `/citizen/offices/${officeId}/services/${service.id}/queue`
                  )
                }
                className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-xl">
                    📄
                  </div>

                  <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {service.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-sm text-slate-500">
                    Avg. service time
                  </span>

                  <span className="font-semibold text-blue-600">
                    ~{service.averageTime} min
                  </span>
                </div>

                <p className="mt-4 text-sm font-semibold text-blue-600">
                  View queue →
                </p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}