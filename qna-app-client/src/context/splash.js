import { createContext, useContext } from "react"

// True once the splash screen has fully faded out. Entrance animations (rolling
// numbers, count-ups) wait for this so they don't play behind the splash.
export const SplashContext = createContext(true)

export function useSplashDone() {
  return useContext(SplashContext)
}
