import { ReactNode } from "react";

interface BooleanFieldProps {
  label: string;
  help?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** A plain controlled checkbox. No wiring needed for dependent fields —
 * pass `checked` down as another field's `disabled` prop instead. */
export function BooleanField({
  label,
  help,
  checked,
  onChange,
}: BooleanFieldProps) {
  return (
    <label className="field field--boolean">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
      {help && <div className="field-help">{help}</div>}
    </label>
  );
}
