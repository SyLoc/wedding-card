export const getNormalizedPath = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')

  return window.location.pathname.replace(base, '').replace(/\/$/, '') || '/'
}
