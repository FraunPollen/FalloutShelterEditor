interface ToggledNumberFieldProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  value: number;
  onValueChange: (value: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
}

/** A checkbox and its number input on one row — the common case for "set X to Y" fields. */
export function ToggledNumberField({
  label,
  checked,
  onCheckedChange,
  value,
  onValueChange,
  suffix,
  min = 0,
  max,
}: ToggledNumberFieldProps) {
  return (
    <label className="field field--toggled-number">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <span>{label}</span>
      <span className="field-input-group">
        <input
          type="number"
          min={min}
          max={max}
          disabled={!checked}
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value) || 0)}
        />
        {suffix && <span className="field-suffix">{suffix}</span>}
      </span>
    </label>
  );
}
