// /users/:id
export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]*)/g

  const a = /^tasks\/(?<id>[a-z0-9-_]+)(?<query>\?(.*))?$/

  const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')


  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
  return pathRegex
}