import { useEffect } from 'react';

const DEFAULT_MESSAGE = 'You have unsaved changes. Leave without saving?';

/**
 * Warns before unsaved edits are lost.
 * - Closing/refreshing the tab uses the browser's own prompt.
 * - Clicking an in-app link (e.g. in the sidebar) asks for confirmation first. The app uses <BrowserRouter>,
 *   which has no built-in navigation blocker, so links are intercepted before React Router sees the click.
 * The browser back button is not intercepted.
 */
export const useUnsavedChangesGuard = (isDirty: boolean, message: string = DEFAULT_MESSAGE) => {
    useEffect(() => {
        if (!isDirty) return;

        const onBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
        };

        const onLinkClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
            if (!link || link.target === '_blank' || link.origin !== window.location.origin) return;
            // Same-page anchors (e.g. the sidebar's "#!" menu toggles) don't leave the page.
            if (link.pathname === window.location.pathname && link.search === window.location.search) return;

            if (!window.confirm(message)) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        window.addEventListener('beforeunload', onBeforeUnload);
        // Capture phase so this runs before React Router's own click handler.
        document.addEventListener('click', onLinkClick, true);
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
            document.removeEventListener('click', onLinkClick, true);
        };
    }, [isDirty, message]);
};
