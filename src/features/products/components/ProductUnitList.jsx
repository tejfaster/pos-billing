import { useLanguage } from "../../../context/LanguageContext";
import { UNITS } from "../../../data/units";

export default function ProductUnitList({
  selectedUnitIds,
  onAddUnit,
  onRemoveUnit,
}) {
  const { t } = useLanguage();

  const availableUnits = UNITS.filter(
    (unit) => !selectedUnitIds.includes(unit.id)
  );

  const selectedUnits = UNITS.filter((unit) =>
    selectedUnitIds.includes(unit.id)
  );

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              {t("units")}
            </h3>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {t("selectProductUnits")}
            </p>
          </div>

          <select
            value=""
            onChange={(event) => {
              if (event.target.value) {
                onAddUnit(event.target.value);
              }
            }}
            disabled={availableUnits.length === 0}
            className="
              h-10
              min-w-40
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-3
              text-sm
              text-[var(--foreground)]
              outline-none
              transition
              focus:border-[var(--foreground)]
              focus:ring-2
              focus:ring-[var(--foreground)]/10
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label={t("addProductUnit")}
          >
            <option value="">
              {availableUnits.length === 0
                ? t("allUnitsAdded")
                : `+ ${t("addUnit")}`}
            </option>

            {availableUnits.map((unit) => (
              <option
                key={unit.id}
                value={unit.id}
              >
                {unit.name} ({unit.shortName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedUnits.length === 0 ? (
        <div
          className="
            rounded-lg
            border
            border-dashed
            border-[var(--border)]
            bg-[var(--surface)]
            px-4
            py-8
            text-center
          "
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            {t("noUnitsAdded")}
          </p>

          <p className="mt-1 text-xs text-[var(--muted)]">
            {t("addProductUnitsDescription")}
          </p>
        </div>
      ) : (
        <div
          className="
            overflow-hidden
            rounded-lg
            border
            border-[var(--border)]
            bg-[var(--surface)]
          "
        >
          <div
            className="
              grid
              grid-cols-[1fr_100px_40px]
              items-center
              gap-3
              border-b
              border-[var(--border)]
              bg-[var(--muted)]/5
              px-4
              py-3
              text-xs
              font-medium
              text-[var(--muted)]
            "
          >
            <div>{t("unit")}</div>
            <div>{t("short")}</div>
            <div></div>
          </div>

          {selectedUnits.map((unit) => (
            <div
              key={unit.id}
              className="
                grid
                grid-cols-[1fr_100px_40px]
                items-center
                gap-3
                border-b
                border-[var(--border)]
                px-4
                py-3
                last:border-b-0
              "
            >
              <div className="text-sm font-medium text-[var(--foreground)]">
                {unit.name}
              </div>

              <div className="text-sm text-[var(--muted)]">
                {unit.shortName}
              </div>

              <button
                type="button"
                onClick={() => onRemoveUnit(unit.id)}
                title={`${t("remove")} ${unit.name}`}
                aria-label={`${t("remove")} ${unit.name}`}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-md
                  text-lg
                  text-[var(--danger)]
                  transition
                  hover:bg-[var(--danger)]/10
                  active:scale-95
                "
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}