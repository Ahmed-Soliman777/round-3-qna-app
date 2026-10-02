const pad = (n) => String(n).padStart(2, "0")

// Format a Date as the local "YYYY-MM-DDTHH:mm" string used by datetime inputs and DateTimePicker.
export const toLocalValue = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
