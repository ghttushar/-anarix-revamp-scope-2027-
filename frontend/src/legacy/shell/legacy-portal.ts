import type { ReactNode, ReactPortal } from 'react';
import { createPortal as reactCreatePortal } from 'react-dom';

/**
 * The pages ported from anarix-ui keep their own type and sizing inside `.np-scope` (see `legacy/scope.css`).
 * Menus, popovers and dialogs that render into <body> would fall outside that scope, so they render into this one
 * body-level root instead. It is a plain static block, so `position: fixed` / `absolute` children place themselves
 * exactly as they would directly under <body>.
 */
export function getLegacyPortalRoot(): HTMLElement {
  let root = document.getElementById('np-portal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'np-portal-root';
    root.className = 'np-scope np-portal-root';
    document.body.appendChild(root);
  }
  return root;
}

/** Drop-in for react-dom's createPortal: anything aimed at <body> lands in the scoped portal root. */
export function createPortal(children: ReactNode, container: Element | DocumentFragment, key?: string | null): ReactPortal {
  return reactCreatePortal(children, container === document.body ? getLegacyPortalRoot() : container, key);
}
