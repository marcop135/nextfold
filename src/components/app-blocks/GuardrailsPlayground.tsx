"use client";

import { useId, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getMessages, type UiMessages } from "@/lib/messages";
import { HERO_RULES, LINK_RULES, checkLinkUrl, checkText, type TextRule } from "@/lib/rules";

type Values = { eyebrow: string; heading: string; body: string; label: string; href: string };
type FieldName = keyof Values;

const FIELDS: { name: FieldName; rule?: TextRule; multiline?: boolean }[] = [
  { name: "eyebrow", rule: HERO_RULES.eyebrow },
  { name: "heading", rule: HERO_RULES.heading },
  { name: "body", rule: HERO_RULES.body, multiline: true },
  { name: "label", rule: LINK_RULES.label },
  { name: "href" },
];

/** The limits come from src/lib/rules.ts, like the Studio's; only the wording follows the page language. */
function problem(name: FieldName, values: Values, t: UiMessages["playground"], messages: UiMessages["rules"]): string | null {
  if (name === "href") return checkLinkUrl(values.href, messages, t.labels.href);
  const field = FIELDS.find((item) => item.name === name);
  return field?.rule ? checkText(values[name], field.rule, messages, t.labels[name]) : null;
}

/** A hero's fields with the Studio's rules, checked as you type, next to the hero they would publish. */
export function GuardrailsPlayground({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const t = messages.playground;
  const start: Values = { ...t.start, href: "/system" };
  const broken: Values = { ...start, eyebrow: t.broken.eyebrow, heading: "", href: "www.example.com" };
  const id = useId();
  const [values, setValues] = useState<Values>(start);
  const [published, setPublished] = useState<Values | null>(null);
  const problems = FIELDS.map((field) => problem(field.name, values, t, messages.rules)).filter(Boolean);
  const shown = published ?? start;
  const dirty = JSON.stringify(values) !== JSON.stringify(shown);

  const update = (name: FieldName, value: string) => setValues((current) => ({ ...current, [name]: value }));

  return (
    <div className="playground">
      <form
        className="playground__form"
        aria-labelledby={`${id}-form`}
        onSubmit={(event) => {
          event.preventDefault();
          if (problems.length === 0 && dirty) {
            setPublished(values);
            return;
          }
          // A blocked Publish takes the user to the first field that fails, where its error is read out.
          event.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
        }}
      >
        <p className="playground__title" id={`${id}-form`}>
          {t.formTitle}
        </p>
        {FIELDS.map((field) => {
          const message = problem(field.name, values, t, messages.rules);
          const inputId = `${id}-${field.name}`;
          const required = field.rule?.required || field.name === "href";
          const describedBy = [
            message ? `${inputId}-error` : "",
            field.rule ? `${inputId}-count` : "",
            field.name === "href" ? `${inputId}-hint` : "",
          ]
            .filter(Boolean)
            .join(" ");
          const common = {
            id: inputId,
            value: values[field.name],
            "aria-invalid": message ? true : undefined,
            "aria-describedby": describedBy || undefined,
            onChange: (event: { target: { value: string } }) => update(field.name, event.target.value),
          };
          return (
            <div key={field.name} className="playground__field" data-invalid={message ? "" : undefined}>
              <div className="playground__label-row">
                <label htmlFor={inputId}>
                  {t.labels[field.name]}
                  {required ? <span className="playground__required">{t.required}</span> : null}
                </label>
                {field.rule ? (
                  <span className="playground__count" id={`${inputId}-count`}>
                    {values[field.name].length} / {field.rule.max}
                  </span>
                ) : null}
              </div>
              {field.multiline ? <textarea rows={3} {...common} /> : <input type="text" autoComplete="off" {...common} />}
              {field.name === "href" ? (
                <p className="playground__hint" id={`${inputId}-hint`}>
                  {t.hrefHint}
                </p>
              ) : null}
              {message ? (
                <p className="playground__error" id={`${inputId}-error`}>
                  {message}
                </p>
              ) : null}
            </div>
          );
        })}
        <div className="playground__actions">
          {/* aria-disabled, not disabled: after Publish the button turns inert while it holds focus. */}
          <button className="button playground__publish" type="submit" aria-disabled={problems.length > 0 || !dirty}>
            {t.publish}
          </button>
          <button className="playground__secondary" type="button" onClick={() => setValues(broken)}>
            {t.breakRules}
          </button>
          <button
            className="playground__secondary"
            type="button"
            onClick={() => {
              setValues(start);
              setPublished(null);
            }}
          >
            {t.reset}
          </button>
        </div>
        <p className="playground__status" role="status">
          {problems.length > 0 ? t.statusFailing(problems.length) : dirty ? t.statusReady : t.statusLive}
        </p>
      </form>
      <div className="playground__preview">
        <p className="playground__title">{t.previewTitle}</p>
        <div className="playground__hero">
          {shown.eyebrow ? <p className="eyebrow">{shown.eyebrow}</p> : null}
          <p className="playground__heading">{shown.heading}</p>
          {shown.body ? <p className="playground__body">{shown.body}</p> : null}
          <span className="playground__fake-button">{shown.label}</span>
        </div>
        <p className="playground__note">{t.note}</p>
      </div>
    </div>
  );
}
