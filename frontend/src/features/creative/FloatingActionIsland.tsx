import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RefreshCw, Lightbulb, GripVertical, Bell, Sun, Moon, Inbox } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

import { AanGlyph } from "@/components/aan/AanGlyph";
import { AanMascot } from "@/components/aan/AanMascot";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useInsights } from "@/components/insights";
import { toast } from "sonner";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useAan } from "@/components/aan/AanContext";
import { KeyboardShortcutsDialog } from "@/components/shortcuts/KeyboardShortcutsDialog";
import { LegacyNotificationsDrawer, useLegacyUnreadNotifications } from "@legacy/shell/notifications-bridge";

interface ActionItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  highlight?: boolean;
  badge?: number;
  alwaysShowLabel?: boolean;
}

const hiddenRoutes = ["/login", "/onboarding", "/settings", "/advertising/campaign-creator"];

export function FloatingActionIsland() {
  const isTabletView = false;
  const [isExpanded, setIsExpanded] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number; pointerId: number; el: HTMLElement } | null>(null);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabletIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { openCopilot, mode } = useAan();
  const { criticalCount: insightsCriticalCount } = useInsights();
  const unreadNotifications = useLegacyUnreadNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  

  const scheduleTabletCollapse = useCallback(() => {
    if (!isTabletView) return;
    if (tabletIdleTimer.current) clearTimeout(tabletIdleTimer.current);
    tabletIdleTimer.current = setTimeout(() => setIsExpanded(false), 4000);
  }, [isTabletView]);

  const handleDragStart = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget.closest("[data-island]") as HTMLElement)?.getBoundingClientRect();
    if (!rect) return;
    const target = e.currentTarget;
    try { target.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: rect.left + rect.width / 2,
      startPosY: rect.top,
      pointerId: e.pointerId,
      el: target,
    };
    const handleMove = (ev: PointerEvent) => {
      if (!dragRef.current || ev.pointerId !== dragRef.current.pointerId) return;
      setPosition({
        x: dragRef.current.startPosX + (ev.clientX - dragRef.current.startX),
        y: dragRef.current.startPosY + (ev.clientY - dragRef.current.startY),
      });
    };
    const handleUp = (ev: PointerEvent) => {
      if (!dragRef.current || ev.pointerId !== dragRef.current.pointerId) return;
      try { dragRef.current.el.releasePointerCapture(dragRef.current.pointerId); } catch { /* ignore */ }
      setIsDragging(false);
      dragRef.current = null;
      target.removeEventListener("pointermove", handleMove);
      target.removeEventListener("pointerup", handleUp);
      target.removeEventListener("pointercancel", handleUp);
    };
    target.addEventListener("pointermove", handleMove);
    target.addEventListener("pointerup", handleUp);
    target.addEventListener("pointercancel", handleUp);
  }, []);

  const shouldHide = hiddenRoutes.some((route) => location.pathname.startsWith(route));
  if (shouldHide) return null;


  const handleMouseEnter = () => {
    if (isTabletView) return;
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (isTabletView) return;
    collapseTimer.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  };

  const toggleTabletExpand = () => {
    setIsExpanded((v) => {
      const next = !v;
      if (next) scheduleTabletCollapse();
      return next;
    });
  };

  const { setDataPanel } = useActivePanel();

  const themeAction: ActionItem = {
    icon: isDark ? Sun : Moon,
    label: isDark ? "Light mode" : "Dark mode",
    onClick: () => setTheme(isDark ? "light" : "dark"),
  };

  // anarix-ui's notification centre (Signals has its own place in the sidebar).
  const notificationsAction: ActionItem = {
    icon: Bell,
    label: "Notifications",
    onClick: () => setNotificationsOpen((v) => !v),
    badge: unreadNotifications,
  };

  const appActions: ActionItem[] = [
    notificationsAction,
    { icon: RefreshCw, label: "Refresh", onClick: () => toast.info("Refreshing data...") },
    themeAction,
  ];



  const actions = appActions;

  const style: React.CSSProperties = position
    ? { left: `${position.x}px`, top: `${position.y}px`, transform: "translateX(-50%)" }
    : { left: "50%", bottom: "24px", transform: "translateX(-50%)" };

  return (
    <>
    <div
      className="fixed z-50"
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Invisible expanded hit area */}
      <div className={cn("relative", isExpanded ? "p-4 -m-4" : "")}>
        <div
          data-island
          data-tour-id="island"
          className={cn(
            "bg-card/95 backdrop-blur-md border border-primary/60 rounded-full shadow-lg transition-all duration-300 ease-out",
            isExpanded ? "px-2 py-2" : "px-3 py-2",
            isDragging && "cursor-grabbing"
          )}
        >
          <div className="flex items-center gap-1.5">
            <button
              onPointerDown={handleDragStart}
              style={{ touchAction: "none" }}
              className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-grab active:cursor-grabbing shrink-0"
              title="Drag to reposition"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
            {isTabletView && (
              <button
                type="button"
                onClick={toggleTabletExpand}
                className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                title={isExpanded ? "Collapse" : "Expand"}
                aria-label={isExpanded ? "Collapse action island" : "Expand action island"}
              >
                <span className={cn("inline-block transition-transform", isExpanded ? "rotate-180" : "")}>
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </span>
              </button>
            )}
            <div className="h-5 w-px bg-border" />
            {mode !== "copilot" && (
              <button
                type="button"
                onClick={openCopilot}
                className="group flex items-center gap-1.5 h-9 pl-1 pr-3 rounded-full bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
                title="Ask Aan"
              >
                <AanMascot size={32} state="idle" interactive floating />
                <span className="text-sm font-medium text-foreground whitespace-nowrap">Ask Aan</span>
              </button>
            )}
            <div className="flex items-center gap-0.5">
              {actions.map((action, index) => {
                return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => { action.onClick(); scheduleTabletCollapse(); }}
                  className={cn(
                    "rounded-full transition-all duration-200 relative h-8",
                    (isExpanded || action.alwaysShowLabel) ? "px-3 gap-1.5" : "px-2",
                    action.highlight && "text-destructive"
                  )}
                >
                  <action.icon className="h-3.5 w-3.5 shrink-0" />
                  {(isExpanded || action.alwaysShowLabel) && (
                    <span className="text-xs whitespace-nowrap animate-in fade-in duration-200">{action.label}</span>
                  )}
                  {action.badge && action.badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                      {action.badge}
                    </span>
                  )}
                </Button>
                );
              })}
            </div>

            {isExpanded && (
              <div className="pl-1.5 border-l border-border" data-tour-id="island-shortcuts">
                <button
                  type="button"
                  onClick={() => setShortcutsOpen(true)}
                  title="Keyboard shortcuts — click to rebind"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <kbd className="px-1.5 py-0.5 rounded bg-muted hover:bg-primary/10 font-mono text-[10px] transition-colors">⌘K</kbd>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <KeyboardShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    <LegacyNotificationsDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
}
