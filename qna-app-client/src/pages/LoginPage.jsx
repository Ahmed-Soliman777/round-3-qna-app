import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import AuthCard from "@/components/AuthCard";
import { AuthAlert, AuthField, PasswordField, SubmitButton } from "@/components/auth/AuthFields";
import { useAuthForm } from "@/hooks/useAuthForm";
import { suggestEmail, validateEmail, validateLoginPassword } from "@/lib/authValidation";
import { api } from "@/lib/api";
import { dashboardPathFor, useSession } from "@/context/session";

const isNetworkError = (error) => error instanceof TypeError || error?.message === "Failed to fetch";

const LoginPage = () => {

    const location = useLocation()
    const form = useAuthForm(
        { email: location.state?.email ?? "", password: "" },
        { email: validateEmail, password: validateLoginPassword }
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [failedAttempts, setFailedAttempts] = useState(0)

    const navigate = useNavigate()
    const { refresh } = useSession()

    const emailSuggestion = suggestEmail(form.values.email)

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        if (!form.validateAll()) return

        setLoading(true)

        const email = form.values.email.trim()
        try {
            await api.post("/auth/login", { email, password: form.values.password })
            const user = await refresh()
            navigate(dashboardPathFor(user), { replace: true })

        } catch (error) {

            if (error.message === 'Please verify your account' || error.message === 'UNVERIFIED_ACCOUNT') {
                navigate('/verify-account', { state: { email } });
                return;
            }

            if (error.status === 401) {
                setFailedAttempts((n) => n + 1)
                setError({
                    title: "Email or password is incorrect",
                    body: failedAttempts >= 1
                        ? "Still not working? Check Caps Lock, or create an account if you haven't signed up yet."
                        : "Double-check both fields and try again.",
                })
                form.setServerError("password", "Incorrect email or password.")
            } else if (isNetworkError(error)) {
                setError({ title: "Can't reach the server", body: "Check your internet connection and try again." })
            } else {
                setError({ title: "Couldn't sign you in", body: error.message || "Please try again in a moment." })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthCard title="Welcome back" subtitle="Sign in to continue to your account">
            {error && (
                <AuthAlert title={error.title} onDismiss={() => setError(null)}>
                    {error.body}
                    {failedAttempts >= 2 && error.title.startsWith("Email or password") && (
                        <Link to="/register" className="mt-1 block font-semibold underline-offset-2 hover:underline">
                            Create an account →
                        </Link>
                    )}
                </AuthAlert>
            )}
            {form.submitted && form.invalidCount > 0 && !error && (
                <AuthAlert>
                    {form.invalidCount === 1 ? "1 field needs your attention." : `${form.invalidCount} fields need your attention.`}
                </AuthAlert>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
                <AuthField
                    {...form.field("email")}
                    label="Email address"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="you@school.edu"
                >
                    {emailSuggestion && (
                        <p className="mt-1.5 text-xs text-muted-foreground animate-in fade-in">
                            Did you mean{" "}
                            <button
                                type="button"
                                onClick={() => form.setValue("email", emailSuggestion)}
                                className="font-semibold text-orange-600 underline-offset-2 hover:underline"
                            >
                                {emailSuggestion}
                            </button>
                            ?
                        </p>
                    )}
                </AuthField>

                <PasswordField
                    {...form.field("password")}
                    label="Password"
                    autoComplete="current-password"
                    placeholder="Your password"
                />

                <SubmitButton loading={loading} loadingText="Signing in…">
                    Sign in
                </SubmitButton>
            </form>

            <p className="mt-6 text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-orange-600 hover:underline">
                    Register →
                </Link>
            </p>
        </AuthCard>
    )
}

export default LoginPage;
