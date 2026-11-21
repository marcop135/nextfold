"use client";

import { useId, useState, type CSSProperties } from "react";
import type { AnatomySection } from "@/lib/anatomy";
import type { Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

/**
 * This page's sections as a sketch on the left; pick one and its fields appear on the right, each with
 * what the editor typed and a meter of how much of the Studio's limit it uses.
 */
export function PageAnatomy({ sections, locale }: { sections: AnatomySection[]; locale: Locale }) {
  const messages = getMessages(locale);
  const t = messages.anatomy;
  const types = messages.heroVisual.types;
  const id = useId();
  const [selected, setSelected] = useState(sections[0]?.key);
  const current = sections.find((section) => section.key === selected) ?? sections[0];
  if (!current) return null;

  return (
    <div className="anatomy">
      <div className="anatomy__page">
        <p className="anatomy__label" id={`${id}-pick`}>
          {t.pick}
        </p>
        <ol className="anatomy__sections" aria-labelledby={`${id}-pick`}>
          {sections.map((section) => (
            <li key={section.key}>
              <button
                type="button"
                className="anatomy__section"
                data-type={section.type}
                aria-pressed={section.key === current.key}
                aria-controls={`${id}-fields`}
                onClick={() => setSelected(section.key)}
              >
                <span className="anatomy__type">{types[section.type] ?? section.type}</span>
                <span className="anatomy__heading">{section.heading}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="anatomy__fields" id={`${id}-fields`}>
        {/* One short line is announced on a change, not the whole field list. */}
        <p className="anatomy__label" role="status">
          {t.fieldsOf(types[current.type] ?? current.type)}
        </p>
        <dl>
          {current.fields.map((field) => {
            const isCount = field.id === "cards" || field.id === "steps";
            return (
              <div key={field.id} className="anatomy__field">
                <dt>
                  {t.labels[field.id]}
                  <span className="anatomy__rule">{field.required ? t.required : t.optional}</span>
                </dt>
                <dd className="anatomy__value">
                  {isCount ? t.items(field.length) : field.value ? `“${field.value}”` : <span className="anatomy__empty">{t.empty}</span>}
                </dd>
                <dd className="anatomy__meter">
                  <span className="anatomy__bar" aria-hidden="true">
                    <span style={{ "--share": Math.min(1, field.length / field.max) } as CSSProperties} />
                  </span>
                  <span className="anatomy__count" aria-hidden="true">
                    {isCount ? t.range(field.min ?? 0, field.max) : t.chars(field.length, field.max)}
                  </span>
                  <span className="visually-hidden">
                    {isCount ? t.rangeLong(field.min ?? 0, field.max) : t.charsLong(field.length, field.max)}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
