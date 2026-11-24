# Bars

The app has three bars: the page level metric bar, the table toolbar and the chart bar. Every page is built from them,
and each one has **fixed zones**:

- **Constant controls sit at fixed ends and never move.**
- **Only the middle slot changes** from page to page, and every setting there is a dropdown chip.

A new feature never decides where a control goes. It fills a slot.

The live reference, captured from the running app, is `public/design-inventory/bars-inventory.html`.

## 1. Page level metric bar

`AppTaskbar` (also exported as `PageBar`) in `components/layout/AppTaskbar.tsx`.

```
[breadcrumb] | [date range] [settings… (chips)]  ·····  [account · synced] [island-off utilities] | [Run]
 fixed 1      variable                        fixed                                    fixed, always last
```

- **Placement:** one row, always directly under the page heading.
- **Breadcrumb:** only on pages that are a level inside another (`breadcrumbs`, two or more crumbs, such as
  Campaign Manager › campaign › ad group). It comes first; top-level pages have none. Long names truncate (full name on
  hover) so the bar stays one row.
- **Date range:** `showDateRange` puts it first. Use `dateRangeOverride` for a page-local range.
- **Settings:**
  - `showAdType` and `showFrequency` are the built-in settings.
  - `filters` takes this page's settings as `BarFilter[]` (`BarChip` props plus a `key`).
- **Escape hatch:** `children` is for a control that is not a select, such as a search box or the product picker.
  Build it on `BarChipTrigger`.
- **Run:** `showRunButton` with `onRun`. It is always the last element, and nothing goes after it.

## 2. Table toolbar

`DataTableToolbar` in `components/advertising/DataTableToolbar.tsx`. It sits directly above the table, outside the
table card, with an 8px gap.

```
[view] [search]   or   [n selected · Clear · actions]   ·····   ✎ | Δ ⇅ ⏷ ▥ | ⤒ ⤓ | [Primary]
```

**Icon actions** are icon-only with a tooltip. They always come in this order (`TABLE_TOOLBAR_ORDER`):

| Group | Actions, in order | Props |
|---|---|---|
| Mode | Edit | `showViewToggle` + `onViewModeChange` |
| View tools | Delta, Group by, Filter, Columns | `onShowDeltasChange`, `sortableFields`, `filterFields`, `columns` |
| Data I/O | Upload, Export | `showUpload` / `onUploadClick`, `onDownload` |

A table only switches an action on or off. It never reorders them or adds its own.

**Slots:**

- `view` is a segmented switch before the search, such as Products | Orders.
- `primaryAction` is the only labelled button, at the far right: Create campaign, Add keyword and so on.
- `selection` takes over the left zone while rows are selected: the count, Clear and actions on the selection. Those
  actions are `BarIconButton`s.

## 3. Chart bar

`ChartCard` in `components/charts/ChartCard.tsx`. Use `ChartBar` alone only outside a card, as in a modal.

```
Title · context ⓘ          [settings… (chips)] | [line bar area] | ⋯ ⤢
                                                                         (legend under the plot)
```

- **Title:** `title`, with `context` for the period or "Showing N items", and an optional `info`.
- **Settings:** `controls` takes `BarChip`s for metrics (multi, max 4), frequency, compare and so on.
- **Chart type:** `chartType` / `chartTypes` draw an icon switch, always ordered line → bar → area → scatter.
- **⋯ menu:** Download PNG (from the plot's SVG; turn off with `png={false}` for non-SVG plots) and Download CSV (via
  `csv`).
- **Expand:** always last. It opens a dialog with the same bar.
- **Under the plot:** `legend` for series, or `footer` for a gradient scale.
- **Height:** `height` is `sm` (240) / `md` (300) / `lg` (400), `"fill"` or `"auto"`. Don't use one-off numbers.

Colors come from `lib/constants/metrics.ts`: one color per metric everywhere, and `SERIES_COLORS` for anything
else.

## Where does my new option go?

| The option… | Put it in |
|---|---|
| scopes the whole page (date, account-level filter, ad type) | a page bar chip (`filters`) |
| refreshes or applies the page's settings | Run, which already exists |
| acts on the table's rows or view (sort, filter, columns, export) | a toolbar icon, in its group |
| switches what the table lists (Products / Orders) | the toolbar `view` |
| creates something new from the table | the toolbar `primaryAction`, one per table |
| acts on selected rows | the toolbar `selection.actions` |
| changes one chart (metric, frequency, compare) | a chart bar chip (`controls`) |
| changes how one chart draws (line / bar) | `chartTypes` |
| exports one chart | `csv` (PNG is automatic) |

## Parts

These are in `components/bars`. Every control in a bar is `h-8` (2rem).

- **`BarChip`:** the only way a bar shows a setting. It is single select, or `multiple` with `max` and `min`.
- **`BarChipTrigger`:** the chip face, for custom panels.
- **`BarIconButton`:** an icon action with its name in a tooltip, `active`, and `badge` (a count or a dot).
- **`BarSegmented`:** a segmented switch, labelled or `iconOnly`.
- **`BarDivider`:** the line between groups.
- **Buttons:** `Button size="xs"` (h-8) and `size="icon-sm"` (h-8 square).
