/**
 * "Pro" UI kit — dense, non-boxy. Foundations are CSS variables scoped to [data-kit="pro"] (index.css); the shared
 * primitives (Button, Input, Select, bars, tables) read them, so a page gets the kit by being inside that scope.
 * Showcase: /kit. Pilot: Campaign Manager.
 */
export { Workspace, Zone, ZoneHeader } from "./Workspace";
export { StatusDot, type StatusTone } from "./StatusDot";
export { PRO_KIT_ROUTES, isProKitRoute } from "./routes";
