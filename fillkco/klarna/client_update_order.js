"use strict";

import restify from 'restify'
import {log} from './utils'
import * as client from 'axios'

import {klarnaClientHttpHeaders} from './utils'


export default function clientUpdateOrder (location_uri, client_auth_header, body, use_denied_person) {
  let headers = klarnaClientHttpHeaders(client_auth_header)
  let email = "checkout-se@testdrive.klarna.com"

  if (use_denied_person) email = "checkout-se+rejected@testdrive.klarna.com";


  let payload = {
    "shared":
    {
      "challenge": {
        "email": email,
       "national_identification_number": "410321-9202",
       "postal_code": "12345"
      }
    }
  }

  let billing_address = {
        "given_name": "Testperson-se",
        "family_name": "Approved",
        "street_address": "Stårgatan 1",
        "postal_code": "12345",
        "city": "Ankeborg",
        "country": "swe",
        "email": email,
        "phone": "0769438826"
  }

  let user_preferences = {
    "remember_me": true
  }

    payload.shared.billing_address = billing_address;
    payload.shared.user_preferences = user_preferences;

  if (body.available_payment_methods != null)
  {
    payload.shared.selected_payment_method = body.available_payment_methods[0];
  }

  return new Promise((resolve, reject) => {
    client.post(location_uri, payload, {headers: headers})
    .then((val) => resolve(val.data))
    .catch(error => {
      console.log('clientUpdateOrder error: ' + error.data.internal_message);
      reject(new restify.HttpError({
        statusCode: error.data.http_status_code,
        message: error.data.internal_message
      }))
    })
  })

}
/*
export default function clientFinalizeOrder (location_uri, client_auth_header, shared, required_fields) {
  console.log('clientFinalizeOrder');

  let headers = klarnaClientHttpHeaders(client_auth_header)

  let payload = {
    "shared":
    {
      "challenge": {
        "email": "checkout-se@testdrive.klarna.com",
        "national_identification_number": "410321-9202",
        "postal_code": "12345"
      },
      "billing_address": {
        "given_name": "Testperson-se",
        "family_name": "Approved",
        "street_address": "Stårgatan 1",
        "postal_code": "12345",
        "city": "Ankeborg",
        "country": "swe",
        "email": "checkout-se@testdrive.klarna.com",
        "phone": "0769438826"
      },
      "user_preferences": {
        "remember_me": true
      },
      "selected_payment_method": {
        "id": "343",
        "type": "account",
        "data": {
          "interest_rate": 1990,
          "months": 0,
          "minimum_pay": 5000,
          "monthly_pay": 2600,
          "setup_fee": 0,
          "monthly_invoice_fee": 2900,
          "currency": "SEK"
        }
      }
    }
  }

  return new Promise((resolve, reject) => {
    client.post(location_uri, payload, {headers: headers})
    .then((val) => resolve(val.data))
    .catch(error => {
      console.log('clientUpdateOrder error: ' + error.data.internal_message);
      reject(new restify.HttpError({
        statusCode: error.data.http_status_code,
        message: error.data.internal_message
      }))
    })
  })

}
*/
