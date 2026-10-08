import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Alert,
  ConfirmDialog,
  EmptyState,
  ErrorBlock,
  LoadingBlock,
  Modal,
  PageHeader,
  StatusBadge,
  inputClass,
  labelClass,
  primaryBtn,
  secondaryBtn,
  smallBtn,
  smallDangerBtn,
} from "../../components/admin/AdminUi";
import {
  createService,
  deactivateService,
  getOfficeServices,
  getOffices,
  updateService,
} from "../../services/adminApi";

const EMPTY_FORM = { name: "", description: "", averageServiceTime: "" };

export default function Services({ user, setUser }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [offices, setOffices] = useState([]);
  const [officesLoading, setOfficesLoading] = useState(true);
  const [officesError, setOfficesError] = useState("");

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState("");

  const [notice, setNotice] = useState("");

  // form modal: null | { mode: "create" } | { mode: "edit", service }
  const [formModal, setFormModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // deactivate confirm
  const [toDeactivate, setToDeactivate] = useState(null);
  const [deactivating, setDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState("");

  // selected office comes from ?office=ID, falling back to the first office
  const requested = searchParams.get("office");
  const selectedOffice =
    offices.find((o) => o._id === requested) || offices[0] || null;
  const officeId = selectedOffice?._id;

  const loadOffices = useCallback(async () => {
    setOfficesLoading(true);
    setOfficesError("");
    try {
      setOffices(await getOffices());
    } catch (err) {
      setOfficesError(err.message);
    } finally {
      setOfficesLoading(false);
    }
  }, []);

  const loadServices = useCallback(async () => {
    if (!officeId) return;
    setServicesLoading(true);
    setServicesError("");
    try {
      setServices(await getOfficeServices(officeId));
    } catch (err) {
      setServicesError(err.message);
    } finally {
      setServicesLoading(false);
    }
  }, [officeId]);

  useEffect(() => {
    loadOffices();
  }, [loadOffices]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setFormError("");
    setFormModal({ mode: "create" });
  }

  function openEdit(service) {
    setForm({
      name: service.name || "",
      description: service.description || "",
      averageServiceTime: String(service.averageServiceTime ?? ""),
    });
    setFormError("");
    setFormModal({ mode: "edit", service });
  }

  function closeForm() {
    if (!saving) setFormModal(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const time = Number(form.averageServiceTime);

    if (!name) return setFormError("Service name is required.");
    if (!Number.isInteger(time) || time < 1) {
      return setFormError("Average service time must be a whole number of at least 1 minute.");
    }

    const body = {
      name,
      description: form.description.trim(),
      averageServiceTime: time,
    };

    setSaving(true);
    setFormError("");

    try {
      const result =
        formModal.mode === "edit"
          ? await updateService(formModal.service._id, body)
          : await createService(officeId, body);

      setFormModal(null);
      setNotice(result.message || "Saved.");
      await loadServices();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate() {
    setDeactivating(true);
    setDeactivateError("");

    try {
      const result = await deactivateService(toDeactivate._id);
      setToDeactivate(null);
      setNotice(result.message || "Service deactivated.");
      await loadServices();
    } catch (err) {
      setDeactivateError(err.message);
    } finally {
      setDeactivating(false);
    }
  }

  return (
    <AdminLayout user={user} setUser={setUser}>
      <PageHeader
        title="Services"
        description="Manage the services offered by each government office."
        action={
          selectedOffice && (
            <button type="button" onClick={openCreate} className={primaryBtn}>
              + Add service
            </button>
          )
        }
      />

      <div className="mt-8 space-y-6">
        {notice && (
          <Alert type="success" onClose={() => setNotice("")}>
            {notice}
          </Alert>
        )}

        {officesLoading && <LoadingBlock label="Loading offices..." />}
        {!officesLoading && officesError && (
          <ErrorBlock message={officesError} onRetry={loadOffices} />
        )}

        {!officesLoading && !officesError && offices.length === 0 && (
          <EmptyState icon="🏛️" title="No offices found" description="Services belong to an office, and none were returned by the backend." />
        )}

        {selectedOffice && (
          <>
            <div className="max-w-sm">
              <label htmlFor="officeSelect" className={labelClass}>
                Government office
              </label>
              <select
                id="officeSelect"
                value={officeId}
                onChange={(e) => setSearchParams({ office: e.target.value })}
                className={inputClass}
              >
                {offices.map((office) => (
                  <option key={office._id} value={office._id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-sm text-slate-500">
              Only active services are listed. A deactivated service is hidden from
              citizens and from this list.
            </p>

            {servicesLoading && <LoadingBlock label="Loading services..." />}
            {!servicesLoading && servicesError && (
              <ErrorBlock message={servicesError} onRetry={loadServices} />
            )}

            {!servicesLoading && !servicesError && services.length === 0 && (
              <EmptyState
                icon="📋"
                title="No active services"
                description={`${selectedOffice.name} has no active services yet.`}
                action={
                  <button type="button" onClick={openCreate} className={primaryBtn}>
                    + Add service
                  </button>
                }
              />
            )}

            {!servicesLoading && !servicesError && services.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600">
                        <th className="px-5 py-4">Service</th>
                        <th className="px-5 py-4">Office</th>
                        <th className="px-5 py-4">Avg. service time</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service._id} className="border-b border-slate-100 last:border-0">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900">{service.name}</p>
                            {service.description && (
                              <p className="mt-1 max-w-sm text-sm text-slate-500">
                                {service.description}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {selectedOffice.name}
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-slate-700">
                            {service.averageServiceTime} min
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={service.isActive ? "ACTIVE" : "INACTIVE"} />
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button type="button" onClick={() => openEdit(service)} className={smallBtn}>
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDeactivateError("");
                                  setToDeactivate(service);
                                }}
                                className={smallDangerBtn}
                              >
                                Deactivate
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {formModal && (
        <Modal
          title={formModal.mode === "edit" ? "Edit service" : "Add service"}
          subtitle={selectedOffice?.name}
          onClose={closeForm}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5 p-6">
              {formError && <Alert>{formError}</Alert>}

              <div>
                <label htmlFor="serviceName" className={labelClass}>Service name</label>
                <input
                  id="serviceName"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={saving}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="serviceDescription" className={labelClass}>
                  Description <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="serviceDescription"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  disabled={saving}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="serviceTime" className={labelClass}>Average service time (minutes)</label>
                <input
                  id="serviceTime"
                  type="number"
                  min="1"
                  step="1"
                  value={form.averageServiceTime}
                  onChange={(e) => setForm({ ...form, averageServiceTime: e.target.value })}
                  disabled={saving}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-200 p-6">
              <button type="button" onClick={closeForm} disabled={saving} className={`${secondaryBtn} flex-1`}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className={`${primaryBtn} flex-1`}>
                {saving ? "Saving..." : formModal.mode === "edit" ? "Save changes" : "Create service"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toDeactivate && (
        <ConfirmDialog
          title="Deactivate service?"
          message={`"${toDeactivate.name}" will be marked inactive and will no longer be offered to citizens. The service record is kept; it is not permanently deleted.`}
          confirmLabel="Deactivate"
          busy={deactivating}
          error={deactivateError}
          onConfirm={handleDeactivate}
          onCancel={() => setToDeactivate(null)}
        />
      )}
    </AdminLayout>
  );
}
