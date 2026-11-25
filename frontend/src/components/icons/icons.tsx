import { createIcon } from "./create-icon";

/*
  Anarix icon set. 16×16 grid, content kept inside 2–14 (1.5–2px padding),
  1.7 round stroke, no fills except tiny dots. The brand detail — Aan's
  rounded diamond — appears in Glance, Insights and Sparkle only.
*/

/** A tiny filled dot (the only filled shape in the set). */
const dot = (cx: number, cy: number, r = 0.9) => <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />;

/** Aan's rounded diamond: a soft-cornered square rotated 45°, `h` = half-diagonal. */
const diamond = (cx: number, cy: number, h: number, rx = 1.25) => {
  const s = h * Math.SQRT2;
  return <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx={rx} transform={`rotate(45 ${cx} ${cy})`} />;
};

/* Shared download/upload tray. */
const TRAY = "M2.75 10.25v1.5c0 .97.78 1.75 1.75 1.75h7c.97 0 1.75-.78 1.75-1.75v-1.5";

/* ---------------------------------------------------------- table toolbar */
export const AnxSearch = createIcon(
  "AnxSearch",
  <>
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.4 10.4l3.1 3.1" />
  </>,
);

export const AnxFilter = createIcon("AnxFilter", <path d="M2.5 4.25h11M4.5 8h7M6.5 11.75h3" />);

export const AnxColumns = createIcon(
  "AnxColumns",
  <>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
    <path d="M6.17 2.5v11M9.83 2.5v11" />
  </>,
);

export const AnxExport = createIcon("AnxExport", <path d={`M8 2.5v6.75M5.25 6.5 8 9.25l2.75-2.75${TRAY}`} />);

export const AnxUpload = createIcon("AnxUpload", <path d={`M8 9.25V2.5M5.25 5.25 8 2.5l2.75 2.75${TRAY}`} />);

export const AnxEdit = createIcon(
  "AnxEdit",
  <path d="M3 13l.55-2.75 7.2-7.2a1.4 1.4 0 0 1 2 0l.2.2a1.4 1.4 0 0 1 0 2l-7.2 7.2zM9.5 4.3l2.2 2.2" />,
);

export const AnxDelta = createIcon("AnxDelta", <path d="M2.5 11.75 6 8.25l2.5 2 5-5M10 5.25h3.5v3.5" />);

export const AnxSort = createIcon("AnxSort", <path d="M5.25 13V3M2.75 5.5l2.5-2.5 2.5 2.5M10.75 3v10M8.25 10.5l2.5 2.5 2.5-2.5" />);

export const AnxSortUp = createIcon("AnxSortUp", <path d="M8 13V3M4.5 6.5 8 3l3.5 3.5" />);

export const AnxSortDown = createIcon("AnxSortDown", <path d="M8 3v10M4.5 9.5 8 13l3.5-3.5" />);

const PIN = "M5.75 2.5h4.5M6.5 2.5v3.25L4.5 8.5v1h7v-1L9.5 5.75V2.5M8 9.5v4";
export const AnxPin = createIcon("AnxPin", <path d={PIN} />);

export const AnxPinOff = createIcon("AnxPinOff", <path d={`${PIN}M2.5 2.5l11 11`} />);

export const AnxPlus = createIcon("AnxPlus", <path d="M8 3v10M3 8h10" />);

export const AnxClose = createIcon("AnxClose", <path d="M4 4l8 8M12 4l-8 8" />);

export const AnxCheck = createIcon("AnxCheck", <path d="M3.25 8.5l3 3 6.5-7" />);

export const AnxMore = createIcon(
  "AnxMore",
  <>
    {dot(3.5, 8, 1.1)}
    {dot(8, 8, 1.1)}
    {dot(12.5, 8, 1.1)}
  </>,
);

/* ----------------------------------------------------- page bar / chart bar */
export const AnxCalendar = createIcon(
  "AnxCalendar",
  <>
    <rect x="2.5" y="3.5" width="11" height="10" rx="2" />
    <path d="M2.5 6.75h11M5.5 2v3M10.5 2v3" />
    {dot(5.5, 9.75)}
  </>,
);

export const AnxRun = createIcon(
  "AnxRun",
  <path d="M5 3.85v8.3a.85.85 0 0 0 1.3.72l6.5-4.15a.85.85 0 0 0 0-1.44L6.3 3.13A.85.85 0 0 0 5 3.85z" />,
);

const BELL = "M3.5 11.5h9M4.5 11.5V7.25a3.5 3.5 0 0 1 7 0v4.25M6.75 13.75h2.5";
export const AnxBell = createIcon("AnxBell", <path d={BELL} />);

export const AnxInsights = createIcon(
  "AnxInsights",
  <>
    {diamond(8, 6.75, 4.5, 1.6)}
    <path d="M6.5 13.75h3" />
    {dot(8, 6.75)}
  </>,
);

export const AnxRefresh = createIcon(
  "AnxRefresh",
  <path d="M3 8a5 5 0 0 1 8.9-3.1L13 6M13 3v3h-3M13 8a5 5 0 0 1-8.9 3.1L3 10M3 13v-3h3" />,
);

export const AnxChevronDown = createIcon("AnxChevronDown", <path d="M4 6l4 4 4-4" />);
export const AnxChevronRight = createIcon("AnxChevronRight", <path d="M6 4l4 4-4 4" />);
export const AnxChevronLeft = createIcon("AnxChevronLeft", <path d="M10 4 6 8l4 4" />);

export const AnxExpand = createIcon("AnxExpand", <path d="M9.5 2.5h4v4M13.5 2.5 9.25 6.75M6.5 13.5h-4v-4M2.5 13.5l4.25-4.25" />);

const AXIS = "M2.5 2.5v9.25c0 .97.78 1.75 1.75 1.75h9.25";
export const AnxChartLine = createIcon("AnxChartLine", <path d={`${AXIS}M5.25 10 7.75 7l2 1.5 3.5-4`} />);

export const AnxChartBar = createIcon("AnxChartBar", <path d="M2.5 13.5h11M4.75 10.75V8M8 10.75v-7M11.25 10.75V6" />);

export const AnxChartArea = createIcon("AnxChartArea", <path d="M2.5 13.5V10l3.25-3.5 3 2.5 4.75-5v9.5z" />);

export const AnxChartScatter = createIcon(
  "AnxChartScatter",
  <>
    <path d={AXIS} />
    {dot(6, 10, 1)}
    {dot(8.75, 6.75, 1)}
    {dot(11.25, 9.25, 1)}
    {dot(12, 4.75, 1)}
  </>,
);

export const AnxInfo = createIcon(
  "AnxInfo",
  <>
    <circle cx="8" cy="8" r="5.75" />
    <path d="M8 7.4v3.6" />
    {dot(8, 5.1)}
  </>,
);

/* ---------------------------------------------------------- action island */
export const AnxGrip = createIcon(
  "AnxGrip",
  <>
    {dot(6, 4, 1)}
    {dot(10, 4, 1)}
    {dot(6, 8, 1)}
    {dot(10, 8, 1)}
    {dot(6, 12, 1)}
    {dot(10, 12, 1)}
  </>,
);

export const AnxSun = createIcon(
  "AnxSun",
  <>
    <circle cx="8" cy="8" r="2.6" />
    <path d="M8 1.75v1.6M8 12.65v1.6M1.75 8h1.6M12.65 8h1.6M3.6 3.6l1.15 1.15M11.25 11.25l1.15 1.15M3.6 12.4l1.15-1.15M11.25 4.75l1.15-1.15" />
  </>,
);

export const AnxMoon = createIcon("AnxMoon", <path d="M8.5 2.5a4.25 4.25 0 0 0 5 5 5.5 5.5 0 1 1-5-5z" />);

export const AnxInbox = createIcon(
  "AnxInbox",
  <path d="M2.5 9h3l1 1.75h3l1-1.75h3M2.5 9v2.5c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2V9l-1.75-4.55a1.5 1.5 0 0 0-1.4-.95h-6.7a1.5 1.5 0 0 0-1.4.95z" />,
);

/* ---------------------------------------------------------------- left nav */
export const AnxGlance = createIcon(
  "AnxGlance",
  <>
    <path d="M2 8c1.55-2.85 3.55-4.4 6-4.4s4.45 1.55 6 4.4c-1.55 2.85-3.55 4.4-6 4.4S3.55 10.85 2 8z" />
    {diamond(8, 8, 2.1, 0.7)}
  </>,
);

export const AnxSignals = createIcon(
  "AnxSignals",
  <>
    {dot(8, 8, 1.15)}
    <path d="M5.5 5.5a3.5 3.5 0 0 0 0 5M10.5 5.5a3.5 3.5 0 0 1 0 5M3.6 3.6a6.2 6.2 0 0 0 0 8.8M12.4 3.6a6.2 6.2 0 0 1 0 8.8" />
  </>,
);

export const AnxDashboard = createIcon(
  "AnxDashboard",
  <>
    <rect x="2.5" y="2.5" width="4.5" height="6.25" rx="1.5" />
    <rect x="9" y="2.5" width="4.5" height="4" rx="1.5" />
    <rect x="2.5" y="10.75" width="4.5" height="2.75" rx="1.25" />
    <rect x="9" y="8.5" width="4.5" height="5" rx="1.5" />
  </>,
);

export const AnxTrends = createIcon(
  "AnxTrends",
  <>
    <path d="M2.5 11c2.4 0 3.5-1.7 4.6-3.6s2.2-3.3 3.5-3.4M2.5 13.75h11" />
    <circle cx="12.1" cy="4" r="1.5" />
  </>,
);

export const AnxProfitLoss = createIcon(
  "AnxProfitLoss",
  <path d="M9.75 2.5H5c-.83 0-1.5.67-1.5 1.5v8c0 .83.67 1.5 1.5 1.5h6c.83 0 1.5-.67 1.5-1.5V5.25zM9.75 2.5v2.75h2.75M5.75 8.25h4.5M5.75 10.75h2.75" />,
);

export const AnxGeo = createIcon(
  "AnxGeo",
  <>
    <path d="M8 14s4.5-4.1 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 9.9 8 14 8 14z" />
    <circle cx="8" cy="6.5" r="1.6" />
  </>,
);

export const AnxAdvertising = createIcon(
  "AnxAdvertising",
  <path d="M3.5 6h2l6-3v10l-6-3h-2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM5.5 10l.75 3.25M13.75 6.75v2.5" />,
);

export const AnxCampaignManager = createIcon(
  "AnxCampaignManager",
  <>
    <path d="M4.75 4.25v-.25c0-.83.67-1.5 1.5-1.5h5.75c.83 0 1.5.67 1.5 1.5v5.25c0 .83-.67 1.5-1.5 1.5h-.25" />
    <rect x="2.5" y="5.75" width="8.75" height="7.75" rx="1.5" />
    <path d="M5 9.5h3.75" />
  </>,
);

export const AnxCampaignCreator = createIcon(
  "AnxCampaignCreator",
  <>
    <path d="M3 13l7.25-7.25M11.75 1.9v3M10.25 3.4h3" />
    {dot(13.4, 7.4)}
    {dot(7.6, 2.6)}
  </>,
);

export const AnxImpact = createIcon(
  "AnxImpact",
  <>
    <circle cx="8" cy="8" r="5.5" />
    <circle cx="8" cy="8" r="2.85" />
    {dot(8, 8, 1)}
  </>,
);

export const AnxTargeting = createIcon(
  "AnxTargeting",
  <>
    <circle cx="8" cy="8" r="4.25" />
    <path d="M8 1.75v3M8 11.25v3M1.75 8h3M11.25 8h3" />
    {dot(8, 8)}
  </>,
);

export const AnxRules = createIcon(
  "AnxRules",
  <path d="M8 2l4.75 1.75v3.9c0 3.1-2 5.1-4.75 6.35C5.25 12.75 3.25 10.75 3.25 7.65v-3.9zM5.85 8l1.5 1.5 2.85-3" />,
);

export const AnxRuleAgents = createIcon(
  "AnxRuleAgents",
  <>
    <rect x="2.75" y="5.5" width="10.5" height="8" rx="2.5" />
    <path d="M8 5.5V3.75M1.75 9v1.5M14.25 9v1.5" />
    {dot(8, 2.6)}
    {dot(6, 9.5, 1)}
    {dot(10, 9.5, 1)}
  </>,
);

export const AnxCatalog = createIcon(
  "AnxCatalog",
  <path d="M8 2.25 13.25 5v6L8 13.75 2.75 11V5zM2.75 5 8 7.75 13.25 5M8 7.75v6M5.4 3.6l5.25 2.75" />,
);

export const AnxAmc = createIcon(
  "AnxAmc",
  <>
    <ellipse cx="8" cy="4.25" rx="5" ry="1.75" />
    <path d="M3 4.25v7.5C3 12.72 5.24 13.5 8 13.5s5-.78 5-1.75v-7.5M3 8c0 .97 2.24 1.75 5 1.75S13 8.97 13 8" />
  </>,
);

export const AnxBi = createIcon(
  "AnxBi",
  <>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
    <path d="M5.5 10.5V8.25M8 10.5v-5M10.5 10.5V7" />
  </>,
);

export const AnxDayParting = createIcon(
  "AnxDayParting",
  <>
    <circle cx="8" cy="8" r="5.75" />
    <path d="M8 4.9v3.35l2.1 1.3" />
  </>,
);

export const AnxSchedule = createIcon(
  "AnxSchedule",
  <>
    <path d="M13.5 7.25v-2c0-.97-.78-1.75-1.75-1.75h-7.5c-.97 0-1.75.78-1.75 1.75v6.5c0 .97.78 1.75 1.75 1.75H6.5M2.5 6.75h11M5.5 2v3M10.5 2v3" />
    <circle cx="11" cy="11" r="2.9" />
    <path d="M11 9.75V11l.85.7" />
  </>,
);

export const AnxSettings = createIcon(
  "AnxSettings",
  <>
    <path d="M6.57 3.84 6.98 2.19A5.9 5.9 0 0 1 9.02 2.19L9.43 3.84A4.4 4.4 0 0 1 10.89 4.68L12.52 4.21A5.9 5.9 0 0 1 13.54 5.98L12.32 7.16A4.4 4.4 0 0 1 12.32 8.84L13.54 10.02A5.9 5.9 0 0 1 12.52 11.79L10.89 11.32A4.4 4.4 0 0 1 9.43 12.16L9.02 13.81A5.9 5.9 0 0 1 6.98 13.81L6.57 12.16A4.4 4.4 0 0 1 5.11 11.32L3.48 11.79A5.9 5.9 0 0 1 2.46 10.02L3.68 8.84A4.4 4.4 0 0 1 3.68 7.16L2.46 5.98A5.9 5.9 0 0 1 3.48 4.21L5.11 4.68A4.4 4.4 0 0 1 6.57 3.84z" />
    <circle cx="8" cy="8" r="1.85" />
  </>,
);

export const AnxTeam = createIcon(
  "AnxTeam",
  <>
    <circle cx="6" cy="5.5" r="2.25" />
    <path d="M2 13.25c.4-2.35 2-3.75 4-3.75s3.6 1.4 4 3.75M10.5 3.35a2.25 2.25 0 0 1 0 4.3M11.6 9.65c1.35.45 2.25 1.65 2.5 3.6" />
  </>,
);

export const AnxBilling = createIcon(
  "AnxBilling",
  <>
    <rect x="2" y="3.5" width="12" height="9" rx="2" />
    <path d="M2 6.75h12M4.5 10h2.5" />
  </>,
);

export const AnxIntegrations = createIcon("AnxIntegrations", <path d="M4.5 6h7v2.5a3.5 3.5 0 0 1-7 0zM6 6V2.5M10 6V2.5M8 12v2" />);

export const AnxLogs = createIcon(
  "AnxLogs",
  <>
    {dot(3.5, 4)}
    {dot(3.5, 8)}
    {dot(3.5, 12)}
    <path d="M6.5 4h7M6.5 8h7M6.5 12h4.5" />
  </>,
);

export const AnxNotifications = createIcon(
  "AnxNotifications",
  <path d="M4 11.75h8M5 11.75V7.5a3 3 0 0 1 6 0v4.25M7 13.9h2M2 6.25a5.5 5.5 0 0 1 1.6-3.35M14 6.25a5.5 5.5 0 0 0-1.6-3.35" />,
);

export const AnxAccounts = createIcon(
  "AnxAccounts",
  <path d="M2.5 6.25 3.75 3h8.5l1.25 3.25M2.5 6.25a1.84 1.84 0 0 0 3.67 0 1.83 1.83 0 0 0 3.66 0 1.84 1.84 0 0 0 3.67 0M3.5 7.9v4.6a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7.9M6.5 13.5v-2.75h3v2.75" />,
);

export const AnxSidebarToggle = createIcon(
  "AnxSidebarToggle",
  <>
    <rect x="2.5" y="2.5" width="11" height="11" rx="2" />
    <path d="M6.5 2.5v11" />
  </>,
);

export const AnxUser = createIcon(
  "AnxUser",
  <>
    <circle cx="8" cy="5.5" r="2.6" />
    <path d="M3 13.5c.6-2.5 2.6-3.75 5-3.75s4.4 1.25 5 3.75" />
  </>,
);

export const AnxLogout = createIcon(
  "AnxLogout",
  <path d="M6 13.5H4c-.83 0-1.5-.67-1.5-1.5V4c0-.83.67-1.5 1.5-1.5h2M10.5 5l3 3-3 3M13.5 8h-7" />,
);

export const AnxLink = createIcon("AnxLink", <path d="M6.5 11H5a3 3 0 0 1 0-6h1.5M9.5 5H11a3 3 0 0 1 0 6H9.5M5.5 8h5" />);

export const AnxSparkle = createIcon(
  "AnxSparkle",
  <path d="M7 4c.45 2.7 1.8 4.05 4.5 4.5-2.7.45-4.05 1.8-4.5 4.5-.45-2.7-1.8-4.05-4.5-4.5 2.7-.45 4.05-1.8 4.5-4.5zM12.25 2v3.25M10.63 3.63h3.25" />,
);

/* ------------------------------------------------------------ bulk edits */
export const AnxPlay = createIcon(
  "AnxPlay",
  <>
    <circle cx="8" cy="8" r="5.75" />
    <path d="M6.9 5.9v4.2l3.2-2.1z" />
  </>,
);

export const AnxPause = createIcon(
  "AnxPause",
  <>
    <circle cx="8" cy="8" r="5.75" />
    <path d="M6.6 6v4M9.4 6v4" />
  </>,
);

export const AnxTag = createIcon(
  "AnxTag",
  <>
    <path d="M2.75 3.75v3.6c0 .4.16.78.44 1.06l4.4 4.4c.59.59 1.54.59 2.12 0l2.85-2.85c.59-.59.59-1.54 0-2.12l-4.4-4.4a1.5 1.5 0 0 0-1.06-.44h-3.1a1.25 1.25 0 0 0-1.25 1.25z" />
    {dot(5.6, 5.6)}
  </>,
);

/** Daily budget: a coin. */
export const AnxBudget = createIcon(
  "AnxBudget",
  <>
    <circle cx="8" cy="8" r="5.75" />
    <path d="M9.75 6.1c-.3-.5-.95-.85-1.75-.85-1 0-1.75.55-1.75 1.3 0 1.65 3.5.8 3.5 2.6 0 .75-.8 1.35-1.75 1.35-.85 0-1.5-.35-1.8-.9M8 4.4v.85M8 10.5v1.1" />
  </>,
);

/** Total budget: a stack of coins. */
export const AnxBudgetTotal = createIcon(
  "AnxBudgetTotal",
  <>
    <ellipse cx="8" cy="4.5" rx="4.75" ry="1.75" />
    <path d="M3.25 4.5v3.5c0 .97 2.13 1.75 4.75 1.75s4.75-.78 4.75-1.75V4.5M3.25 8v3.5c0 .97 2.13 1.75 4.75 1.75s4.75-.78 4.75-1.75V8" />
  </>,
);

/** Set status: a toggle switch. */
export const AnxStatus = createIcon(
  "AnxStatus",
  <>
    <rect x="1.75" y="4.75" width="12.5" height="6.5" rx="3.25" />
    <circle cx="10.75" cy="8" r="1.6" />
  </>,
);
