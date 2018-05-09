
/**
 * Gets existing alerts from the given endpoint and updates the UI accordingly
 * @param {XMLHttpRequest} xhr The instance to be used to asynchronously fetch the alerts
 * @param {string} url The endpoint from which the alerts data will be fetched
 * @param {HTMLElement} alertDivider The UI element tyhat separates the alert area (hidden if there are no alerts)
 * @param {HTMLElement} cardContainer  The UI element to be the container of all alert views
 */
function fetchAlerts (xhr, url, alertDivider, cardContainer) { // eslint-disable-line no-unused-vars
  xhr.open('GET', url, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { // eslint-disable-line no-undef
      updateUI(JSON.parse(xhr.responseText), alertDivider, cardContainer)
    }
  }
  xhr.send()
}

/**
 * Updates the UI in order to display the given array of alerts
 * @param {Alert[]} alerts  The array of Alert instances to be displayed
 * @param {HTMLElement} alertDivider The UI element tyhat separates the alert area (hidden if there are no alerts)
 * @param {HTMLElement} cardContainer  The UI element to be the container of all alert views
 */
function updateUI (alerts, alertDivider, cardContainer) {
  alertDivider.style.display = alerts.length !== 0 ? '' : 'none'
  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.firstChild)
  }
  alerts.forEach(alert => cardContainer.appendChild(createAlertView(alert)))
}

/**
 * Helper function used to create a new DOM Element and set its class attribute value
 * @param {String} elementName The new element type (e.g. div, span)
 * @param {String} classValue The class attribute value
 * @returns The newly created HTMLElement instance
 */
function createWithClass (elementName, classValue) {
  const element = document.createElement(elementName)
  element.setAttribute('class', classValue)
  return element
}

/**
 * Creates a view (i.e. DOM tree) for the given alert instance
 * @param {Alert} alert
 * @returns The root Element of the creted DOM tree
 */
function createAlertView (alert) {
  /*
  <div class="column">
    <div class="ui card">
      <div class="content">
        <span class="right floated">
          <i class="red exclamation triangle icon"></i>
        </span>
        <div class="header"><a href="">Patient 1</a></div>
        <div class="meta">Flatline</div>
      </div>
    </div>
  </div>
  */
  const icon = createWithClass('span', 'right floated')
  icon.appendChild(createWithClass('i', 'red exclamation triangle icon'))

  const content = createWithClass('div', 'content')
  content.appendChild(icon)

  const header = createWithClass('div', 'header')
  const headerLink = document.createElement('a')
  headerLink.setAttribute('href', '#')
  headerLink.appendChild(document.createTextNode(alert.patientId))
  header.appendChild(headerLink)

  content.appendChild(header)

  content.appendChild(
    createWithClass('div', 'meta')
      .appendChild(document.createTextNode(alert.type))
  )

  const card = createWithClass('div', 'ui card')
  card.appendChild(content)
  const root = createWithClass('div', 'column')

  root.appendChild(card)
  return root
}
