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
  createCounter,
  deleteCounter,
  getOfficeCounters,
  getOffices,
  updateCounter,
} from "../../services/adminApi";

const STATUSES = ["AVAILABLE", "PAUSED", "OFFLINE"];
const EMPTY_FORM = { name: "", number: "", status: "AVAILABLE" };

export default function Counters({ user, setUser }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [offices, setOffices] = useState([]);
  const [officesLoading, setOfficesLoading] = useState(true);
  const [officesError, setOfficesError] = useState("");

  const [counters, setCounters] = useState([]);
  const [countersLoading, setCountersLoading] = useState(false);
  const [countersError, setCountersError] = useState("");

  const [notice, setNotice] = useState("");

  const [formModal, setFormModal] = useState(null); // { mode: "create" } | { mode: "edit", counter }
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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

  const loadCounters = useCallback(async () => {
    if (!officeId) return;
    setCountersLoading(true);
    setCountersError("");
    try {
      const list = await getOfficeCounters(officeId);
      setCounters([...list].sort((a, b) => (a.number ?? 0) - (b.number ?? 0)));
    } catch (err) {
      setCountersError(err.message);
    } finally {
      setCountersLoading(false);
    }
  }, [officeId]);

  useEffect(() => {
    loadOffices();
  }, [loadOffices]);

  useEffect(() => {
    loadCounters();
  }, [loadCounters]);

  function openCreate() {
    const nextNumber = counters.reduce((max, c) => Math.max(max, c.number ?? 0), 0) + 1;
    setForm({ name: `Counter ${nextNumber}`, number: String(nextNumber), status: "AVAILABLE" });
    setFormError("");
    setFormModal({ mode: "create" });
  }

  function openEdit(counter) {
    setForm({
      name: counter.name || "",
      number: String(counter.number ?? ""),
      status: counter.status || "AVAILABLE",
    });
    setFormError("");
    setFormModal({ mode: "edit", counter });
  }

  function closeForm() {
    if (!saving) setFormModal(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const number = Number(form.number);

    if (!name) return setFormError("Counter name is required.");
    if (!Number.isInteger(number) || number < 1) {
      return setFormError("Counter number must be a whole number of at least 1.");
    }

    setSaving(true);
    setFormError("");

    try {
      const result =
        formModal.mode === "edit"
          ? await updateCounter(formModal.counter._id, { name, number, status: form.status })
          : await createCounter(officeId, { name, number });

      setFormModal(null);
      setNotice(result.message || "Saved.");
      await loadCounters();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError("");

    try {
      const result = await deleteCounter(toDelete._id);
      setToDelete(null);
      setNotice(result.message || "Counter deleted.");
      await loadCounters();
    } catch (err) {
      // e.g. 409 when the counter has a CALLED/SERVING token
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminLayout user={user} setUser={setUser}>
      <PageHeader
        title="Counters"
        description="Create and manage the service counters of each office."
        action={
          selectedOffice && (
            <button type="button" onClick={openCreate} className={primaryBtn}>
              + Add counter
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
          <EmptyState icon="🏛️" title="No offices found" description="Counters belong to an office, and none were returned by the backend." />
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

            {countersLoading && <LoadingBlock label="Loading counters..." />}
            {!countersLoading && countersError && (
              <ErrorBlock message={countersError} onRetry={loadCounters} />
            )}

            {!countersLoading && !countersError && counters.length === 0 && (
              <EmptyState
                icon="🖥️"
                title="No counters yet"
                description={`${selectedOffice.name} has no counters. Create one to get started.`}
                action={
                  <button type="button" onClick={openCreate} className={primaryBtn}>
                    + Add counter
                  </button>
                }
              />
            )}

            {!countersLoading && !countersError && counters.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {counters.map((counter) => (
                  <article
                    key={counter._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Counter #{counter.number}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">{counter.name}</h3>
                      </div>
                      <StatusBadge status={counter.status} />
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
                      <p className="text-slate-500">Current token</p>
                      {counter.currentTokenId ? (
                        <p className="mt-1 flex items-center gap-2 font-semibold text-slate-900">
                          {counter.currentTokenId.tokenNumber}
                          <StatusBadge status={counter.currentTokenId.status} />
                        </p>
                      ) : (
                        <p className="mt-1 text-slate-400">None</p>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button type="button" onClick={() => openEdit(counter)} className={smallBtn}>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError("");
                          setToDelete(counter);
                        }}
                        className={smallDangerBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {formModal && (
        <Modal
          title={formModal.mode === "edit" ? "Edit counter" : "Add counter"}
          subtitle={selectedOffice?.name}
          onClose={closeForm}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5 p-6">
              {formError && <Alert>{formError}</Alert>}

              <div>
                <label htmlFor="counterName" className={labelClass}>Counter name</label>
                <input
                  id="counterName"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={saving}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="counterNumber" className={labelClass}>Counter number</label>
                <input
                  id="counterNumber"
                  type="number"
                  min="1"
                  step="1"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  disabled={saving}
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-500">Must be unique within the office.</p>
              </div>

              {formModal.mode === "edit" && (
                <div>
                  <label htmlFor="counterStatus" className={labelClass}>Status</label>
                  <select
                    id="counterStatus"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    disabled={saving}
                    className={inputClass}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 border-t border-slate-200 p-6">
              <button type="button" onClick={closeForm} disabled={saving} className={`${secondaryBtn} flex-1`}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className={`${primaryBtn} flex-1`}>
                {saving ? "Saving..." : formModal.mode === "edit" ? "Save changes" : "Create counter"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete counter?"
          message={`"${toDelete.name}" (#${toDelete.number}) will be permanently deleted. A counter that is currently calling or serving a token cannot be deleted.`}
          confirmLabel="Delete counter"
          busy={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </AdminLayout>
  );
}
