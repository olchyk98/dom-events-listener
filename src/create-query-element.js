import { separateByPattern } from './utils'

const TAG_REGEX = /^[A-Za-z]+?(?=\W)/g
const CLASSES_REGEX = /\.[A-Za-z0-9_\-|.]+/g
const ID_REGEX = /#[A-Za-z0-9_\-|.]+/g
const ATTRIBUTES_REGEX = /\[.+]/
const STYLES_REGEX = /\|.+\|/

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
