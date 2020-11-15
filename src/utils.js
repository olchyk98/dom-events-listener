/**
 * Generates a random id.
 *
 * @return {string}
 * */
export function generateId () {
  return Math.random().toString().slice(2)
}

/**
 * Removes all spaces in the passed string.
 *
 * @param {string} str
 * @return {string}
 * */
export function removeSpaces(str) {
  return str.replace(/\s|\n/g, '')
}

/**
 * Works with patterns such as |key:value| and [key=value].
 * Extracts values and pushes them into an array by separating
 * keys and values into different properties.
 *
 * @param {string} query
 * @param {RegExp} regex
 * @param {string} itemsSeparator - character that separates items in the block
 * @param {string} valuesSeparator - character that separates key and value in an item
 * @param {string|null} [defaultValue] - string that will replace value in
 * object if parser found no value.
 *
 * @return {object[]}
 * @property {string} key
 * @property {string} value
 * */
export function separateByPattern (
  query,
  regex,
  itemsSeparator,
  valuesSeparator,
  defaultValue = null
) {
  // Extract query chain of attributes without brackets
  const chain = query
    .match(regex)?.[0]
    .slice(1, -1) ?? String()

  // Splits chain into parts (["a=b","c=d"])
  const pairs = chain
    .split(itemsSeparator)
    .map(removeSpaces)
    .filter(Boolean)

  // Converts parts into objects with attr information
  const items = pairs.map((item) => {
    // Splits part into key and value
    const [ key, value ] = item
      .split(valuesSeparator)
      .map(removeSpaces)

    // Skips this attribute if it's empty
    // It means that user duplicated comma, like that "a=c,,b=d"
    if (!key.trim()) {
      // Notify user about the mistake
      // eslint-disable-next-line no-console
      console.warn(`Redundant comma detected in query "${query}" with sequence items ${pairs}`)
      return null
    }

    // Skips if no default value provided and there is no value
    if (!defaultValue && !value?.trim()) {
      // eslint-disable-next-line no-console
      console.warn(
        `Item with key ${key} in sequence in query ${query} in sequenced ${pairs} has no value. Item ignored.`
      )
      return null
    }

    return ({
      key,
      value: value || defaultValue,
    })
  })

  return items.filter(Boolean)
}
