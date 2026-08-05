"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  UserCog,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
} from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  last_sign_in_at: string | null;
};

type FormMode = "idle" | "create" | "edit";

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminsForm({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<FormMode>("idle");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  // Create form state
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);

  // Edit form state
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPw, setShowEditPw] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admins");
      const data = await res.json() as { users?: AdminUser[]; error?: string };
      if (res.ok && data.users) setUsers(data.users);
      else setFeedback({ ok: false, text: data.error ?? "Failed to load admins." });
    } catch {
      setFeedback({ ok: false, text: "Failed to load admins." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadUsers(); }, [loadUsers]);

  function openCreate() {
    setMode("create");
    setEditingUser(null);
    setNewEmail("");
    setNewPassword("");
    setNewDisplayName("");
    setFeedback(null);
  }

  function openEdit(user: AdminUser) {
    setMode("edit");
    setEditingUser(user);
    setEditDisplayName(user.display_name);
    setEditPassword("");
    setFeedback(null);
  }

  function cancelForm() {
    setMode("idle");
    setEditingUser(null);
    setFeedback(null);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const res = await fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, password: newPassword, display_name: newDisplayName }),
    });
    const data = await res.json() as { error?: string };
    setSubmitting(false);

    if (!res.ok) { setFeedback({ ok: false, text: data.error ?? "Failed to create admin." }); return; }
    setFeedback({ ok: true, text: "Admin account created successfully." });
    setMode("idle");
    await loadUsers();
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;
    setSubmitting(true);
    setFeedback(null);

    const res = await fetch("/api/admins", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingUser.id, display_name: editDisplayName, password: editPassword || undefined }),
    });
    const data = await res.json() as { error?: string };
    setSubmitting(false);

    if (!res.ok) { setFeedback({ ok: false, text: data.error ?? "Failed to update admin." }); return; }
    setFeedback({ ok: true, text: "Admin updated successfully." });
    setMode("idle");
    setEditingUser(null);
    await loadUsers();
  }

  async function handleDelete(user: AdminUser) {
    if (!window.confirm(`Remove admin access for ${user.email}? This cannot be undone.`)) return;
    setDeletingId(user.id);
    setFeedback(null);

    const res = await fetch("/api/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id }),
    });
    const data = await res.json() as { error?: string };
    setDeletingId(null);

    if (!res.ok) { setFeedback({ ok: false, text: data.error ?? "Failed to delete admin." }); return; }
    setFeedback({ ok: true, text: `${user.email} has been removed.` });
    await loadUsers();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Header card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-primary/5 px-4 py-4 sm:gap-4 sm:px-8 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary p-3 text-primary-foreground shadow-lg shadow-primary/20">
              <UserCog size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Admin Accounts</h2>
              <p className="text-sm text-muted-foreground">
                Manage who has access to the Harbor dashboard
              </p>
            </div>
          </div>
          {mode === "idle" && (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              <Plus size={16} />
              Add Admin
            </button>
          )}
        </div>

        {/* Feedback banner */}
        {feedback && (
          <div
            className={`flex items-center gap-3 border-b px-6 py-3 text-sm font-medium ${
              feedback.ok
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
                : "border-red-500/20 bg-red-500/10 text-red-600"
            }`}
          >
            {feedback.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {feedback.text}
          </div>
        )}

        {/* Create form */}
        {mode === "create" && (
          <form onSubmit={(e) => void handleCreate(e)} className="space-y-4 border-b border-border bg-muted/30 p-6">
            <h3 className="text-base font-semibold text-foreground">New Admin Account</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin@harbor.edu"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Display Name
                </label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="e.g. Coordinator"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showNewPw ? "Hide password" : "Show password"}
                  >
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                <Check size={16} />
                {submitting ? "Creating…" : "Create Admin"}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Users list */}
        <div className="divide-y divide-border">
          {loading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Loading admins…</p>
          ) : users.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No admin accounts found.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="space-y-3 p-5 sm:p-6">
                {/* Edit form inline */}
                {mode === "edit" && editingUser?.id === user.id ? (
                  <form onSubmit={(e) => void handleEdit(e)} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={editDisplayName}
                          onChange={(e) => setEditDisplayName(e.target.value)}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          New Password <span className="text-muted-foreground/60">(leave blank to keep)</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showEditPw ? "text" : "password"}
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            minLength={editPassword ? 8 : undefined}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowEditPw((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showEditPw ? "Hide password" : "Show password"}
                          >
                            {showEditPw ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                      >
                        <Check size={16} />
                        {submitting ? "Saving…" : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelForm}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Read row */
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-foreground">
                            {user.display_name || user.email.split("@")[0]}
                          </p>
                          {user.id === currentUserId && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground/70">
                          <span>Joined {formatDate(user.created_at)}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            Last login: {formatDate(user.last_sign_in_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        disabled={mode !== "idle"}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>
                      {user.id !== currentUserId && (
                        <button
                          type="button"
                          onClick={() => void handleDelete(user)}
                          disabled={deletingId === user.id || mode !== "idle"}
                          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 size={15} />
                          {deletingId === user.id ? "Removing…" : "Remove"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        All admin accounts have full dashboard access. Only the original super-admin can manage accounts here.
      </p>
    </div>
  );
}
