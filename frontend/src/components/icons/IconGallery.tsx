import type { AnxIcon } from "./create-icon";
import * as icons from "./icons";

const ENTRIES = Object.entries(icons as Record<string, AnxIcon>).filter(([name]) => name.startsWith("Anx"));

/** Every Anarix icon in a responsive grid, each with its export name. */
export function IconGallery({ className }: { className?: string }) {
  return (
    <div className={`grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-3 ${className ?? ""}`}>
      {ENTRIES.map(([name, Icon]) => (
        <div
          key={name}
          title={name}
          className="flex flex-col items-center gap-1.5 rounded-md p-2 text-muted-foreground hover:bg-hover hover:text-foreground"
        >
          <Icon className="h-5 w-5" />
          <span className="max-w-full truncate text-2xs">{name}</span>
        </div>
      ))}
    </div>
  );
}
