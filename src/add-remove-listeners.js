import {generateId} from "./utils"

/**
 * Stores listeners information.
 *
 * @type {object[]}
 * */
const NODE_LISTENERS = window.cachedNodeListeners = []

/**
 * Store for the native functions.
 *
 * @type {object}
 * */
const GENERIC_FUNCTIONS = {
  addEventListener: HTMLElement.prototype.addEventListener,
  removeEventListener: HTMLElement.prototype.removeEventListener,
}

/**
 * Generates a listener information object and
 * pushes it into the cache store.
 *
 * @param {string} eventName
 * @param {function} callback
 * @return {string} id of the created listener
 * */
function cacheListener (eventName, callback) {
  const listenerId = generateId()

  NODE_LISTENERS.push({ listenerId, eventName, callback })

  return listenerId
}

/**
 * Removes listener with the target id from the cache.
 *
 * @param {string} id
 * @return {object} listener info object
 * */
function clearListener (id) {
  // Find item index in cache
  const listenerIndex = NODE_LISTENERS.findIndex((item) => item.listenerId === id)

  // Save listener info
  const listener = NODE_LISTENERS[listenerIndex]

  // Remove item from the cache
  NODE_LISTENERS.splice(listenerIndex, 1)

  // Return listener info
  return listener
}

/**
 * Rewrites the original prototype addEventListener
 * function to provide another use case: use receives
 * an id that he/she can use to remove the event listener in
 * the future.
 *
 * @summary Works the same way as the original function,
 * but returns a listenerId.
 *
 * @param {string} name - event name, such as "click" and "mouseenter"
 * @param {function} callback
 * @return {string} id of the created listener
 * */
HTMLElement.prototype.addEventListener = function (name, callback) {
  // Pushes a new listener to cache and retrieves its generated unique id
  const listenerId = cacheListener(name, callback)

  // Invokes the original function
  GENERIC_FUNCTIONS.addEventListener.call(this, ...arguments)

  // Returns id of the added event listener
  return listenerId
}

/**
 * Supports the original syntax.
 * @param {string} listenerId | eventName
 * @param props
 * @override
 * */
HTMLElement.prototype.removeEventListener = function (listenerId, ...props) {
  // More than one prop were passed. It means that user is trying
  // to call the original removeEventListener
  if (props.length) {
    return GENERIC_FUNCTIONS.removeEventListener.call(this, ...arguments)
  }

  // Removes listener id from the cache
  // and retrieves cached listener information
  const listenerInfo = clearListener(listenerId)

  // Throws a warning message if no listener with that id
  if (!listenerInfo) {
    // eslint-disable-next-line no-console
    console.warn(`Listener with that id does not exist: "${listenerId}"`)
    return null
  }

  // Destructs values from the info object
  const { eventName, callback } = listenerInfo

  // Calls the original function
  GENERIC_FUNCTIONS.removeEventListener.call(this, eventName, callback)

  return null
}
