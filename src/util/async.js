export function pause(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

export default {
  pause
}
