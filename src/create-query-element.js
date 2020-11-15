const TAG_REGEX = /^[A-Za-z]+?(?=\W)/g
const CLASSES_REGEX = /\.[A-Za-z0-9_\-|.]+/g
const ID_REGEX = /#[A-Za-z0-9_\-|.]+/g
const ATTRIBUTES_REGEX = /\[.+]/

/**
 * Returns tag name that is used in the query,
 * or null if there is no tag name in the query.
 *
 * @param {string} query
 * @return {string|null}
 * */
export function extractTagName (query) {
  return query.match(TAG_REGEX)?.[0] ?? null
}

/**
 * Returns all classnames that are presented in the query.
 *
 * @param {string} query
 * @return {string[]}
 * */
export function extractClasses (query) {
  const result = query.match(CLASSES_REGEX)?.[0] ?? String()
  return result.split('.').filter(Boolean)
}

/**
 * Returns extracted id from the query.
 *
 * @param {string} query
 * @return {string}
 * */
export function extractId (query) {
  return query.match(ID_REGEX)?.[0].slice(1) ?? null
}

/**
 * Returns all extracted attributes from the query.
 *
 * @param {string} query
 *
 * @return {object[]}
 * @property {string} key
 * @property {string} value
 * */
export function extractAttributes (query) {
  // Extract query chain of attributes without brackets
  const chain = query
    .match(ATTRIBUTES_REGEX)?.[0]
    .slice(1, -1) ?? String()

  // Splits chain into parts (["a=b","c=d"])
  const pairs = chain
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  // Converts parts into objects with attr information
  const attrs = pairs.map((item) => {
    // Splits part into key and value
    const [ key, value ] = item
      .split('=')
      .map((pair) => pair.trim())

    // Skips this attribute if it's empty
    // It means that user duplicated comma, like that "a=c,,b=d"
    if (!key) {
      // Notify user about the mistake
      // eslint-disable-next-line no-console
      console.warn(`Redundant comma detected in attributes in query "${query}" with attributes ${pairs}`)
      return null
    }

    return ({
      key,
      value: value || 'true',
    })
  })

  // Remove invalid attributes and return the list
  return attrs.filter(Boolean)
}
