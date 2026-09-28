interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  suffix?: string; // e.g. "hours"
}

export function NumberField({
  label,
  value,
  onChange,
  disabled,
  min = 0,
  max,
  suffix,
}: NumberFieldProps) {
  return (
    <label className="field field--number">
      <span>{label}</span>
      <span className="field-input-group">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
        {suffix && <span className="field-suffix">{suffix}</span>}
      </span>
    </label>
  );
}
