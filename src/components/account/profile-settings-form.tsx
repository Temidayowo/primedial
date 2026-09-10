"use client";

import { useActionState } from "react";
import { updateName, changePassword } from "@/lib/actions/profile.action";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none";
const labelClasses = "text-xs font-medium tracking-wide text-slate-400 uppercase";

export function ProfileSettingsForm({
  name,
  email,
  hasPassword,
}: {
  name: string | null;
  email: string;
  hasPassword: boolean;
}) {
  const [nameState, nameAction, nameIsPending] = useActionState(
    updateName,
    undefined,
  );
  const [passwordState, passwordAction, passwordIsPending] = useActionState(
    changePassword,
    undefined,
  );

  return (
    <div className="max-w-lg space-y-8">
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold text-white">Basic Info</h2>

        <div className="mt-4">
          <label className={labelClasses}>Email</label>
          <input
            value={email}
            disabled
            className={`mt-1.5 ${inputClasses} cursor-not-allowed opacity-60`}
          />
        </div>

        <form action={nameAction} className="mt-4">
          <label className={labelClasses}>Full Name</label>
          <input
            name="name"
            defaultValue={name ?? ""}
            required
            className={`mt-1.5 ${inputClasses}`}
          />
          {nameState?.error && (
            <p className="mt-1 text-xs text-red-400">{nameState.error}</p>
          )}
          {nameState?.message && (
            <p className="mt-1 text-xs text-green">{nameState.message}</p>
          )}
          <button
            type="submit"
            disabled={nameIsPending}
            className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
          >
            {nameIsPending ? "Saving..." : "Save Name"}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold text-white">Password</h2>

        {!hasPassword ? (
          <p className="mt-2 text-sm text-slate-400">
            This account signed up with Google and doesn&apos;t have a
            password.
          </p>
        ) : (
          <form action={passwordAction} className="mt-4 space-y-4">
            <div>
              <label className={labelClasses}>Current Password</label>
              <input
                name="currentPassword"
                type="password"
                required
                className={`mt-1.5 ${inputClasses}`}
              />
              {passwordState?.errors?.currentPassword && (
                <p className="mt-1 text-xs text-red-400">
                  {passwordState.errors.currentPassword[0]}
                </p>
              )}
            </div>
            <div>
              <label className={labelClasses}>New Password</label>
              <input
                name="newPassword"
                type="password"
                required
                className={`mt-1.5 ${inputClasses}`}
              />
              {passwordState?.errors?.newPassword ? (
                <ul className="mt-1 space-y-0.5 text-xs text-red-400">
                  {passwordState.errors.newPassword.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  Use 8+ characters with a mix of letters, numbers &amp;
                  symbols.
                </p>
              )}
            </div>
            <div>
              <label className={labelClasses}>Confirm New Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                className={`mt-1.5 ${inputClasses}`}
              />
              {passwordState?.errors?.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">
                  {passwordState.errors.confirmPassword[0]}
                </p>
              )}
            </div>

            {passwordState?.error && (
              <p className="text-sm text-red-400">{passwordState.error}</p>
            )}
            {passwordState?.message && (
              <p className="text-sm text-green">{passwordState.message}</p>
            )}

            <button
              type="submit"
              disabled={passwordIsPending}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
            >
              {passwordIsPending ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
