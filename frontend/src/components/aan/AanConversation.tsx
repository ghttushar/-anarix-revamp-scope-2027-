import { useRef, useEffect, useState } from "react";
import { useAan } from "./AanContext";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { AanMascot } from "./AanMascot";
import { useAanPresence } from "./AanPresenceContext";
import { format } from "date-fns";
import { ArtifactCard } from "./ArtifactCard";
import { FloatingDots } from "./FloatingDots";

/** compact: the narrow side panel (nav width). Smaller gutters, no user avatar, wider bubbles. */
export function AanConversation({ compact = false }: { compact?: boolean }) {
  const { messages, openSplit, isGenerating, generationType, generationProgress, isThinking } = useAan();
  const { registerAnchor } = useAanPresence();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pendingAnchorEl, setPendingAnchorEl] = useState<HTMLDivElement | null>(null);
  const [generationAnchorEl, setGenerationAnchorEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating, generationProgress, isThinking]);

  // Register the thinking row's anchor - the travelling presence shows the searching orb there while Aan prepares a reply
  useEffect(() => {
    if (isThinking) registerAnchor("pending", pendingAnchorEl, 40);
    else registerAnchor("pending", null);
    return () => registerAnchor("pending", null);
  }, [isThinking, pendingAnchorEl, registerAnchor]);

  // Register the generation card anchor - owns the live presence while generating
  useEffect(() => {
    if (isGenerating) {
      registerAnchor("generation", generationAnchorEl, 40);
    } else {
      registerAnchor("generation", null);
    }
    return () => registerAnchor("generation", null);
  }, [isGenerating, generationAnchorEl, registerAnchor]);

  return (
    <div ref={scrollRef} className={cn("flex-1 overflow-y-auto", compact ? "p-3 space-y-3" : "p-4 space-y-4")}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex",
            compact ? "gap-2" : "gap-3",
            message.role === "user" ? "flex-row-reverse" : "flex-row"
          )}
        >
          {/* Avatar */}
          <div
            className={cn(
              "flex shrink-0 items-center justify-center",
              compact ? "h-6 w-6" : "h-8 w-8",
              compact && message.role === "user" && "hidden",
              message.role === "assistant"
                ? "text-foreground"
                : "rounded-full bg-muted text-muted-foreground"
            )}
          >
            {message.role === "assistant" ? (
              <AanMascot size={compact ? 16 : 20} state="anchor" interactive={false} />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={cn(
              "flex flex-col gap-2 min-w-0",
              compact ? "max-w-[88%]" : "max-w-[80%]",
              message.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "rounded-2xl text-sm whitespace-pre-wrap break-words",
                compact ? "px-3 py-2" : "px-4 py-2.5",
                message.role === "assistant"
                  ? "bg-card text-foreground border border-border"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {message.content}
            </div>

            {/* Artifact Card (if present) */}
            {message.draft && (
              <ArtifactCard
                artifact={message.draft}
                onClick={() => openSplit(message.draft!)}
                className={compact ? "max-w-full" : "max-w-sm"}
              />
            )}

            <span className="text-xs text-muted-foreground px-2">
              {format(message.timestamp, "h:mm a")}
            </span>
          </div>
        </div>
      ))}

      {/* Thinking - Aan is preparing a reply; the presence docks here as the searching orb */}
      {isThinking && !isGenerating && (
        <div className={cn("flex flex-row items-center", compact ? "gap-2" : "gap-3")}>
          <div
            ref={setPendingAnchorEl}
            aria-hidden
            data-aan-anchor="pending"
            className="w-10 h-10 shrink-0 flex items-center justify-center"
          />
          <p className="text-sm text-muted-foreground">Thinking…</p>
        </div>
      )}

      {/* Generation Progress Indicator - rendered like an assistant message */}
      {isGenerating && (
        <div className={cn("flex flex-row", compact ? "gap-2" : "gap-3")}>
          <div
            className={cn(
              "flex shrink-0 items-center justify-center text-foreground",
              compact ? "h-6 w-6" : "h-8 w-8"
            )}
          >
            <AanMascot size={compact ? 16 : 20} state="anchor" interactive={false} />
          </div>
          <div className={cn("flex flex-col gap-2 items-start min-w-0", compact ? "max-w-[88%]" : "max-w-[80%]")}>
            <div className={cn("flex flex-row items-center rounded-2xl border border-border bg-card shadow-sm w-fit", compact ? "gap-3 px-3 py-3" : "gap-4 px-5 py-4 min-w-[280px]")}>
              <div
                ref={setGenerationAnchorEl}
                aria-hidden
                data-aan-anchor="generation"
                className="w-10 h-10 shrink-0 flex items-center justify-center"
              />
              <div className="flex flex-col items-start text-left">
                <p className="font-medium text-foreground text-sm leading-tight">
                  {generationType === "report" ? "Generating Report" : "Running Audit"}
                </p>
                <FloatingDots className="mt-2" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
