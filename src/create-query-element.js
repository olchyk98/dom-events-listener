import { separateByPattern } from './utils'

const TAG_REGEX = /^[A-Za-z]+?(?=\W)/g
const CLASSES_REGEX = /\.[A-Za-z0-9_\-|.]+/g
const ID_REGEX = /#[A-Za-z0-9_-]+/g
const ATTRIBUTES_REGEX = /\[.+]/
const STYLES_REGEX = /\|.+\|/
const TEXTCONTENT_REGEX = /{.+}/

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
  return separateByPattern(
    query,
    ATTRIBUTES_REGEX,
    ',',
    '=',
    'true'
  )
}

/**
 * Returns all extracted styles from the query.
 *
 * @param {string} query
 *
 * @return {object[]}
 * @property {string} key
 * @property {string} value
 * */
export function extractStyles (query) {
  return separateByPattern(
    query,
    STYLES_REGEX,
    ';',
    ':'
  )
}

/**
 * Returns extracted textContent from the query.
 *
 * @param {string} query
 * @return {string}
 * */
export function extractTextContent (query) {
  return query.match(TEXTCONTENT_REGEX)?.[0].slice(1, -1) ?? null
}

/**
 * Creates a HTML element based on the passed query.
 *
 * @param {string} query
 * @param {HTMLElement|null} [parentNode] - if not null, the generated element will be mounted inside this node
 * @return {HTMLElement}
 * */
export const createQueryElement = function (query, parentNode = null) {
  // Extracts element meta from the query
  const tag = extractTagName(query) || 'div'
  const classes = extractClasses(query)
  const id = extractId(query)
  const attrs = extractAttributes(query)
  const styles = extractStyles(query)
  const textContent = extractTextContent(query)

  // Creates a new DOM element
  const element = document.createElement(tag)

  // Assigns class names to the element
  classes.forEach((className) => {
    element.classList.add(className)
  })

  // Assigns id to the element
  if (id) element.id = id

  // Assigns textContent to the element
  if (textContent) element.textContent = textContent

  // Assigns attributes to the element
  attrs.forEach(({ key, value }) => {
    element.setAttribute(key, value)
  })

  // Assigns styles to the element
  styles.forEach(({ key, value }) => {
    element.style[key] = value
  })

  // Mount the generated element in the passed parent node
  if (parentNode) {
    parentNode.appendChild(element)
  }

  // Return the generated element
  return element
}

document.createQueryElement = createQueryElement
