import { useAlertDialogStore } from "#/stores/use-alert-dialog-store";
import { AlertCircleIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle } from "../ui/alert-dialog";

export function GlobalAlertDialog() {
    const { isOpen, title, description, isDestructive, confirmButtonText, dismissButtonText, onConfirm, closeDialog } = useAlertDialogStore();

    const handleConfirm = async () => {
        closeDialog();
        await onConfirm();
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={closeDialog}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia>
                        <AlertCircleIcon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{ dismissButtonText }</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} variant={isDestructive ? "destructive" : "default"}>
                        { confirmButtonText }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}