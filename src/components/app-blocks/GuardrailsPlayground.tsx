"use client";

import { useId, useState } from "react";
import { HERO_RULES, LINK_RULES, LINK_URL_LABEL, checkLinkUrl, checkText, type TextRule } from "@/lib/rules";

type Values = { eyebrow: string; heading: string; body: string; label: string; href: string };

const START: Values = {
  eyebrow: "Guardrails",
  heading: "Rules every page passes before it publishes",
  body: "Change any field. The Studio runs these same checks before an editor can publish.",
  label: "How it's run",
  href: "/system",
};

const BROKEN: Values = {
  eyebrow: "A label far too long for the small line above a heading",
  heading: "",
  body: START.body,
  label: START.label,
  href: "www.example.com",
};

type FieldName = keyof Values;

const FIELDS: { name: FieldName; rule?: TextRule; multiline?: boolean; hint?: string }[] = [
  { name: "eyebrow", rule: HERO_RULES.eyebrow },
  { name: "heading", rule: HERO_RULES.heading },
  { name: "body", rule: HERO_RULES.body, multiline: true },
  { name: "label", rule: LINK_RULES.label },
  { name: "href", hint: "A path such as /contact or a full https:// URL." },
];

function problem(name: FieldName, values: Values): string | null {
  if (name === "href") return checkLinkUrl(values.href);
  const field = FIELDS.find((item) => item.name === name);
  return field?.rule ? checkText(values[name], field.rule) : null;
}

/** A hero's fields with the Studio's rules, checked as you type, next to the hero they would publish. */
export function GuardrailsPlayground() {
  const id = useId();
  const [values, setValues] = useState<Values>(START);
  const [published, setPublished] = useState<Values | null>(null);
  const problems = FIELDS.map((field) => ({ name: field.name, message: problem(field.name, values) })).filter(
    (item): item is { name: FieldName; message: string } => item.message !== null,
  );
  const shown = published ?? START;
  const dirty = JSON.stringify(values) !== JSON.stringify(shown);

  const update = (name: FieldName, value: string) => setValues((current) => ({ ...current, [name]: value }));

  return (
    <div className="playground">
      <form
        className="playground__form"
        aria-labelledby={`${id}-form`}
        onSubmit={(event) => {
          event.preventDefault();
          if (problems.length === 0) setPublished(values);
        }}
      >
        <p className="playground__title" id={`${id}-form`}>
          Hero, as the editor sees it
        </p>
        {FIELDS.map((field) => {
          const message = problem(field.name, values);
          const label = field.rule?.label ?? LINK_URL_LABEL;
          const inputId = `${id}-${field.name}`;
          const describedBy = [message ? `${inputId}-error` : "", field.rule ? `${inputId}-count` : "", field.hint ? `${inputId}-hint` : ""]
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
                  {label}
                  {field.rule?.required || field.name === "href" ? <span className="playground__required"> (required)</span> : null}
                </label>
                {field.rule ? (
                  <span className="playground__count" id={`${inputId}-count`}>
                    {values[field.name].length} / {field.rule.max}
                  </span>
                ) : null}
              </div>
              {field.multiline ? <textarea rows={3} {...common} /> : <input type="text" autoComplete="off" {...common} />}
              {field.hint ? (
                <p className="playground__hint" id={`${inputId}-hint`}>
                  {field.hint}
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
          <button className="button playground__publish" type="submit" disabled={problems.length > 0 || !dirty}>
            Publish
          </button>
          <button className="playground__secondary" type="button" onClick={() => setValues(BROKEN)}>
            Break three rules
          </button>
          <button
            className="playground__secondary"
            type="button"
            onClick={() => {
              setValues(START);
              setPublished(null);
            }}
          >
            Reset
          </button>
        </div>
        <p className="playground__status" role="status">
          {problems.length > 0
            ? `${problems.length === 1 ? "One field fails" : `${problems.length} fields fail`}, so Publish stays off.`
            : dirty
              ? "Every field passes. Publish puts this version live."
              : "Live and unchanged."}
        </p>
      </form>
      <div className="playground__preview">
        <p className="playground__title">Live on the page</p>
        <div className="playground__hero">
          {shown.eyebrow ? <p className="eyebrow">{shown.eyebrow}</p> : null}
          <p className="playground__heading">{shown.heading}</p>
          {shown.body ? <p className="playground__body">{shown.body}</p> : null}
          <span className="playground__fake-button">{shown.label}</span>
        </div>
        <p className="playground__note">The page changes only when every field passes and you publish.</p>
      </div>
    </div>
  );
}
