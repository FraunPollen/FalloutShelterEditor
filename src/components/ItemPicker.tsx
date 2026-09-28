import { useMemo, useState } from "react";
import { type CatalogItem } from "../data/itemCatalog";

interface ItemPickerProps {
  catalog: CatalogItem[];
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
  disabled?: boolean;
  /** Current count of each item already in the save, shown as "(have: N)". */
  getCurrentCount?: (id: string) => number;
}

function optionLabel(item: CatalogItem): string {
  switch (item.type) {
    case "Outfit":
    case "Weapon":
      return `[${item.type}] ${item.id} ${item.stats}`;
    default:
      return `[${item.type}] ${item.id}`;
  }
}

/**
 * For a large catalog (junk + outfits + weapons), showing one row per
 * possible item (like ChecklistTable does for pets) would be a huge,
 * mostly-empty table. This is the "pick from a dropdown, set a count, add
 * it to the list" alternative instead: only the items actually selected
 * show up as rows.
 */
export function ItemPicker({
  catalog,
  value,
  onChange,
  disabled,
  getCurrentCount,
}: ItemPickerProps) {
  // Sorted alphabetically by the full displayed label (including the
  // [Type] prefix), so the three item kinds don't just cluster by type.
  const sortedCatalog = useMemo(
    () =>
      [...catalog].sort((a, b) => optionLabel(a).localeCompare(optionLabel(b))),
    [catalog],
  );

  const [pendingId, setPendingId] = useState(sortedCatalog[0]?.id ?? "");
  const [pendingCount, setPendingCount] = useState(1);

  const selectedEntries = Object.entries(value).filter(
    ([, count]) => count > 0,
  );

  function addSelection() {
    if (!pendingId || pendingCount <= 0) return;
    onChange({ ...value, [pendingId]: pendingCount });
  }

  function removeSelection(id: string) {
    const next = { ...value };
    delete next[id];
    onChange(next);
  }

  return (
    <div className="item-picker">
      <div className="item-picker-add-row">
        <select
          disabled={disabled}
          value={pendingId}
          onChange={(e) => setPendingId(e.target.value)}
        >
          {sortedCatalog.map((item) => (
            <option key={item.id} value={item.id}>
              {optionLabel(item)}
              {getCurrentCount ? ` (have: ${getCurrentCount(item.id)})` : ""}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          disabled={disabled}
          value={pendingCount}
          onChange={(e) => setPendingCount(Number(e.target.value) || 1)}
        />
        <button type="button" disabled={disabled} onClick={addSelection}>
          Add
        </button>
      </div>

      {selectedEntries.length > 0 && (
        <table className="checklist-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Stats</th>
              <th>Target count</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {selectedEntries.map(([id, count]) => (
              <tr key={id}>
                <td>
                  {id}
                  {getCurrentCount && (
                    <span className="field-help">
                      &nbsp; (have: {getCurrentCount(id)})
                    </span>
                  )}
                </td>
                <td>
                  {sortedCatalog
                    .find((c) => c.id === id)
                    ?.stats?.replace("(", "")
                    .replace(")", "")}
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    disabled={disabled}
                    value={count}
                    onChange={(e) =>
                      onChange({ ...value, [id]: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeSelection(id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
