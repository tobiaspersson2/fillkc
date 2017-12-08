"use strict";
/**
 * Setup logging
 */
 import bunyan from 'bunyan'

 const logger = bunyan.createLogger({
   name: 'reqres',
   streams: [
     {
       type: 'rotating-file',
       path: `./logs/reqres.${process.env.NODE_ENV || 'default'}.log`,
       period: '1d',
       count: 7
     }
   ]
 })

 /**
 * Restify config
 */
 import restify from 'restify'

 let server = restify.createServer({
   name: 'Klarna Fill KCO',
   version: '1.0.0',
   log: logger
 })

server.use(restify.requestLogger())
server.use(restify.queryParser())
server.use(restify.bodyParser({mapParams: true}))




server.use(
  function klarnaJSON (req, res, next) {
  const ct = 'application/vnd.klarna.checkout.aggregated-order-v2+json'

  if (req.headers['content-type'] === ct) {
    req.body = JSON.parse(req.body)
  }
  next()
})

/**
 * Log requests
 */
server.use((req, res, next) => {
  req.log.info({
    url: req.url,
    headers: req.headers,
    body: req.body
  })

  next()
})

/**
 * Log responses
 */
server.on('after', (req, res, route) => {
  req.log.info({
    statusCode: res.statusCode,
    headers: res._headers,
    body: res._body
  })
})

/**
 * Log "everything"
 */
server.on('after', restify.auditLogger({
  log: bunyan.createLogger({
    name: 'audit',
    streams: [{
      path: `logs/audit.${process.env.NODE_ENV || 'default'}.log`
    }]
  })
}))


/**
 * Mount application services
 */
require('./services/fillkco.js').default(server)
require('./services/splitpostback.js').default(server)
require('./services/static.js').default(server)

/**
 * Export server object
 */
export default server
