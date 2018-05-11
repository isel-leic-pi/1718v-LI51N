/**
 * Gets existing alerts from the given endpoint and updates the UI accordingly
 * @param {XMLHttpRequest} xhr The instance to be used to asynchronously fetch the alerts
 * @param {string} url The endpoint from which the alerts data will be fetched
 * @param {jQuery} $alertDivider The UI element that separates the alert area (hidden if there are no alerts)
 * @param {jQuery} $cardContainer  The UI element to be the container of all alert views
 */
function fetchAlerts (url, $alertDivider, $cardContainer) { // eslint-disable-line no-unused-vars
  $.getJSON(url, (data) => { // eslint-disable-line no-undef
    updateUI(data, $alertDivider, $cardContainer)
  })
}

/**
 * Updates the UI in order to display the given array of alerts
 * @param {Alert[]} alerts  The array of Alert instances to be displayed
 * @param {jQuery} $alertDivider The UI element that separates the alert area (hidden if there are no alerts)
 * @param {jQuery} $cardContainer  The UI element to be the container of all alert views
 */
function updateUI (alerts, $alertDivider, $cardContainer) {
  if (!alerts) return
  $alertDivider.css('display', alerts.length !== 0 ? '' : 'none')
  $cardContainer.empty()
  alerts.forEach(alert => $cardContainer.append(createAlertView(alert)))
}

function getTimestampMessage (date) {
  // TODO
  return '2 days ago'
}

/**
 * Creates a view (i.e. DOM tree) for the given alert instance
 * @param {Alert} alert
 * @returns The root Element of the creted DOM tree
 */
function createAlertView (alert) {
  /* eslint-disable no-undef */
  const $content = $(
    `<div class="content">
      <span class="right floated">
        <i class="red exclamation triangle icon"></i>
      </span>
      <div class="header">${alert.type}</div>
      <div class="meta">${alert.patientId}</div>
    </div>`
  )

  if (alert.message) {
    $content.append(`<div class="meta">${alert.message}</div>`)
  }

  const $extraContent = $(
    `<div class="extra content">
      ${getTimestampMessage(alert.timestamp)}
    </span>`
  )

  if (alert.type !== 'Flatline') {
    const $dismissIcon = $(`<i class="eye slash outline icon right floated"></i>`)
      .on({
        mouseenter: (evt) => evt.target.classList.toggle('black'),
        mouseleave: (evt) => evt.target.classList.toggle('black')
      })
    $extraContent.append($dismissIcon)
  }

  return $(`<div class="column"></div>`)
    .append($(`<div class="ui link card"></div>`).append($content).append($extraContent))

  /* eslint-enable no-undef */
}
