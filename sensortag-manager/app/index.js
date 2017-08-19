"use strict"

/* eslint-disable no-console */

const config = require("./config.js")

const axios = require("axios")
let a = axios.create()
a.defaults.timeout = 1000

const URL = require("url").URL
const Promise = require("bluebird")
const SensorTag = Promise.promisifyAll(require("sensortag"), { multiArgs: true })

;(async () => {
  try {
    console.log("Waiting for Sensortag...")
    let sensorTag = await SensorTag.discoverByIdAsync(config.sensortag.id).catch(e => e)
    console.log("Sensortag found!")
    await sensorTag.connectAndSetUpAsync()
    for (;;) {
      await sensorTag.enableIrTemperatureAsync()
      await sensorTag.enableHumidityAsync()
      await sensorTag.enableBarometricPressureAsync()
      await sensorTag.enableLuxometerAsync()
      await Promise.delay(2 * 1000)
      let [ , irAT ] = await sensorTag.readIrTemperatureAsync()
      let [ hT, H ] = await sensorTag.readHumidityAsync()
      let T = (hT + irAT) / 2
      let P = await sensorTag.readBarometricPressureAsync()
      let L = await sensorTag.readLuxometerAsync()
      let B = await sensorTag.readBatteryLevelAsync()
      ;[ T, H, P, L ] = [T, H, P, L ].map(e => parseFloat(e).toFixed(1))
      // Prepare for Influx
      let line = `main T=${T},H=${H},P=${P},L=${L},B=${B}`
      let url = new URL(config.influx.url)
      url.pathname = config.influx.pathWrite
      url.search = "db=sensortag"
      url.port = config.influx.port
      try {
        await a.post(url.href, line)
      } catch (e) {throw e}
      await sensorTag.disableIrTemperatureAsync()
      await sensorTag.disableHumidityAsync()
      await sensorTag.disableBarometricPressureAsync()
      await sensorTag.disableLuxometerAsync()
      await Promise.delay(5 * 60 * 1000)
    }
  } catch (e) {
    console.error(e)
  }
})()
