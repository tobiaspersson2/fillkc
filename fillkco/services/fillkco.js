"use strict";
import { createOrder, readOrder, clientReadOrder, clientUpdateOrder } from '../klarna'
import {getClientAuth, getClientOrderURL, hasDeniedOrderLine} from '../klarna/utils'
import * as client from 'axios'

export default function service (server) {
  server.post({
    url: '/v1/sms',
  },
  (req, res, next) => {

    var rePattern = new RegExp("https:\\/\\/[\\S]*");
    var arrMatches = req.params.Body.match(rePattern);
    if (arrMatches.length === 0)
      next(res.send(500));
    else
    {
      let checkout_uri = arrMatches[0];
      let payload =
      {
        "checkout_uri": checkout_uri
      }

      client.post(server.url +  "/v1/fillkco", payload)
      .then(next(res.send(204)))
      .catch(error => {
        console.log(error);
        reject(new restify.HttpError({
          statusCode: error.data.http_status_code,
          message: error.data.internal_message
        }))
      })


    }
  })

  server.post({
    url: '/v1/fillkco',
  },
  (req, res, next) => {
//    req.body = JSON.parse(req.body)
    let checkout_uri = req.body.checkout_uri


    function sendResponse () {
      return new Promise(resolve => {
        var response_json =
        {
          'status': 'done'
        }

        next(res.send(201, response_json))
      })
    }

    function handleError (error) {
      req.log.error(error);
      next(error)
    }


    req.log.info("get: " + checkout_uri);

    client.get(checkout_uri)
    .then((val) => {
        var client_auth_header = getClientAuth(val.data);
        var order_URI = getClientOrderURL(val.data);
        var use_denied_person = hasDeniedOrderLine(val.data);

        clientReadOrder(order_URI, client_auth_header)
        .then((val2) => {
          val2 = JSON.parse(val2)
          req.log.info(" - -------------- READ READ ----- - - - -- -- ");
          req.log.info(val2);
          clientUpdateOrder(order_URI, client_auth_header, val2, use_denied_person)
          .then((val3) => {
            req.log.info(" - -------------- UPDATE READ ----- - - - -- -- ");
            req.log.info(val3);
            if (val3.redirect_uri == null)
            {
              clientUpdateOrder(order_URI, client_auth_header, val3, use_denied_person)
              .then((val4) => {
                req.log.info(" - -------------- UPDATE2 READ ----- - - - -- -- ");
                req.log.info(val4);
              })
              .catch(handleError)

            }

            if (use_denied_person)
            {
              client.get(checkout_uri + "/stop");
            }

          })
          .then(sendResponse)
          .catch(handleError)

        })
        .catch(handleError)
    })
    .catch(error => {
      req.log.error(error);
      reject(new restify.HttpError({
        statusCode: error.data.http_status_code,
        message: error.data.internal_message
      }))
    })

  })



}
