const NODE_LISTENERS = window.cachedNodeListeners = []
const GENERIC_FUNCTIONS = {
  addEventListener: HTMLElement.prototype.addEventListener,
  removeEventListener: HTMLElement.prototype.removeEventListener,
}

function generateListenerId () {
  return Math.random().toString().slice(2)
}

function cacheListener (eventName, callback) {
  const listenerId = generateListenerId()

  NODE_LISTENERS.push({ listenerId, eventName, callback })

  return listenerId
}

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

HTMLElement.prototype.addEventListener = function (name, callback) {
  // Pushes a new listener to cache and retrieves its generated unique id
  const listenerId = cacheListener(name, callback)

  // Invokes the original function
  GENERIC_FUNCTIONS.addEventListener.call(this, ...arguments)

  // Returns id of the added event listener
  return listenerId
}

HTMLElement.prototype.removeEventListener = function (listenerId, ...props) {
  // More than one prop were passed. It means that user is trying
  // to call the original removeEventListener
  if (props.length) {
    return GENERIC_FUNCTIONS.removeEventListener.call(this, ...arguments)
  }

  // Removes listener id from the cache
  // and retrieves cached listener information
  const { eventName, callback } = clearListener(listenerId)

  // Calls the original function
  GENERIC_FUNCTIONS.removeEventListener.call(this, eventName, callback)

  return null
}
