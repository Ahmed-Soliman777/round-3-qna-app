import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

// Small confirm modal on the native <dialog>: focus is trapped inside,
// Esc cancels, and clicking the backdrop cancels.
export default function ConfirmDialog({
    open,
    title,
    children,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmClassName,
    onConfirm,
    onCancel,
}) {
    const ref = useRef(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            aria-labelledby="confirm-dialog-title"
            onCancel={(e) => {
                e.preventDefault();
                onCancel();
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
            className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-card p-0 text-card-foreground shadow-xl ring-1 ring-foreground/10 backdrop:bg-black/40 open:animate-in open:fade-in open:zoom-in-95"
        >
            <div className="p-6">
                <h2 id="confirm-dialog-title" className="font-heading text-lg font-bold">
                    {title}
                </h2>
                <div className="mt-2 text-sm text-muted-foreground">{children}</div>
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button variant="outline" onClick={onCancel} autoFocus>
                        {cancelLabel}
                    </Button>
                    <Button onClick={onConfirm} className={confirmClassName}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </dialog>
    );
}
