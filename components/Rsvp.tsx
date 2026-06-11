"use client";

import { FormEvent, useState } from "react";
import { wedding } from "@/lib/wedding";
import { SectionHeading } from "./SectionHeading";

type FormState = {
  name: string;
  email: string;
  attending: "yes" | "no" | "";
  guests: string;
  dietary: string;
  message: string;
};

const initial: FormState = {
  name: "",
  email: "",
  attending: "",
  guests: "1",
  dietary: "",
  message: "",
};

export function Rsvp() {
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (submitted) {
    return (
      <section id="rsvp" className="bg-green px-6 py-20 text-center text-ivory">
        <SectionHeading
          label="RSVP"
          title="Thank you!"
          className="[&_h2]:text-ivory [&_p]:text-gold"
        />
        <p className="mx-auto mt-8 max-w-xs text-sm leading-relaxed text-ivory/80">
          We&apos;ve received your response, {form.name.split(" ")[0]}. We
          can&apos;t wait to celebrate with you.
        </p>
      </section>
    );
  }

  return (
    <section id="rsvp" className="bg-green px-6 py-20">
      <SectionHeading
        label="RSVP"
        title="Will you join us?"
        className="[&_h2]:text-ivory [&_p]:text-gold"
      />

      <p className="mx-auto mt-6 max-w-xs text-center text-sm text-ivory/70">
        Please respond by {wedding.rsvpDeadline}
      </p>

      <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-sm space-y-5">
        <Field label="Full name" required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
            placeholder="Your name"
          />
        </Field>

        <Field label="Email" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
            placeholder="you@email.com"
          />
        </Field>

        <Field label="Will you attend?" required>
          <div className="flex gap-3">
            {(["yes", "no"] as const).map((val) => (
              <label
                key={val}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-sm border py-2.5 text-sm capitalize transition-colors ${
                  form.attending === val
                    ? "border-gold bg-gold/20 text-ivory"
                    : "border-ivory/20 text-ivory/70 hover:border-ivory/40"
                }`}
              >
                <input
                  type="radio"
                  name="attending"
                  value={val}
                  required
                  checked={form.attending === val}
                  onChange={() => update("attending", val)}
                  className="sr-only"
                />
                {val === "yes" ? "Joyfully accepts" : "Regretfully declines"}
              </label>
            ))}
          </div>
        </Field>

        {form.attending === "yes" && (
          <>
            <Field label="Number of guests">
              <select
                value={form.guests}
                onChange={(e) => update("guests", e.target.value)}
                className={inputClass}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Dietary restrictions">
              <input
                type="text"
                value={form.dietary}
                onChange={(e) => update("dietary", e.target.value)}
                className={inputClass}
                placeholder="Vegetarian, allergies, etc."
              />
            </Field>
          </>
        )}

        <Field label="Message to the couple">
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="We'd love to hear from you"
          />
        </Field>

        <button
          type="submit"
          className="w-full rounded-sm bg-gold py-3.5 text-xs uppercase tracking-[0.25em] text-green transition-colors hover:bg-gold/90"
        >
          Send RSVP
        </button>
      </form>
    </section>
  );
}

const inputClass =
  "w-full rounded-sm border border-ivory/20 bg-white/5 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none transition-colors focus:border-gold";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-ivory/60">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
    </label>
  );
}
