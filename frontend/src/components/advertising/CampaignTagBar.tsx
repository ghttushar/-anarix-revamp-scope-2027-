import { X } from "lucide-react";
import { AnxPlus, AnxTag } from "@/components/icons";
import { TagPopover } from "./TagPopover";
import { useTags } from "@/contexts/TagsContext";
import { cn } from "@/lib/utils";

interface CampaignTagBarProps {
  campaignId: string;
  isEdit: boolean;
  /** Prefix a "·" separator (when it renders), for use inside a meta line. */
  separator?: boolean;
}

/**
 * A campaign's tag, inline in the meta line under its name: a small tag glyph and the name in 11px text, no chip.
 * Edit mode adds a remove ✕ on the tag, or a quiet "+ Tag" that opens TagPopover. One tag per campaign.
 * Renders nothing in view mode when untagged.
 */
export function CampaignTagBar({ campaignId, isEdit, separator }: CampaignTagBarProps) {
  const { getEffectiveTags, toggleTag, removeTag, draftTags } = useTags();
  const tags = getEffectiveTags(campaignId);
  const isDraft = draftTags[campaignId] !== undefined;
  const tag = tags[0];

  if (!isEdit && !tag) return null;

  // One-tag enforcement: picking a new tag replaces the current one; picking the current one removes it.
  const handleToggle = (t: string) => {
    if (tags.includes(t)) {
      removeTag(campaignId, t);
      return;
    }
    tags.forEach((existing) => removeTag(campaignId, existing));
    toggleTag(campaignId, t);
  };

  return (
    <span className="inline-flex min-w-0 items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      {separator && <span aria-hidden className="text-2xs leading-none text-faint">·</span>}
      {tag ? (
        <span
          className={cn(
            "inline-flex min-w-0 items-center gap-1 text-2xs font-medium leading-none",
            isDraft ? "text-primary" : "text-body",
          )}
          title={isDraft ? `${tag} (unsaved)` : tag}
        >
          <AnxTag className="h-3 w-3 shrink-0 opacity-70" />
          <span className="max-w-[110px] truncate">{tag}</span>
          {isEdit && (
            <button
              type="button"
              onClick={() => removeTag(campaignId, tag)}
              className="rounded p-px text-muted-foreground hover:bg-hover hover:text-foreground"
              title="Remove tag"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
        </span>
      ) : (
        <TagPopover
          selectedTags={tags}
          onToggle={handleToggle}
          trigger={
            <button
              type="button"
              className="inline-flex items-center gap-0.5 rounded px-0.5 text-2xs leading-4 text-muted-foreground transition-colors hover:bg-hover hover:text-primary"
              title="Add tag"
            >
              <AnxPlus className="h-2.5 w-2.5" />
              Tag
            </button>
          }
        />
      )}
    </span>
  );
}
