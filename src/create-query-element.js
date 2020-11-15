const TAG_REGEX = /.+?(?=\W|$)/

/**
 * Returns tag name that is used in the query,
 * or null if there is no tag name in the query.
 *
 * @param {string} query
 * @return {string|null}
 * */
export function extractTagName (query) {
  return query.match(TAG_REGEX)?.[0]
}
