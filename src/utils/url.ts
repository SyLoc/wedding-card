export const toUrl = (path: string) => {
  const base = import.meta.env.BASE_URL

  return `${base}${path.replace(/^\/+/, '')}`
}

export const toHashRouteUrl = (path: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const route = path.startsWith('/') ? path : `/${path}`

  return `${window.location.origin}${base}/#${route}`
}
