const ELEMENTS = {
  controlButton: document.querySelector('#control-button'),
  displayButton: document.querySelector('#display-button'),
  messageText: document.querySelector('#message-text'),
}

/**
 * Stores the last created listener id.
 *
 * @type {string|null}
 * */
let lastId = null

/**
 * If true, the display button currently has an active
 * event click on it.
 *
 * @type {boolean}
 * */
let isListenerAdded = false

/**
 * Adds click listener to the display button.
 * */
function addListener () {
  // Do not add another listener if there is already one
  if (isListenerAdded) return

  // Adds event listener and renews the listenerId variable
  lastId = ELEMENTS.displayButton.addEventListener('click', () => {
    // eslint-disable-next-line no-alert
    alert('Something is happening!')
  })

  // Renews text
  ELEMENTS.messageText.textContent = `Click listener is active! Listener ID is ${ lastId }`
  ELEMENTS.displayButton.textContent = 'I am Active. Click on me!'
  ELEMENTS.controlButton.textContent = 'Remove event listener'

  // Reassigns state bool
  isListenerAdded = true
}

/**
 * Removes click listener from the display button.
 * */
function removeListener () {
  // Removes event listener
  ELEMENTS.displayButton.removeEventListener(lastId)

  // Renews text
  ELEMENTS.messageText.textContent = 'No active event listeners!'
  ELEMENTS.displayButton.textContent = "I'm useless now..."
  ELEMENTS.controlButton.textContent = 'Add event listener'

  // Reassigns state bool
  isListenerAdded = false
}

/**
 * Toggles button listener on click.
 * */
ELEMENTS.controlButton.addEventListener('click', () => {
  if (!isListenerAdded) {
    addListener()
  } else {
    removeListener()
  }
})
