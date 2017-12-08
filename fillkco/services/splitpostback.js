"use strict";
import * as client from 'axios'

export default function service (server) {
  server.post({
    url: '/v1/splitpostback',
  },
  (req, res, next) => {
    let p1 = req.query.p1;
    let p2 = req.query.p2;
    let orderid = req.query.orderid;
    let reqbody = req.body;
    let invoice_id = reqbody.invoice_id;
    let postback_url = p1;

    if (invoice_id != null)
    {
      postback_url = p2;
    }

    let req_url = "https://api.runscope.com/radar/inbound/" + postback_url;
    if (orderid != null) req_url = req_url + "?orderid=" + orderid;
    // console.log("p1: " + p1);
    // console.log("p2: " + p2);
    // console.log("postback_url: " + postback_url);
    // console.log("invoice_id: " + invoice_id);
    // console.log("req_url: " + req_url);
    var response_json =
    {
      'redirect_postback_url': req_url
    }

      client.post(req_url, JSON.stringify(req.body))
      .then(next(res.send(200, response_json)))
      .catch(error => {
        console.log(error);
        reject(new restify.HttpError({
          statusCode: error.data.http_status_code,
          message: error.data.internal_message
        }))
      })

    }
  )
}
