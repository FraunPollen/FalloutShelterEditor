interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface ChecklistTableCheckProps<T> {
  mode: "check";
  items: T[];
  getKey: (item: T) => string;
  columns: Column<T>[];
  disabled?: boolean;
  selected: string[];
  onChange: (selected: string[]) => void;
  emptyMessage?: string;
}

interface ChecklistTableCountProps<T> {
  mode: "count";
  items: T[];
  getKey: (item: T) => string;
  columns: Column<T>[];
  disabled?: boolean;
  counts: Record<string, number>;
  onChange: (counts: Record<string, number>) => void;
  emptyMessage?: string;
}

type ChecklistTableProps<T> =
  ChecklistTableCheckProps<T> | ChecklistTableCountProps<T>;

/**
 * Table-based replacement for the old per-feature "render a <ul> of
 * checkboxes/inputs, then scrape them back out in collectFormData()"
 * pattern. State lives in the parent (selected keys, or a count map) —
 * this component just renders it and reports changes. No DOM scraping,
 * no manual disabled-wiring: pass `disabled` down from whatever toggle
 * governs this table.
 */
export function ChecklistTable<T>(props: ChecklistTableProps<T>) {
  const { items, getKey, columns, disabled, emptyMessage } = props;

  if (items.length === 0) {
    return (
      <p className="checklist-empty">{emptyMessage ?? "Nothing to show."}</p>
    );
  }

  return (
    <table className="checklist-table">
      <thead>
        <tr>
          {props.mode === "check" && <th />}
          {columns.map((col) => (
            <th key={col.header}>{col.header}</th>
          ))}
          {props.mode === "count" && <th />}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const key = getKey(item);
          return (
            <tr key={key}>
              {props.mode === "check" && (
                <td>
                  <input
                    type="checkbox"
                    disabled={disabled}
                    checked={props.selected.includes(key)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...props.selected, key]
                        : props.selected.filter((k) => k !== key);
                      props.onChange(next);
                    }}
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.header}>{col.render(item)}</td>
              ))}
              {props.mode === "count" && (
                <td>
                  <input
                    type="number"
                    min={0}
                    disabled={disabled}
                    value={props.counts[key] ?? 0}
                    onChange={(e) =>
                      props.onChange({
                        ...props.counts,
                        [key]: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
