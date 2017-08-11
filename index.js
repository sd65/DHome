"use strict"

const Hue = require("node-hue-api")
const http = require("http")
const URL= require('url').URL;
const Promise = require('bluebird')
const SensorTag = Promise.promisifyAll(require('sensortag'), { multiArgs: true })
const WebSocket = require("ws")
const http2 = require("http2")
const fs = require("fs")
const pug = require('pug');

let sensorTag

const portHttp = 8000
const portWs = 8081

const wss = new WebSocket.Server({ port: portWs })

// HTTP

const networkToScan = "192.168.1.0/24"
    
const options = {
    key: fs.readFileSync(__dirname + "/ssl/server.key"),
    cert: fs.readFileSync(__dirname + "/ssl/server.crt")
}

const pugsLocals = {
  title: "DHome"
}

const assets = {
    indexHtml: pug.compileFile(__dirname + "/assets/index.pug")(pugsLocals),
    mainJs: fs.readFileSync(__dirname + "/assets/main.js")
}

const knownMacs = {
  "C0:EE:FB:21:9A:BE": "Sylvain's  Phone"
}

const hueConfig = {
  host: "192.168.1.11",
  user: "9Z77Zu-izQ-u4jon8yGWyWyqgrxKI53ZGO6C6lum"
}
const hue = new Hue.HueApi(hueConfig.host, hueConfig.user)

const influxConfig = {
  url: "http://localhost",
  port: 8086,
  pathWrite: "/write?db=sensortag",
  pathQuery: "/query"
}

http2.createServer(options, async function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  switch (req.url) {
    case "/": 
      // Push the main.js file
      res.push("/main.js", {
        response: {
          "content-type": "application/javascript"
        }
      }).end(assets.mainJs)
      // Give the main file
      res.writeHead(200, {"Content-Type": "text/html" })
      res.end(assets.indexHtml)
      break;
    case "/main.js": 
      res.writeHead(200, {"Content-Type": "application/javascript" })
      res.end(assets.mainJs)
      break;
    case "/api/sensortag": 
      let url = new URL(influxConfig.url)
      url.pathname = influxConfig.pathQuery
      url.search = "q=SELECT * FROM main ORDER BY time DESC LIMIT 200"
      url.search += "&db=sensortag"
      url.port = influxConfig.port
      http.get(url.href, (res2) => {
        res2.setEncoding('utf8');
        let rawData = '';
        res2.on('data', (chunk) => { rawData += chunk; });
        res2.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData).results[0].series[0]
            delete parsedData.name
            res.writeHead(200, {"Content-Type": "application/json" })
            res.end(JSON.stringify(parsedData))
          } catch (e) {
            console.error(e.message, e.stack);
          }
        });
      }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
      });
      break
    case "/api/sensortag2000": 
    {
      let url = new URL(influxConfig.url)
      url.pathname = influxConfig.pathQuery
      url.search = "q=SELECT * FROM main ORDER BY time DESC LIMIT 2000"
      url.search += "&db=sensortag"
      url.port = influxConfig.port
      http.get(url.href, (res2) => {
        res2.setEncoding('utf8');
        let rawData = '';
        res2.on('data', (chunk) => { rawData += chunk; });
        res2.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData).results[0].series[0]
            delete parsedData.name
            res.writeHead(200, {"Content-Type": "application/json" })
            res.end(JSON.stringify(parsedData))
          } catch (e) {
            console.error(e.message, e.stack);
          }
        });
      }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
      });
    }
      break
    case "/api/lights": 
      let state = Hue.lightState.create()
      switch (req.method) {
        case "GET":
          let allLights = await hue.lights()
          let status = allLights.lights.map((e) => {
            return {
              id: e.id,
              name: e.name,
              reachable: e.state.reachable,
              on: e.state.on
            }
          })
          /*
          let allOn = allLights.lights.map((e) => {
            if (e.state.reachable) {
              return e.state.on
            }
          }).filter((e) => e !== undefined).every((e) => e)
          let httpCode = 204
          if (allOn) {
              httpCode = 200
          }
          */
          res.writeHead(200, {"Content-Type": "application/json" })
          res.end(JSON.stringify(status))
          break;
        case "POST":
          state.on()
          hue.setGroupLightState(1, state)
          res.writeHead(200, {"Content-Type": "text/plain" })
          res.end()
          break;
        case "PUT":
          let data = ""
          req.on('data', function(chunk) {
            data += chunk
            if(data.length > 1e6) {
                data = ""
                res.writeHead(413, {'Content-Type': 'text/plain'})
                res.end()
            }
          })
          req.on('end', function() {
            let wantedState
            try {
            console.log(data)
              wantedState = JSON.parse(data)
              let mandatoryKeys = ["h", "s", "b"]
              mandatoryKeys.map((e) => {
                if (! e in wantedState) {
                  throw new Error()
                }
              })
            } catch (e) {
                res.writeHead(400, {'Content-Type': 'text/plain'})
                return res.end()
            }
            state.hsb(wantedState.h, wantedState.s, wantedState.b).on()
            hue.setGroupLightState(1, state)
            res.writeHead(200, {"Content-Type": "text/plain" })
            res.end()
          })
          break;
        default:
          state.off()
          hue.setGroupLightState(1, state)
          res.writeHead(200, {"Content-Type": "text/plain" })
          res.end()
        break;
      }
      break;
    case "/api/lights/1":
    case "/api/lights/2":
    case "/api/lights/3":
      let id = Number((req.url.match(/\/api\/lights\/(\d)/))[1])
      let state2 = Hue.lightState.create()
      switch (req.method) {
        case "POST":
          state2.on()
          hue.setLightState(id, state2, function(err, result) {
        console.log(err, result)
        })
          res.writeHead(200, {"Content-Type": "text/plain" })
          res.end()
          break;
        default:
          state2.off()
          hue.setLightState(id, state2)
          res.writeHead(200, {"Content-Type": "text/plain" })
          res.end()
      }
      break;
    default: 
      res.writeHead(404, {"Content-Type": "text/plain" })
      res.end("404")
  }
}).listen(portHttp)

// WS

setInterval(function () {
  wss.clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(String(new Date))
    }
  })
},500);

(async () => {
  try {
    console.log("Waiting for Sensortag...")
    sensorTag = await SensorTag.discoverByIdAsync("24718958a903").catch(e => e)
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
      console.log(line)
      const options = {
        hostname: influxConfig.host,
        path: influxConfig.pathWrite,
        port: influxConfig.port,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(line, "utf8")
        }
      }
      const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
      }).on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      })
      req.write(line)
      req.end()
      await sensorTag.disableIrTemperatureAsync()
      await sensorTag.disableHumidityAsync()
      await sensorTag.disableBarometricPressureAsync()
      await sensorTag.disableLuxometerAsync()
      await Promise.delay(60 * 1000)
    }
  } catch (e) {
    console.log("ERROR", e)
  }
})()
