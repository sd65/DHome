"use strict"

const config = require("./config.js")

const axios = require("axios")
const URL = require('url').URL;
const express = require('express')
const Promise = require('bluebird')
const Hue = require("node-hue-api")
const SensorTag = Promise.promisifyAll(require('sensortag'), { multiArgs: true })

const app = express()
let a = axios.create()
a.defaults.timeout = 1000
const hue = new Hue.HueApi(config.hue.host, config.hue.user)

app.use('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})


app
.use(express.static('client/build'))
.get('/api/last-sensors-metrics', (req, res) => {
  let url = new URL(config.influx.url)
  url.pathname = config.influx.pathQuery
  url.search = "q=SELECT LAST(*) FROM main&db=sensortag"
  url.port = config.influx.port
  a.get(url.href)
  .then((j) => j.data.results[0].series[0])
  .then((j) => res.json(j))
  .catch(console.log)
})
.get('/api/sensors-metrics', (req, res) => {
  let since = req.query.since || "24h"
  let groupBy = req.query.groupBy || "10m"
  let url = new URL(config.influx.url)
  url.pathname = config.influx.pathQuery
  url.search = `q=SELECT MEAN(*) FROM main WHERE time >= now() - ${since} GROUP BY time(${groupBy}) ORDER BY time ASC`
  url.search += "&db=sensortag"
  url.port = config.influx.port
  a.get(url.href)
  .then((j) => j.data.results[0].series[0])
  .then((j) => res.json(j))
  .catch(console.log)
})
.get('/api/lights', async (req, res) => {
  return res.json()
  let allLights = await hue.lights()
  let status = allLights.lights.map((e) => {
    return {
      id: e.id,
      name: e.name,
      reachable: e.state.reachable,
      on: e.state.on
    }
  })
  res.json(status)
})
.post('/api/lights/:id', (req, res) => {
  let id = Number(req.params.id)
  let state = Hue.lightState.create().on()
  if (id) {
    hue.setLightState(id, state)
  } else {
    hue.setGroupLightState(1, state)
  }
  res.end()
})
.delete('/api/lights/:id', (req, res) => {
  let id = Number(req.params.id)
  let state = Hue.lightState.create().off()
  if (id) {
    hue.setLightState(id, state)
  } else {
    hue.setGroupLightState(1, state)
  }
  res.end()
})
.put('/api/lights/:id', (req, res) => {
  let wantedState
  let state = Hue.lightState.create()
  try {
    wantedState = JSON.parse(req.body)
    let mandatoryKeys = ["h", "s", "b"]
    mandatoryKeys.map((e) => {
      if (! e in wantedState) {
        throw new Error()
      }
    })
  }
  catch (e) {}
  state.hsb(wantedState.h, wantedState.s, wantedState.b).on()
  hue.setGroupLightState(1, state)
  res.end()
})

app.listen(config.app.port, () => {
  console.log('DHome running')
})

;(async () => {
  try {
    console.log("Waiting for Sensortag...")
    let sensorTag = await SensorTag.discoverByIdAsync(config.sensortag.id).catch(e => e)
    console.log("Sensortag found!")
    await sensorTag.connectAndSetUpAsync()
    /*
    await sensorTag.enableGyroscopeAsync()
    sensorTag.setGyroscopePeriod(2500)
    sensorTag.notifyGyroscope()
    sensorTag.on('gyroscopeChange', (x, y, z) => {
      let threshold = -2
      if (Math.min(x,y,z) < threshold) {
        console.log("GYRO")
      }
    })
    */
    while(true) {
      await sensorTag.enableIrTemperatureAsync()
      await sensorTag.enableHumidityAsync()
      await sensorTag.enableBarometricPressureAsync()
      await sensorTag.enableLuxometerAsync()
      await Promise.delay(2 * 1000)
      let [ , irAT ] = await sensorTag.readIrTemperatureAsync()
      let [ hT, H ] = await sensorTag.readHumidityAsync();
      let T = (hT + irAT) / 2
      let P = await sensorTag.readBarometricPressureAsync()
      let L = await sensorTag.readLuxometerAsync()
      let B = await sensorTag.readBatteryLevelAsync();
      [ T, H, P, L ] = [T, H, P, L ].map(e => parseFloat(e).toFixed(1))
      // Prepare for Influx
      let line = `main T=${T},H=${H},P=${P},L=${L},B=${B}`
      let url = new URL(config.influx.url)
      url.pathname = config.influx.pathWrite
      url.search = "db=sensortag"
      url.port = config.influx.port
      try {
        await a.post(url.href, line)
      } catch (e) {
        console.error(e)
      }
      await sensorTag.disableIrTemperatureAsync()
      await sensorTag.disableHumidityAsync()
      await sensorTag.disableBarometricPressureAsync()
      await sensorTag.disableLuxometerAsync()
      await Promise.delay(5 * 60 * 1000)
    }
  } catch (e) {
    console.log("ERROR", e)
  }
})()
