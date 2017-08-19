"use strict"

/* eslint-disable no-console */

const config = require("./config.js")

const axios = require("axios")
const URL = require("url").URL
const express = require("express")
const Promise = require("bluebird")
const Hue = require("node-hue-api")

const app = express()
let a = axios.create()
a.defaults.timeout = 1000
const hue = new Hue.HueApi(config.hue.host, config.hue.user)

app.use("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
})

app
  .use(express.static("client/build"))
  .get("/api/last-sensors-metrics", (req, res) => {
    let url = new URL(config.influx.url)
    url.pathname = config.influx.pathQuery
    url.search = "q=SELECT LAST(*) FROM main&db=sensortag"
    url.port = config.influx.port
    a.get(url.href)
      .then((j) => j.data.results[0].series[0])
      .then((j) => res.json(j))
      .catch(console.log)
  })
  .get("/api/sensors-metrics", (req, res) => {
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
      .catch((e) => console.error(e))
  })
  .get("/api/lights", async (req, res) => {
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
  .post("/api/lights/:id", (req, res) => {
    let id = Number(req.params.id)
    let state = Hue.lightState.create().on()
    if (id) {
      hue.setLightState(id, state)
    } else {
      hue.setGroupLightState(1, state)
    }
    res.end()
  })
  .delete("/api/lights/:id", (req, res) => {
    let id = Number(req.params.id)
    let state = Hue.lightState.create().off()
    if (id) {
      hue.setLightState(id, state)
    } else {
      hue.setGroupLightState(1, state)
    }
    res.end()
  })
  .put("/api/lights/:id", (req, res) => {
    let wantedState
    let state = Hue.lightState.create()
    try {
      wantedState = JSON.parse(req.body)
      let mandatoryKeys = ["h", "s", "b"]
      mandatoryKeys.map((e) => {
        if (!( e in wantedState)) {
          throw new Error()
        }
      })
    }
    catch (e) { 
      return res.sendStatus(400).end()
    }
    state.hsb(wantedState.h, wantedState.s, wantedState.b).on()
    hue.setGroupLightState(1, state)
    res.end()
  })

app.listen(config.app.port, () => {
  console.log("DHome running")
})
