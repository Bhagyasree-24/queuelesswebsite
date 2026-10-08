import { useCallback, useEffect, useState } from "react";
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
  assignStaff,
  createStaff,
  deleteStaff,
  getOfficeCounters,
  getOffices,
  getStaff,
  updateStaff,
} from "../../services/adminApi";

// staffId is the MongoDB User._id
const staffIdOf = (member) => member._id || member.id;

/**
 * Office + counter pickers. The counter list is loaded from the selected
 * office only, so a counter from another office can never be chosen.
 */
function AssignmentFields({ offices, officeId, counterId, onChange, disabled }) {
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!officeId) {
      setCounters([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    getOfficeCounters(officeId)
      .then((list) => {
        if (!cancelled) {
          setCounters([...list].sort((a, b) => (a.number ?? 0) - (b.number ?? 0)));
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [officeId]);

  return (
    <>
      <div>
        <label htmlFor="assignOffice" className={labelClass}>Office</label>
        <select
          id="assignOffice"
          value={officeId}
          onChange={(e) => onChange(e.target.value, "")}
          disabled={disabled}
          className={inputClass}
        >
          <option value="">Select an office</option>
          {offices.map((office) => (
            <option key={office._id} value={office._id}>{office.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="assignCounter" className={labelClass}>Counter</label>
        <select
          id="assignCounter"
          value={counterId}
          onChange={(e) => onChange(officeId, e.target.value)}
          disabled={disabled || !officeId || loading}
          className={inputClass}
        >
          <option value="">
            {!officeId ? "Select an office first" : loading ? "Loading counters..." : "Select a counter"}
          </option>
          {counters.map((counter) => (
            <option key={counter._id} value={counter._id}>
              {counter.name} (#{counter.number}) · {counter.status}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {officeId && !loading && !error && counters.length === 0 && (
          <p className="mt-1 text-xs text-amber-600">
            This office has no counters. Create one on the Counters page first.
          </p>
        )}
      </div>
    </>
  );
}

const EMPTY_CREATE = { name: "", email: "", password: "", phone: "", officeId: "", counterId: "" };

export default function Staff({ user, setUser }) {
  const [staff, setStaff] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // modal: null | { type: "create" } | { type: "edit"|"assign"|"delete", member }
  const [modal, setModal] = useState(null);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "" });
  const [assignForm, setAssignForm] = useState({ officeId: "", counterId: "" });
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [staffList, officeList] = await Promise.all([getStaff(), getOffices()]);
      setStaff(staffList);
      setOffices(officeList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function closeModal() {
    if (!busy) setModal(null);
  }

  function openCreate() {
    setCreateForm(EMPTY_CREATE);
    setFormError("");
    setModal({ type: "create" });
  }

  function openEdit(member) {
    setEditForm({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
    });
    setFormError("");
    setModal({ type: "edit", member });
  }

  function openAssign(member) {
    setAssignForm({
      officeId: member.officeId?._id || "",
      counterId: member.counterId?._id || "",
    });
    setFormError("");
    setModal({ type: "assign", member });
  }

  function openDelete(member) {
    setFormError("");
    setModal({ type: "delete", member });
  }

  // Runs a mutation, then refreshes server data.
  async function run(action, onSuccessMessage) {
    setBusy(true);
    setFormError("");
    try {
      const result = await action();
      setModal(null);
      setNotice(result?.message || onSuccessMessage);
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleCreate(event) {
    event.preventDefault();
    const { name, email, password, phone, officeId, counterId } = createForm;

    if (!name.trim()) return setFormError("Name is required.");
    if (!email.trim()) return setFormError("Email is required.");
    if (password.length < 6) return setFormError("Password must be at least 6 characters.");
    if (!officeId) return setFormError("Select an office.");
    if (!counterId) return setFormError("Select a counter.");

    const body = {
      name: name.trim(),
      email: email.trim(),
      password,
      officeId,
      counterId,
    };
    if (phone.trim()) body.phone = phone.trim();

    run(() => createStaff(body), "Operator created.");
  }

  function handleEdit(event) {
    event.preventDefault();
    const name = editForm.name.trim();
    const email = editForm.email.trim();

    if (!name) return setFormError("Name is required.");
    if (!email) return setFormError("Email is required.");

    run(
      () =>
        updateStaff(staffIdOf(modal.member), {
          name,
          email,
          phone: editForm.phone.trim(),
        }),
      "Operator updated."
    );
  }

  function handleAssign(event) {
    event.preventDefault();
    if (!assignForm.officeId) return setFormError("Select an office.");
    if (!assignForm.counterId) return setFormError("Select a counter.");

    run(
      () => assignStaff(staffIdOf(modal.member), assignForm.officeId, assignForm.counterId),
      "Assignment updated."
    );
  }

  function handleDelete() {
    run(() => deleteStaff(staffIdOf(modal.member)), "Operator deleted.");
  }

  const formButtons = (label) => (
    <div className="flex gap-3 border-t border-slate-200 p-6">
      <button type="button" onClick={closeModal} disabled={busy} className={`${secondaryBtn} flex-1`}>
        Cancel
      </button>
      <button type="submit" disabled={busy} className={`${primaryBtn} flex-1`}>
        {busy ? "Saving..." : label}
      </button>
    </div>
  );

  return (
    <AdminLayout user={user} setUser={setUser}>
      <PageHeader
        title="Staff"
        description="Operators who manage counters. Each operator is assigned to one office and counter."
        action={
          !loading &&
          !error && (
            <button type="button" onClick={openCreate} className={primaryBtn}>
              + Add operator
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

        {loading && <LoadingBlock label="Loading staff..." />}
        {!loading && error && <ErrorBlock message={error} onRetry={load} />}

        {!loading && !error && staff.length === 0 && (
          <EmptyState
            icon="👥"
            title="No operators yet"
            description="Create an operator account and assign it to an office counter."
            action={
              <button type="button" onClick={openCreate} className={primaryBtn}>
                + Add operator
              </button>
            }
          />
        )}

        {!loading && !error && staff.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600">
                    <th className="px-5 py-4">Operator</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Office</th>
                    <th className="px-5 py-4">Counter</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr key={staffIdOf(member) || member.email} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 font-semibold text-blue-600">
                            {(member.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{member.name}</p>
                            <p className="text-sm text-slate-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{member.phone || "—"}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {member.officeId ? member.officeId.name : <span className="text-amber-600">Unassigned</span>}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {member.counterId ? (
                          <div className="flex items-center gap-2">
                            <span>{member.counterId.name}</span>
                            <StatusBadge status={member.counterId.status} />
                          </div>
                        ) : (
                          <span className="text-amber-600">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openEdit(member)} className={smallBtn}>Edit</button>
                          <button type="button" onClick={() => openAssign(member)} className={smallBtn}>Assign</button>
                          <button type="button" onClick={() => openDelete(member)} className={smallDangerBtn}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modal?.type === "create" && (
        <Modal title="Add operator" subtitle="Creates an operator account and assigns it to a counter." onClose={closeModal}>
          <form onSubmit={handleCreate} noValidate>
            <div className="space-y-5 p-6">
              {formError && <Alert>{formError}</Alert>}

              <div>
                <label htmlFor="createName" className={labelClass}>Full name</label>
                <input id="createName" type="text" value={createForm.name} disabled={busy}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="createEmail" className={labelClass}>Email</label>
                <input id="createEmail" type="email" value={createForm.email} disabled={busy}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="createPassword" className={labelClass}>Password</label>
                <input id="createPassword" type="password" autoComplete="new-password" value={createForm.password} disabled={busy}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} className={inputClass} />
                <p className="mt-1 text-xs text-slate-500">At least 6 characters.</p>
              </div>
              <div>
                <label htmlFor="createPhone" className={labelClass}>
                  Phone <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input id="createPhone" type="tel" value={createForm.phone} disabled={busy}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} className={inputClass} />
              </div>

              <AssignmentFields
                offices={offices}
                officeId={createForm.officeId}
                counterId={createForm.counterId}
                disabled={busy}
                onChange={(officeId, counterId) => setCreateForm({ ...createForm, officeId, counterId })}
              />
            </div>
            {formButtons("Create operator")}
          </form>
        </Modal>
      )}

      {modal?.type === "edit" && (
        <Modal title="Edit operator" subtitle="Name, email and phone. Use Assign to change office or counter." onClose={closeModal}>
          <form onSubmit={handleEdit} noValidate>
            <div className="space-y-5 p-6">
              {formError && <Alert>{formError}</Alert>}

              <div>
                <label htmlFor="editName" className={labelClass}>Full name</label>
                <input id="editName" type="text" value={editForm.name} disabled={busy}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="editEmail" className={labelClass}>Email</label>
                <input id="editEmail" type="email" value={editForm.email} disabled={busy}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label htmlFor="editPhone" className={labelClass}>Phone</label>
                <input id="editPhone" type="tel" value={editForm.phone} disabled={busy}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className={inputClass} />
              </div>
            </div>
            {formButtons("Save changes")}
          </form>
        </Modal>
      )}

      {modal?.type === "assign" && (
        <Modal title="Assign operator" subtitle={modal.member.name} onClose={closeModal}>
          <form onSubmit={handleAssign} noValidate>
            <div className="space-y-5 p-6">
              {formError && <Alert>{formError}</Alert>}
              <AssignmentFields
                offices={offices}
                officeId={assignForm.officeId}
                counterId={assignForm.counterId}
                disabled={busy}
                onChange={(officeId, counterId) => setAssignForm({ officeId, counterId })}
              />
            </div>
            {formButtons("Save assignment")}
          </form>
        </Modal>
      )}

      {modal?.type === "delete" && (
        <ConfirmDialog
          title="Delete operator?"
          message={`${modal.member.name} (${modal.member.email}) will be permanently deleted. An operator whose counter is currently calling or serving a token cannot be deleted.`}
          confirmLabel="Delete operator"
          busy={busy}
          error={formError}
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </AdminLayout>
  );
}
