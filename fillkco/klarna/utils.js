"use strict";

import crypto from 'crypto'

export function generateAuthToken (payload, secret) {
  if (typeof payload !== 'string') {
    throw new TypeError('Payload must be a string')
  }

  if (typeof secret !== 'string') {
    throw new TypeError('Secret must be a string')
  }

  let message = payload + secret
  return crypto.createHash('sha256').update(message, 'utf8').digest('base64')
}

export function generateOrderPayload (params, merchant_id, merchant_sharedsecret) {
  const payload = {}

  payload.purchase_country = 'SE'
  payload.purchase_currency = 'SEK'
  payload.locale = 'sv-se'
  payload.recurring = true

  payload.cart = {
    "items": [
      {
        "reference": "1",
        "quantity": 1,
        "name": "Test",
        "unit_price": params.order_amount,
        "type": "discount",
        "discount_rate": 0,
        "tax_rate": 0
      }
    ]
  }
  payload.shipping_address = {
    "postal_code": params.postal_code,
    "email": params.email
  }

  payload.merchant = {
    id: merchant_id,
    terms_uri: 'https://',
    checkout_uri: 'https://',
    confirmation_uri: 'https://',
    back_to_store_uri: 'https://',
    validation_uri: 'https://',
    push_uri: 'https://'
  }

  return payload
}

export function calculateVat (amount, vatAmount) {
  return Math.round((vatAmount / (amount - vatAmount)) * 10000)
}

export function klarnaHttpHeaders (token) {
  return {
    'Accept': 'application/vnd.klarna.checkout.aggregated-order-v2+json',
    'Content-Type': 'application/vnd.klarna.checkout.aggregated-order-v2+json',
    'Authorization': `Klarna ${token}`
  }
}
export function klarnaClientHttpHeaders (client_auth_header) {
  return {
    'Accept': 'application/vnd.klarna.checkout.server-order-v1+json',
    'Content-Type': 'application/vnd.klarna.checkout.client-order-v1+json',
    'Authorization': `${client_auth_header}`,
  }
}
export function getClientAuth (snippet) {
      var rePattern = new RegExp("AUTH_HEADER:'([^'']+)'");
      var arrMatches = snippet.match(rePattern);
      if (arrMatches.length === 0) return null; else return arrMatches[1];
}
export function getClientOrderURL (snippet) {
      var rePattern = new RegExp("ORDER_URL:'([^'']+)'");
      var arrMatches = snippet.match(rePattern);
      if (arrMatches.length === 0) return null; else return arrMatches[1];
}
export function hasDeniedOrderLine (snippet) {
      var rePattern = new RegExp("denied_orderline");
      var arrMatches = snippet.match(rePattern);
      if (arrMatches == null || arrMatches.length === 0) return false; else return true;
}
