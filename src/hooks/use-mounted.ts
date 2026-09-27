import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns true once mounted on the client, avoiding cascading renders and hydration warnings.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
