import { TEMPLATES, type TemplateId } from '#/lib/templates'

type TemplatePickerProps = {
  value: TemplateId
  onChange: (id: TemplateId) => void
}

export function TemplatePicker({ value, onChange }: TemplatePickerProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="radiogroup"
      aria-label="Card template"
    >
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={value === t.id}
          data-active={value === t.id}
          className="template-chip"
          onClick={() => onChange(t.id)}
        >
          <span className="block">{t.name}</span>
          <span className="mt-0.5 block text-[0.7rem] font-medium opacity-75">
            {t.blurb}
          </span>
        </button>
      ))}
    </div>
  )
}
