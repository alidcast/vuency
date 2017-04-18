export default function assert (condition, msg) {
  if (!condition) throw new Error(`[Vuency] ${msg}`)
}

export function isFn (fn) {
  return typeof fn === 'function'
}

export function isNamedFn (fn) {
  return isFn(fn) && fn.name !== 'undefined' && fn.name !== ''
}

export function isObj (obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}
