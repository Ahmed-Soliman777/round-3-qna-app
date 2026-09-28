// Client-side checks that mirror the server's CreateUserDTO / LoginUserDTO rules,
// so users see problems while typing instead of after a round trip.

export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 20

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateName(value) {
  const name = value.trim()
  if (!name) return "Enter your full name."
  if (name.length < 2) return "Name must be at least 2 characters."
  if (/\d/.test(name)) return "Names can't contain numbers."
  return null
}

export function validateEmail(value) {
  const email = value.trim()
  if (!email) return "Enter your email address."
  if (/\s/.test(email)) return "Email addresses can't contain spaces."
  if (!email.includes("@")) return "An email needs an “@” — e.g. you@school.edu."
  const [local, domain = ""] = email.split("@")
  if (!local) return "Add the part before the “@”."
  if (!domain) return "Add the domain after the “@” — e.g. school.edu."
  if (!domain.includes(".")) return "The domain looks incomplete — e.g. school.edu."
  if (!EMAIL_RE.test(email)) return "That doesn't look like a valid email address."
  return null
}

export function validateNewPassword(value) {
  if (!value) return "Create a password."
  if (value.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters (${PASSWORD_MIN - value.length} more).`
  if (value.length > PASSWORD_MAX) return `Use at most ${PASSWORD_MAX} characters (${value.length - PASSWORD_MAX} too many).`
  return null
}

export function validateLoginPassword(value) {
  return value ? null : "Enter your password."
}

// Rules shown as a live checklist under the register password field.
// Only the length rule is required by the server; the others raise the strength score.
export const passwordRules = [
  { id: "length", label: `${PASSWORD_MIN}–${PASSWORD_MAX} characters`, required: true, test: (p) => p.length >= PASSWORD_MIN && p.length <= PASSWORD_MAX },
  { id: "case", label: "Upper & lowercase letters", test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: "number", label: "At least one number", test: (p) => /\d/.test(p) },
  { id: "symbol", label: "A symbol (e.g. ! @ #)", test: (p) => /[^A-Za-z0-9]/.test(p) },
]

export function passwordStrength(password) {
  if (!password) return { score: 0, label: "" }
  const passed = passwordRules.filter((r) => r.test(password)).length
  const lengthOk = passwordRules[0].test(password)
  const score = lengthOk ? passed : Math.min(passed, 1)
  return { score, label: ["Too short", "Weak", "Fair", "Good", "Strong"][score] }
}

// Catch common domain typos: "gmial.com" → "gmail.com".
const COMMON_DOMAINS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "live.com"]

function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return dp[a.length][b.length]
}

export function suggestEmail(value) {
  const email = value.trim().toLowerCase()
  const at = email.lastIndexOf("@")
  if (at < 1) return null
  const domain = email.slice(at + 1)
  if (!domain || COMMON_DOMAINS.includes(domain)) return null
  const match = COMMON_DOMAINS.find((d) => editDistance(domain, d) <= 2)
  return match ? `${email.slice(0, at)}@${match}` : null
}
