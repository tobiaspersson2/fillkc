"use strict";

import restify from 'restify'
import { log } from './utils'
import * as client from 'axios'

import { generateAuthToken,
         klarnaHttpHeaders
       } from './utils'

export default function readOrder (location_uri, merchant_id, merchant_sharedsecret) {
  let token = generateAuthToken('', merchant_sharedsecret)
  let headers = klarnaHttpHeaders(token)

  return new Promise((resolve, reject) => {
    client.get(location_uri, {headers: headers})
    .then((val) => resolve(val.data))
    .catch(error => {
      reject(new restify.HttpError({
        statusCode: error.data.http_status_code,
        message: error.data.internal_message
      }))
    })
  })
}
