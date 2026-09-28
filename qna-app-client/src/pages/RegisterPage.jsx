import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import AuthCard from "@/components/AuthCard";
import { AuthAlert, AuthField, PasswordField, PasswordStrength, SubmitButton } from "@/components/auth/AuthFields";
import { useAuthForm } from "@/hooks/useAuthForm";
import { suggestEmail, validateEmail, validateName, validateNewPassword } from "@/lib/authValidation";
import { api } from "@/lib/api";

const isNetworkError = (error) => error instanceof TypeError || error?.message === "Failed to fetch";

const RegisterPage = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const form = useAuthForm(
        { name: "", email: location.state?.email ?? "", password: "" },
        { name: validateName, email: validateEmail, password: validateNewPassword }
    )
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [emailTaken, setEmailTaken] = useState(false)

    const emailSuggestion = suggestEmail(form.values.email)

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        if (!form.validateAll()) return

        setLoading(true)
        setEmailTaken(false)

        const { name, email, password } = form.values
        try {
            await api.post("/auth/register", { name: name.trim(), email: email.trim(), password })

            navigate('/verify-account', { state: { email: email.trim() } })

        } catch (error) {
            if (error.status === 409) {
                setEmailTaken(true)
                form.setServerError("email", "This email already has an account.")
            } else if (isNetworkError(error)) {
                setError({ title: "Can't reach the server", body: "Check your internet connection and try again." })
            } else if (error.status === 400 && error.details?.length) {
                setError({ title: "Please fix the following", body: error.details.join(" · ") })
            } else {
                setError({ title: "Couldn't create your account", body: error.message || "Please try again in a moment." })
            }
        } finally {
            setLoading(false)
        }
    }

    const nameField = form.field("name")
    const emailField = form.field("email")
    const passwordField = form.field("password")

    return (
        <AuthCard title="Create an account" subtitle="Start free — no card required">
            {error && (
                <AuthAlert title={error.title} onDismiss={() => setError(null)}>
                    {error.body}
                </AuthAlert>
            )}
            {form.submitted && form.invalidCount > 0 && !error && (
                <AuthAlert>
                    {form.invalidCount === 1 ? "1 field needs your attention." : `${form.invalidCount} fields need your attention.`}
                </AuthAlert>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
                <AuthField
                    {...nameField}
                    label="Full name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Smith"
                />

                <AuthField
                    {...emailField}
                    label="Email address"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="you@school.edu"
                >
                    {emailTaken && (
                        <p className="mt-1.5 text-xs">
                            <Link
                                to="/login"
                                state={{ email: form.values.email.trim() }}
                                className="font-semibold text-orange-600 hover:underline"
                            >
                                Sign in with this email instead →
                            </Link>
                        </p>
                    )}
                    {emailSuggestion && !emailTaken && (
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
                    {...passwordField}
                    label="Password"
                    autoComplete="new-password"
                    placeholder="8–20 characters"
                    labelAside={
                        form.values.password && (
                            <span className="text-xs tabular-nums text-muted-foreground">
                                {form.values.password.length}/20
                            </span>
                        )
                    }
                >
                    <PasswordStrength password={form.values.password} />
                </PasswordField>

                <SubmitButton loading={loading} loadingText="Creating account…">
                    Create account
                </SubmitButton>
            </form>

            <p className="mt-6 text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-orange-600 hover:underline">
                    Sign in →
                </Link>
            </p>
        </AuthCard>
    )
}

export default RegisterPage;
