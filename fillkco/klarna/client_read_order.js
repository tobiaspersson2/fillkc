"use strict";

import restify from 'restify'
import { log } from './utils'
import * as client from 'axios'

import { klarnaClientHttpHeaders
       } from './utils'

export default function clientReadOrder (location_uri, client_auth_header) {
  let headers = klarnaClientHttpHeaders(client_auth_header)


  return new Promise((resolve, reject) => {

    function setBody (response) {
      return new Promise(resolve => {
        resolve(JSON.stringify(response.data));
      })
    }


    client.get(location_uri, {headers: headers})
    .then(setBody)
    .then((val) => {
      resolve(val);
    })
    .catch(error => {
      reject(new restify.HttpError({
        statusCode: error.data.http_status_code,
        message: error.data.internal_message
      }))
    })
  })
}
