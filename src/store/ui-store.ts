import { create } from "zustand";

export interface ToastNotification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  description?: string;
}

interface UiState {
  // Mobile navigation drawer state
  isMobileNavOpen: boolean;
  setMobileNavOpen: (isOpen: boolean) => void;
  toggleMobileNav: () => void;

  // Sidebar collapsed state for desktop
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
  toggleSidebar: () => void;

  // Active modal tracker (allows opening modals from anywhere)
  activeModalId: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  // Global toast notifications
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, "id">) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileNavOpen: false,
  setMobileNavOpen: (isOpen) => set({ isMobileNavOpen: isOpen }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),

  isSidebarCollapsed: false,
  setSidebarCollapsed: (isCollapsed) => set({ isSidebarCollapsed: isCollapsed }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  activeModalId: null,
  openModal: (modalId) => set({ activeModalId: modalId }),
  closeModal: () => set({ activeModalId: null }),

  toasts: [],
  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
