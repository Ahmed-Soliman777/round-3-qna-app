import { useRef, useState } from "react"

// Small form-state helper for the auth screens.
// A field shows its error once it has been blurred (or the form was submitted),
// then re-validates live on every keystroke so the message clears as soon as it's fixed.
// Server errors can be pinned to a field and are cleared when that field changes.
export function useAuthForm(initialValues, validators) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [serverErrors, setServerErrors] = useState({})
  const refs = useRef({})

  const errorFor = (name) => serverErrors[name] ?? validators[name]?.(values[name]) ?? null

  const statusFor = (name) => {
    const shown = touched[name] || submitted
    if (!shown) return "idle"
    if (errorFor(name)) return "error"
    return values[name] ? "valid" : "idle"
  }

  const setValue = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (serverErrors[name]) {
      setServerErrors((errors) => {
        const next = { ...errors }
        delete next[name]
        return next
      })
    }
  }

  const field = (name) => ({
    id: name,
    name,
    value: values[name],
    status: statusFor(name),
    error: errorFor(name),
    ref: (el) => (refs.current[name] = el),
    onChange: (e) => setValue(name, e.target.value),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
  })

  // Marks the form submitted; returns true when every field is valid, otherwise focuses the first bad one.
  const validateAll = () => {
    setSubmitted(true)
    const firstBad = Object.keys(validators).find((name) => validators[name](values[name]))
    if (firstBad) {
      refs.current[firstBad]?.focus()
      return false
    }
    return true
  }

  const setServerError = (name, message) => {
    setServerErrors((e) => ({ ...e, [name]: message }))
    setTouched((t) => ({ ...t, [name]: true }))
    setTimeout(() => refs.current[name]?.focus(), 0)
  }

  const invalidCount = Object.keys(validators).filter((name) => errorFor(name)).length

  return { values, setValue, field, validateAll, setServerError, submitted, invalidCount }
}
