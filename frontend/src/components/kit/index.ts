/**
 * "Pro" UI kit — dense, non-boxy. Foundations are CSS variables scoped to [data-kit="pro"] (index.css); the shared
 * primitives (Button, Input, Select, bars, tables) read them. The whole app is in that scope (index.html sets
 * data-kit="pro" on <html>). Showcase: /kit.
 */
export { Workspace, Zone, ZoneHeader } from "./Workspace";
export { StatusDot, type StatusTone } from "./StatusDot";
export { StepFooter } from "./StepFooter";
