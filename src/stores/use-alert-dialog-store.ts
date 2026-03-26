import { create } from "zustand";

interface AlertDialogState {
    isOpen: boolean;
    title: string;
    description: string;
    confirmButtonText?: string;
    dismissButtonText?: string;
    isDestructive?: boolean;
    onConfirm: () => void | Promise<void>;
    openDialog: (data : {
        title: string,
        description: string,
        confirmButtonText?: string,
        dismissButtonText?: string,
        isDestructive?: boolean,
        onConfirm: () => void 
    }) => void;
    closeDialog: () => void;
}

export const useAlertDialogStore = create<AlertDialogState>((set) => ({
    isOpen: false,
    title: "",
    description: "",
    confirmButtonText: "Yes",
    dismissButtonText: "No",
    isDestructive: false,
    onConfirm: () => {},
    openDialog: (data) => set({
        ...data,
        isOpen: true,
    }),
    closeDialog: () => set({ isOpen: false })
}));
