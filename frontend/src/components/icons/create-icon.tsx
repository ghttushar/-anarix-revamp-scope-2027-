import {
  forwardRef,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
  type SVGProps,
} from "react";

/*
  Anarix icon factory. Every icon is drawn on a 16×16 grid with a 1.3 round
  stroke in currentColor (the marketing site's app-ui icon style), so it stays
  crisp from 14 to 18px. Width/height are plain attributes, so Tailwind size
  classes (h-4 w-4, size-5, [&_svg]:size-4) override them.
*/

export type AnxIconProps = Omit<SVGProps<SVGSVGElement>, "ref"> & {
  /** Sets both width and height. Defaults to 16. */
  size?: number | string;
};

export type AnxIcon = ForwardRefExoticComponent<AnxIconProps & RefAttributes<SVGSVGElement>>;

export function createIcon(name: string, children: ReactNode): AnxIcon {
  const Icon = forwardRef<SVGSVGElement, AnxIconProps>(function AnxIconImpl(
    { size = 16, strokeWidth = 1.3, className, children: extra, ...rest },
    ref,
  ) {
    const labelled = rest["aria-label"] != null || rest["aria-labelledby"] != null;
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={labelled ? undefined : true}
        role={labelled ? "img" : undefined}
        focusable="false"
        className={className ? `anx-icon shrink-0 ${className}` : "anx-icon shrink-0"}
        {...rest}
      >
        {children}
        {extra}
      </svg>
    );
  });
  Icon.displayName = name;
  return Icon;
}
