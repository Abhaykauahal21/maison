import { useSyncExternalStore, useCallback } from "react";

/**
 * Media query match that is `null` on the server and during hydration, then true/false.
 * Lets a section render BOTH its phone and desktop layouts until the client knows the viewport
 * (so SSR and the first paint are unchanged, CSS shows the right one), then unmount the layout
 * that is hidden so it stops running scroll handlers, canvases and animations for nothing.
 */
export function useMatches(query: string): boolean | null {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );
  const getSnapshot = useCallback((): boolean | null => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback((): boolean | null => null, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
