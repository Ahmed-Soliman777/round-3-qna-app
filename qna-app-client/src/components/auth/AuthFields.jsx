import { useId, useState } from "react";
import { AlertCircle, ArrowBigUp, Check, CircleCheck, Eye, EyeOff, Info, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { passwordRules, passwordStrength } from "@/lib/authValidation";

// status: "idle" | "error" | "valid"
function inputRing(status) {
    if (status === "error") return "ring-destructive/70 focus:ring-destructive bg-destructive/[0.03]";
    if (status === "valid") return "ring-green-500/60 focus:ring-green-600";
    return "ring-border focus:ring-orange-500 hover:ring-foreground/30";
}

export function FieldMessage({ id, status, children }) {
    if (!children) return null;
    return (
        <p
            id={id}
            className={cn(
                "mt-1.5 flex items-start gap-1.5 text-xs font-medium animate-in fade-in slide-in-from-top-1 duration-200",
                status === "error" ? "text-destructive" : "text-muted-foreground"
            )}
        >
            {status === "error" ? (
                <AlertCircle className="mt-px size-3.5 shrink-0" />
            ) : (
                <Info className="mt-px size-3.5 shrink-0" />
            )}
            <span>{children}</span>
        </p>
    );
}

export function AuthField({
    id,
    label,
    status = "idle",
    error,
    hint,
    trailing,
    labelAside,
    children,
    className,
    ...inputProps
}) {
    const messageId = useId();
    const showError = status === "error" && error;

    return (
        <div className={className}>
            <div className="flex items-baseline justify-between gap-2">
                <label className="text-sm font-medium" htmlFor={id}>
                    {label}
                </label>
                {labelAside}
            </div>
            <div className="relative mt-1.5">
                <input
                    id={id}
                    aria-invalid={status === "error" || undefined}
                    aria-describedby={showError || hint ? messageId : undefined}
                    className={cn(
                        "w-full rounded-lg bg-background px-3 py-2.5 pr-10 text-base ring-1 outline-none transition-[box-shadow,background-color] focus:ring-2 sm:text-sm",
                        trailing && "pr-20",
                        inputRing(status)
                    )}
                    {...inputProps}
                />
                <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                    {trailing}
                    {status === "valid" && (
                        <CircleCheck aria-hidden className="size-4 text-green-600 animate-in zoom-in-50 duration-200" />
                    )}
                    {status === "error" && (
                        <AlertCircle aria-hidden className="size-4 text-destructive animate-in zoom-in-50 duration-200" />
                    )}
                </div>
            </div>
            {showError ? (
                <FieldMessage id={messageId} status="error">{error}</FieldMessage>
            ) : (
                hint && <FieldMessage id={messageId}>{hint}</FieldMessage>
            )}
            {children}
        </div>
    );
}

export function PasswordField(props) {
    const [visible, setVisible] = useState(false);
    const [capsLock, setCapsLock] = useState(false);

    const checkCaps = (e) => {
        if (e.getModifierState) setCapsLock(e.getModifierState("CapsLock"));
    };

    return (
        <AuthField
            {...props}
            type={visible ? "text" : "password"}
            onKeyDown={(e) => {
                checkCaps(e);
                props.onKeyDown?.(e);
            }}
            onKeyUp={checkCaps}
            onBlur={(e) => {
                setCapsLock(false);
                props.onBlur?.(e);
            }}
            trailing={
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    aria-pressed={visible}
                    className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                    {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            }
        >
            {capsLock && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-orange-700 animate-in fade-in dark:text-orange-400">
                    <ArrowBigUp className="size-3.5" /> Caps Lock is on
                </p>
            )}
            {props.children}
        </AuthField>
    );
}

const strengthColors = ["bg-destructive", "bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-green-600"];
const strengthText = ["text-destructive", "text-destructive", "text-orange-600", "text-yellow-600", "text-green-600"];

export function PasswordStrength({ password }) {
    const { score, label } = passwordStrength(password);
    if (!password) return null;

    return (
        <div className="mt-2.5 animate-in fade-in duration-200" aria-live="polite">
            <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map((i) => (
                        <span
                            key={i}
                            className={cn(
                                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                                i <= Math.max(score, 1) ? strengthColors[score] : "bg-border"
                            )}
                        />
                    ))}
                </div>
                <span className={cn("w-16 text-right text-xs font-semibold", strengthText[score])}>{label}</span>
            </div>
            <ul className="mt-2 grid grid-cols-1 gap-x-3 gap-y-1 sm:grid-cols-2">
                {passwordRules.map((rule) => {
                    const ok = rule.test(password);
                    return (
                        <li
                            key={rule.id}
                            className={cn(
                                "flex items-center gap-1.5 text-xs transition-colors",
                                ok ? "text-green-700 dark:text-green-400" : "text-muted-foreground"
                            )}
                        >
                            {ok ? <Check className="size-3.5" /> : <X className="size-3.5 opacity-60" />}
                            {rule.label}
                            {rule.required && !ok && <span className="text-destructive">*</span>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export function AuthAlert({ tone = "error", title, children, onDismiss }) {
    if (!children && !title) return null;
    const isError = tone === "error";
    return (
        <div
            role={isError ? "alert" : "status"}
            className={cn(
                "mt-5 flex gap-3 rounded-xl p-3.5 text-sm ring-1 animate-in fade-in slide-in-from-top-2 duration-300",
                isError
                    ? "bg-destructive/5 text-destructive ring-destructive/20"
                    : "bg-green-50 text-green-800 ring-green-200 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-500/30"
            )}
        >
            {isError ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <CircleCheck className="mt-0.5 size-4 shrink-0" />}
            <div className="min-w-0 flex-1">
                {title && <p className="font-semibold">{title}</p>}
                {children && <div className={cn(title && "mt-0.5 opacity-90")}>{children}</div>}
            </div>
            {onDismiss && (
                <button
                    type="button"
                    onClick={onDismiss}
                    aria-label="Dismiss"
                    className="-m-1 h-fit rounded-md p-1 opacity-70 transition hover:bg-foreground/5 hover:opacity-100"
                >
                    <X className="size-4" />
                </button>
            )}
        </div>
    );
}

export function SubmitButton({ loading, loadingText, children, ...props }) {
    return (
        <button
            type="submit"
            disabled={loading}
            aria-busy={loading || undefined}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/85 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
            {...props}
        >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? loadingText : children}
        </button>
    );
}
