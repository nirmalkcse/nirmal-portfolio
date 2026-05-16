"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode
} from "react";
import { isViewer, type RoleLens } from "@/lib/role-lens";

const ROLE_LENS_STORAGE_KEY = "nirmal-portfolio-role-lens";
const ROLE_LENS_CHANGE_EVENT = "nirmal-portfolio-role-lens-change";

type RoleLensContextValue = {
  role: RoleLens;
  setRole: (role: RoleLens) => void;
  clearRole: () => void;
  isHydrated: boolean;
};

const RoleLensContext = createContext<RoleLensContextValue | null>(null);

type RoleLensProviderProps = {
  children: ReactNode;
};

function getServerRoleSnapshot(): RoleLens {
  return null;
}

function getRoleSnapshot(): RoleLens {
  if (typeof window === "undefined") {
    return null;
  }

  const storedRole = window.localStorage.getItem(ROLE_LENS_STORAGE_KEY);

  return isViewer(storedRole) ? storedRole : null;
}

function subscribeToRoleLens(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorage(event: StorageEvent) {
    if (event.key !== ROLE_LENS_STORAGE_KEY) {
      return;
    }

    onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(ROLE_LENS_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(ROLE_LENS_CHANGE_EVENT, onStoreChange);
  };
}

function writeRoleSnapshot(nextRole: RoleLens) {
  if (nextRole) {
    window.localStorage.setItem(ROLE_LENS_STORAGE_KEY, nextRole);
  } else {
    window.localStorage.removeItem(ROLE_LENS_STORAGE_KEY);
  }

  window.dispatchEvent(new Event(ROLE_LENS_CHANGE_EVENT));
}

export function RoleLensProvider({ children }: RoleLensProviderProps) {
  const role = useSyncExternalStore(
    subscribeToRoleLens,
    getRoleSnapshot,
    getServerRoleSnapshot
  );

  const setRole = useCallback((nextRole: RoleLens) => {
    writeRoleSnapshot(nextRole);
  }, []);

  const clearRole = useCallback(() => {
    writeRoleSnapshot(null);
  }, []);

  const value = useMemo(
    () => ({
      role,
      setRole,
      clearRole,
      isHydrated: true
    }),
    [clearRole, role, setRole]
  );

  return (
    <RoleLensContext.Provider value={value}>
      {children}
    </RoleLensContext.Provider>
  );
}

export function useRoleLens() {
  const context = useContext(RoleLensContext);

  if (!context) {
    throw new Error("useRoleLens must be used within RoleLensProvider.");
  }

  return context;
}
