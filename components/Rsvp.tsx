"use client";

import { FormEvent, useState } from "react";
import type { WeddingData } from "@/lib/types";
import {
  eventInactiveStyleRsvp,
  getEventActiveStyle,
} from "@/lib/eventStyles";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  eventPickerButtonClass,
  eventPickerPaddingClass,
  getLocalizedEventName,
} from "@/lib/i18n/eventTranslations";
import { formatEventDate, toDevanagariDigits } from "@/lib/i18n/nepaliDate";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

type FormState = {
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "no" | "";
  eventsAttending: string[];
  guests: string;
  dietary: string;
  message: string;
};

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  attending: "",
  eventsAttending: [],
  guests: "1",
  dietary: "",
  message: "",
};

export function Rsvp({ wedding }: { wedding: WeddingData }) {
  const { locale, t } = useLanguage();
  const isNepali = locale === "ne";
  const [form, setForm] = useState<FormState>(initial);
  const rsvpDeadline = formatEventDate(locale, wedding.rsvpDeadline);
  const [submitted, setSubmitted] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [eventsError, setEventsError] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const hasEmail = form.email.trim().length > 0;
    const hasPhone = form.phone.trim().length > 0;

    if (!hasEmail && !hasPhone) {
      setContactError(true);
      return;
    }

    if (form.attending === "yes" && form.eventsAttending.length === 0) {
      setEventsError(true);
      return;
    }

    setContactError(false);
    setEventsError(false);
    setSubmitError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          attending: form.attending,
          eventsAttending: form.eventsAttending,
          guests: form.guests,
          dietary: form.dietary,
          message: form.message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error || t.rsvp.submitError);
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError(t.rsvp.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleEvent(eventId: string) {
    setEventsError(false);
    setForm((prev) => {
      const selected = prev.eventsAttending.includes(eventId);
      return {
        ...prev,
        eventsAttending: selected
          ? prev.eventsAttending.filter((id) => id !== eventId)
          : [...prev.eventsAttending, eventId],
      };
    });
  }

  function setAttending(val: "yes" | "no") {
    setForm((prev) => ({
      ...prev,
      attending: val,
      eventsAttending: val === "yes" ? prev.eventsAttending : [],
    }));
    if (val === "no") setEventsError(false);
  }

  if (submitted) {
    const firstName = form.name.split(" ")[0];
    return (
      <Section
        id="rsvp"
        className="bg-green text-center text-ivory"
        innerClassName="max-w-2xl"
      >
        <SectionHeading
          label={t.rsvp.label}
          title={t.rsvp.thankYou}
          className="[&_h2]:text-ivory [&_p]:text-gold"
        />
        <p
          className={`mx-auto mt-8 max-w-md text-sm leading-relaxed text-ivory/80 md:text-base ${
            isNepali ? "font-serif" : ""
          }`}
        >
          {t.rsvp.thankYouBody.replace("{name}", firstName)}
        </p>
      </Section>
    );
  }

  return (
    <Section id="rsvp" className="bg-green" innerClassName="max-w-3xl">
      <SectionHeading
        label={t.rsvp.label}
        title={t.rsvp.title}
        className="[&_h2]:text-ivory [&_p]:text-gold"
      />

      <p
        className={`mx-auto mt-6 max-w-md text-center text-sm text-ivory/70 md:text-base ${
          isNepali ? "font-serif" : ""
        }`}
      >
        {t.rsvp.deadline} {rsvpDeadline}
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 max-w-2xl space-y-5 md:mt-12 md:space-y-6"
      >
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          <Field label={t.rsvp.fullName} required isNepali={isNepali}>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              placeholder={t.rsvp.fullNamePlaceholder}
            />
          </Field>

          <Field label={t.rsvp.email} isNepali={isNepali}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => {
                setContactError(false);
                update("email", e.target.value);
              }}
              className={inputClass}
              placeholder={t.rsvp.emailPlaceholder}
            />
          </Field>

          <Field label={t.rsvp.phone} isNepali={isNepali}>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => {
                setContactError(false);
                update("phone", e.target.value);
              }}
              className={inputClass}
              placeholder={t.rsvp.phonePlaceholder}
            />
          </Field>
        </div>

        <p
          className={`text-center text-xs text-ivory/50 ${
            isNepali ? "font-serif" : ""
          }`}
        >
          {t.rsvp.contactRequired} <span className="text-gold">*</span>
        </p>
        {contactError && (
          <p
            className={`text-center text-xs text-gold ${
              isNepali ? "font-serif" : ""
            }`}
          >
            {t.rsvp.contactError}
          </p>
        )}

        <Field label={t.rsvp.willYouAttend} required isNepali={isNepali}>
          <div className="flex gap-3 md:gap-4">
            {(["yes", "no"] as const).map((val) => (
              <label
                key={val}
                className={`flex flex-1 cursor-pointer items-center justify-center rounded-sm border py-2.5 text-sm transition-colors md:py-3 md:text-base ${
                  isNepali ? "font-serif" : ""
                } ${
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
                  onChange={() => setAttending(val)}
                  className="sr-only"
                />
                {val === "yes" ? t.rsvp.joyfullyAccepts : t.rsvp.regretfullyDeclines}
              </label>
            ))}
          </div>
        </Field>

        {form.attending === "yes" && (
          <Field label={t.rsvp.whichEvents} required isNepali={isNepali}>
            <div className="flex flex-wrap gap-2">
              {wedding.events.map((event) => {
                const isSelected = form.eventsAttending.includes(event.id);
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => toggleEvent(event.id)}
                    className={`rounded-sm border text-left transition-colors ${eventPickerPaddingClass(locale)} ${eventPickerButtonClass(locale)} ${
                      isSelected
                        ? getEventActiveStyle(event.id)
                        : eventInactiveStyleRsvp
                    }`}
                  >
                    {getLocalizedEventName(event, locale)}
                  </button>
                );
              })}
            </div>
            {eventsError && (
              <p
                className={`mt-2 text-xs text-gold ${
                  isNepali ? "font-serif" : ""
                }`}
              >
                {t.rsvp.eventsError}
              </p>
            )}
          </Field>
        )}

        {form.attending === "yes" && (
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <Field label={t.rsvp.numberOfGuests} isNepali={isNepali}>
              <select
                value={form.guests}
                onChange={(e) => update("guests", e.target.value)}
                className={`${inputClass} ${isNepali ? "font-serif" : ""}`}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={String(n)}>
                    {isNepali ? toDevanagariDigits(n) : n}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t.rsvp.dietaryRestrictions} isNepali={isNepali}>
              <input
                type="text"
                value={form.dietary}
                onChange={(e) => update("dietary", e.target.value)}
                className={inputClass}
                placeholder={t.rsvp.dietaryPlaceholder}
              />
            </Field>
          </div>
        )}

        <Field label={t.rsvp.messageToCouple} isNepali={isNepali}>
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder={t.rsvp.messagePlaceholder}
          />
        </Field>

        {submitError && (
          <p
            className={`text-center text-xs text-gold ${
              isNepali ? "font-serif" : ""
            }`}
          >
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full rounded-sm bg-gold py-3.5 text-xs tracking-[0.25em] text-green transition-colors hover:bg-gold/90 disabled:opacity-60 md:py-4 md:text-sm ${
            isNepali ? "font-serif font-bold" : "uppercase"
          }`}
        >
          {submitting ? t.rsvp.submitting : t.rsvp.submit}
        </button>
      </form>
    </Section>
  );
}

const inputClass =
  "w-full rounded-sm border border-ivory/20 bg-white/5 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none transition-colors focus:border-gold md:text-base";

function Field({
  label,
  required,
  children,
  isNepali = false,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  isNepali?: boolean;
}) {
  return (
    <label className="block">
      <span
        className={`mb-1.5 block text-xs tracking-[0.15em] text-ivory/60 md:text-sm ${
          isNepali ? "font-serif" : "uppercase"
        }`}
      >
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
    </label>
  );
}
