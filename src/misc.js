export function runNowAndEvery(f, t) {
  f()
  return setTimeout(f, t)
}
