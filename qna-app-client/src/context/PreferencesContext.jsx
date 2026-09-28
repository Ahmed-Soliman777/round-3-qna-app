import { useLayoutEffect, useState } from "react"
import { PreferencesContext } from "./preferences"

// Display & accessibility preferences, stored per browser and applied to <html>.

const STORAGE_KEY = "quizgate:preferences"
// v2 made large text (A+) the default for everyone.
const VERSION = 2

const defaults = {
  version: VERSION,
  theme: "light", // "light" | "dark" | "system"
  textSize: "large", // "small" | "default" | "large"
  reduceMotion: false,
  highContrast: false,
}

const textSizes = { small: "14px", default: "16px", large: "18px" }

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const stored = JSON.parse(raw)
    // Before v2 every visit saved the old "default" size whether or not it was chosen,
    // so treat it as unset and let the new default apply. A deliberate A- is kept.
    if ((stored.version ?? 1) < VERSION && stored.textSize === "default") delete stored.textSize
    return { ...defaults, ...stored, version: VERSION }
  } catch {
    return defaults
  }
}

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(readStored)

  // Layout effect so the text size is applied before the first paint, with no jump.
  useLayoutEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia("(prefers-color-scheme: dark)")

    function apply() {
      const dark = preferences.theme === "dark" || (preferences.theme === "system" && media.matches)
      root.classList.toggle("dark", dark)
      root.style.colorScheme = dark ? "dark" : "light"
    }

    apply()
    root.style.fontSize = textSizes[preferences.textSize] ?? textSizes.default
    root.toggleAttribute("data-reduce-motion", preferences.reduceMotion)
    root.toggleAttribute("data-high-contrast", preferences.highContrast)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    } catch {
      // Storage can be blocked (private mode) - preferences still apply for this visit.
    }

    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [preferences])

  function updatePreference(key, value) {
    setPreferences((current) => ({ ...current, [key]: value }))
  }

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreference }}>
      {children}
    </PreferencesContext.Provider>
  )
}
