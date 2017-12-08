"use strict";

import restify from 'restify'
import {log} from './utils'
import * as client from 'axios'

import {generateAuthToken,
        generateOrderPayload,
        klarnaHttpHeaders} from './utils'

import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber'

export default function createOrder (params, merchant_id, merchant_sharedsecret) {
//  const phoneUtil = PhoneNumberUtil.getInstance()
//  const phoneNumber = phoneUtil.parse(params.mobile_no, params.purchase_country)

  let payload = generateOrderPayload(params, merchant_id, merchant_sharedsecret)
  let url = 'https://checkout.testdrive.klarna.com/checkout/orders'
  let token = generateAuthToken(JSON.stringify(payload), merchant_sharedsecret)
  let headers = klarnaHttpHeaders(token)

  var orderUri;

  return new Promise((resolve, reject) => {

    function setOrderUri (response) {
      return new Promise(resolve => {
        resolve(response.headers.location);
      })
    }

    client.post(url, payload, {headers: headers})
    .then(setOrderUri)
    .then((val) => {
      resolve(val);
    })
    .catch(error => {
      console.log('createOrder error: ' + error.data.internal_message);
      reject(new restify.HttpError({
        statusCode: error.data.http_status_code,
        message: error.data.internal_message
      }))
    })
  })

}
