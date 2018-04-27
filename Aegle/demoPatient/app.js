'use strict'

/**
 * Entry point that starts a set of patients according to the info contained in the given config file.
 * The full path of the configuration file is specified as a command line argument. The configuration
 * is specified using JSON as literal of @type {PatientConfig[]}
 * The second comand line argument is the endpoint of the helth monitoring server (e.g. http://localhost:8080)
 *
 * @module demoPatient.main
 */

main(process.argv[2], process.argv[3])

/**
 * Data type that holds configuration information to be used in initializing patients
 * @typedef    {Object} PatientConfig
 * @property   {string} id - The instance identifier.
 * @property   {number} heartbeatPeriod - The time interval, in seconds, between heartbeat events.
 * @property   {?number} ttl - The patient's time-to-live (in seconds). If null or undefined, the patient
 * is deemed immortal.
 */

/**
 * Starts a set of patients according to the given configuration information.
 * @param {PatientConfig[]} configInfo - The configuration info.
 * @param {string} healthMonitoringUrl - The base URL of the host to where heartbeats will be sent.
 */
function startPatients (configInfo, healthMonitoringUrl) {
  const patientFactory = require('./patient.js')

  const sendHeartbeat = (event) => {
    const request = require('request')
    request.post({
      url: healthMonitoringUrl + `/aegle/patients/${encodeURIComponent(event.source)}/events`,
      json: true,
      body: event
    })
  }

  configInfo
    .map(element => {
      return {
        patient: patientFactory(sendHeartbeat, element.id, element.heartbeatPeriod),
        ttl: element.ttl
      }
    })
    .forEach(patientInfo => {
      patientInfo.patient.start()
      if (patientInfo.ttl) {
        setTimeout(() => patientInfo.patient.stop(), patientInfo.ttl * 1000)
      }
    })
}

/**
 * The application's entry point.
 * @param {string} configFilePath - The fully qualified name of the configuration file.
 * @param {string} healthMonitoringUrl - The absolute URL to where heartbeats will be sent.
 */
function main (configFilePath, healthMonitoringUrl) {
  const fs = require('fs')

  if (!configFilePath || !fs.existsSync(configFilePath)) {
    console.error(`Could not find file ${configFilePath}`)
    console.error('Usage: node app <configFilePath>')
    return
  }

  const configInfo = require(configFilePath)
  startPatients(configInfo, healthMonitoringUrl)
}
