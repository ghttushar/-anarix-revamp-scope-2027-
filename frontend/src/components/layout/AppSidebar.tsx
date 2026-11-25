import { useState, useRef, useCallback, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid, TrendingUp, FileText, MapPin, Megaphone, Target, MousePointerClick, Package, Database, Search, BarChart3, Clock, CalendarClock, Settings, Users, ChevronDown, ChevronRight, FlaskConical, User, LogOut, PanelLeft, Link, LayoutDashboard, ShieldCheck, Plug, CreditCard, BellRing, Wand2, ScrollText, ScanEye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SidebarHoverPopup } from "./SidebarHoverPopup";
import { MarketplaceSelector } from "./MarketplaceSelector";

import { AanGlyph } from "@/components/aan/AanGlyph";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AnarixLogo } from "@/components/branding/AnarixLogo";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}
interface NavGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

/** Pages that stand on their own at the top of the nav, outside any group. */
const standaloneItems: NavItem[] = [
  { title: "Glance", url: "/glance", icon: ScanEye },
  { title: "Signals", url: "/signals", icon: BellRing },
];

const navigationGroups: NavGroup[] = [{
  label: "Profitability",
  icon: TrendingUp,
  items: [
    { title: "Dashboard", url: "/profitability/dashboard", icon: LayoutDashboard },
    { title: "Trends", url: "/profitability/trends", icon: TrendingUp },
    { title: "Profit & Loss", url: "/profitability/pnl", icon: FileText },
    { title: "Geographical Data", url: "/profitability/geo", icon: MapPin },
  ]
}, {
  label: "Advertising",
  icon: Megaphone,
  items: [
    { title: "Campaign Manager", url: "/advertising/campaigns", icon: Megaphone },
    { title: "Campaign Creator", url: "/advertising/campaign-creator", icon: Wand2 },
    { title: "Impact Analysis", url: "/advertising/impact", icon: Target },
    { title: "Targeting Actions", url: "/advertising/targeting", icon: MousePointerClick },
  ]
}, {
  label: "Rules",
  icon: ShieldCheck,
  items: [
    { title: "Rule Agents", url: "/advertising/rules/agents", icon: FlaskConical },
    { title: "Applied Rules", url: "/advertising/rules/applied", icon: ShieldCheck },
  ]
}, {
  label: "Catalog",
  icon: Package,
  items: [
    { title: "Products", url: "/catalog/products", icon: Package },
  ]
}, {
  label: "AMC",
  icon: Database,
  items: [
    { title: "Queries", url: "/amc/queries", icon: Database },
    { title: "Executed Queries", url: "/amc/executed", icon: FileText },
    { title: "Schedules", url: "/amc/schedules", icon: CalendarClock },
    { title: "Audiences", url: "/amc/audiences", icon: Users },
    { title: "Created Audiences", url: "/amc/created-audiences", icon: Users },
    { title: "Instances", url: "/amc/instances", icon: LayoutGrid },
  ]
}, {
  label: "Business Intelligence",
  icon: BarChart3,
  items: [
    { title: "Brand SOV", url: "/bi/brand-sov", icon: BarChart3 },
    { title: "Keyword Tracker", url: "/bi/keyword-tracker", icon: Search },
    { title: "Keyword SOV", url: "/bi/keyword-sov", icon: BarChart3 },
    { title: "Product SOV", url: "/bi/product-sov", icon: Package },
  ]
}, {
  label: "Day Parting",
  icon: Clock,
  items: [
    { title: "Day Parting", url: "/dayparting", icon: Clock },
  ]
}];

export { navigationGroups, standaloneItems };
export type { NavItem, NavGroup };

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  // (Ask Aan navigates to /aan via react-router)
  // theme toggle moved to Floating Action Island
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [triggerRects, setTriggerRects] = useState<Record<string, DOMRect | null>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const group of navigationGroups) {
      if (group.items.some(item => currentPath.startsWith(item.url))) {
        initial.add(group.label);
      }
    }
    if (initial.size === 0) initial.add("Profitability");
    return initial;
  });

  useEffect(() => {
    for (const group of navigationGroups) {
      if (group.items.some(item => currentPath.startsWith(item.url))) {
        setOpenSections(prev => {
          if (prev.has(group.label)) return prev;
          const next = new Set(prev);
          next.add(group.label);
          return next;
        });
      }
    }
  }, [currentPath]);

  const handleMouseEnter = useCallback((label: string) => {
    if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); hoverTimeoutRef.current = null; }
    const trigger = triggerRefs.current[label];
    if (trigger) setTriggerRects(prev => ({ ...prev, [label]: trigger.getBoundingClientRect() }));
    setHoveredGroup(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredGroup(null), 200);
  }, []);

  useEffect(() => {
    return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); };
  }, []);

  const toggleSection = (label: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label); else next.add(label);
      return next;
    });
  };

  const isActive = (path: string) => currentPath.startsWith(path);

  const filteredGroups = navigationGroups;

  return (
    <Sidebar className={cn("overflow-hidden rounded-r-2xl border-r border-sidebar-border bg-sidebar transition-all duration-200", collapsed ? "w-14" : "w-[--sidebar-width]")} collapsible="icon">
      {/* overflow-hidden defeats shadcn SidebarContent's default overflow-auto so
          header/Aan/marketplace/footer stay pinned and only the nav-groups
          section scrolls (critical for tablet portrait viewports). */}
      <SidebarContent className="flex flex-col h-full overflow-hidden">
        {/* Header: Logo left, Toggle right */}
        <div className={cn(
          "flex items-center h-12 border-b border-border/30 shrink-0",
          collapsed ? "justify-center px-1" : "justify-between px-3"
        )}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-sidebar-accent transition-colors"
                >
                  <AnarixLogo variant="symbol" className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          ) : (
            <>
              <AnarixLogo variant="full" className="h-6 w-auto" />
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Marketplace Selector */}
        <MarketplaceSelector />

        <div className="mx-3 border-t border-border/30" />

        {/* Aan Button — slim pill */}
        <div className={cn("shrink-0", collapsed ? "px-1 py-2" : "px-3 py-2")}>
          {!collapsed ? (
            <button
              onClick={e => { e.stopPropagation(); e.preventDefault(); navigate("/aan"); }}
              className="k-inset group relative w-full flex items-center gap-2 h-9 rounded-full border border-border/60 bg-surface px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              <div className="absolute inset-0 rounded-full aan-gradient opacity-0 group-hover:opacity-[0.06] transition-opacity" />
              <AanGlyph className="h-4 w-4 shrink-0 aan-gradient-text" staticEyes />
              <span>Ask Aan</span>
            </button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={e => { e.stopPropagation(); e.preventDefault(); navigate("/aan"); }}
                  className="group relative flex w-full items-center justify-center rounded-md h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                >
                  <AanGlyph className="h-4 w-4 aan-gradient-text" staticEyes />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Ask Aan</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="mx-3 border-t border-border/30" />

        {/* Standalone pages */}
        <div className={cn("shrink-0 py-1", collapsed ? "px-1 space-y-1" : "")}>
          {standaloneItems.map(item =>
            !collapsed ? (
              <NavLink
                key={item.url}
                to={item.url}
                className={cn(
                  "flex items-center gap-2.5 rounded-md mx-1 px-3 py-2 text-sm font-semibold transition-colors",
                  isActive(item.url)
                    ? "k-nav-active bg-selected text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
              </NavLink>
            ) : (
              <Tooltip key={item.url}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.url}
                    className={cn(
                      "flex items-center justify-center rounded-md p-2 transition-colors",
                      isActive(item.url) ? "bg-primary/10 text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            )
          )}
        </div>

        <div className="mx-3 border-t border-border/30" />

        {/* Navigation Groups */}
        <div className="flex-1 overflow-auto py-1">
          {filteredGroups.map(group => (
            <SidebarGroup key={group.label} className="py-0.5">
              {!collapsed ? (
                <Collapsible open={openSections.has(group.label)} onOpenChange={() => toggleSection(group.label)}>
                  <CollapsibleTrigger asChild>
                    <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-md mx-1">
                      <span>{group.label}</span>
                      {openSections.has(group.label) ? <ChevronDown className="h-3 w-3 opacity-50" /> : <ChevronRight className="h-3 w-3 opacity-50" />}
                    </SidebarGroupLabel>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden transition-all duration-200 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <SidebarGroupContent>
                      <SidebarMenu className="space-y-px">
                        {group.items.map(item => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                              <NavLink
                                to={item.url}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-md pl-6 pr-2 py-1.5 text-sm transition-colors",
                                  isActive(item.url)
                                    ? "bg-selected text-primary border-l-2 border-primary ml-0 pl-[25px]"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                              >
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span>{item.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <button
                          ref={el => { triggerRefs.current[group.label] = el; }}
                          className={cn(
                            "flex items-center justify-center rounded-md p-2 transition-colors text-sidebar-foreground hover:bg-sidebar-accent",
                            hoveredGroup === group.label && "bg-sidebar-accent"
                          )}
                          title={group.label}
                          onMouseEnter={() => handleMouseEnter(group.label)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <group.icon className="h-4 w-4" />
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          ))}
        </div>

        {/* Footer: Theme + Profile in single row */}
        <div className="shrink-0 border-t border-border/30 px-2 py-2">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 text-sm hover:bg-sidebar-accent transition-colors min-w-0">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-2xs font-semibold">JD</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground truncate">John Doe</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start" className="w-[220px]">
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/appearance")}>
                    <Settings className="h-4 w-4" /><span>Preferences</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/accounts")}>
                    <Link className="h-4 w-4" /><span>Accounts</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/integrations")}>
                    <Plug className="h-4 w-4" /><span>Integrations</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/team")}>
                    <Users className="h-4 w-4" /><span>Team</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/billing")}>
                    <CreditCard className="h-4 w-4" /><span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/logs")}>
                    <ScrollText className="h-4 w-4" /><span>Logs</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" /><span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4" /><span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center rounded-md p-1.5 hover:bg-sidebar-accent transition-colors">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-2xs font-semibold">JD</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="w-[220px]">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@anarix.com</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/appearance")}>
                    <Settings className="h-4 w-4" /><span>Preferences</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/accounts")}>
                    <Link className="h-4 w-4" /><span>Accounts</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/integrations")}>
                    <Plug className="h-4 w-4" /><span>Integrations</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/team")}>
                    <Users className="h-4 w-4" /><span>Team</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/billing")}>
                    <CreditCard className="h-4 w-4" /><span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/settings/logs")}>
                    <ScrollText className="h-4 w-4" /><span>Logs</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" /><span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4" /><span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Hover popups for collapsed state */}
        {collapsed && filteredGroups.map(group => (
          <SidebarHoverPopup
            key={group.label}
            items={group.items}
            isVisible={hoveredGroup === group.label}
            groupLabel={group.label}
            triggerRect={triggerRects[group.label] || null}
            currentPath={currentPath}
            onMouseEnter={() => handleMouseEnter(group.label)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
