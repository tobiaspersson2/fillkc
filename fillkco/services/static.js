"use strict";
import restify from 'restify'

export default function service (server) {

  server.get(/\/static\/?.*/, restify.serveStatic({
      directory: __dirname + '/../../'
  }));

  server.get({
    url: '/health',
  },
  (req, res, next) => {
    next(res.send(200));
  });

  server.get({
    url: '/test',
  },
  (req, res, next) => {
    next(res.send(201, 'here I am..'));
  });

  server.get({
    url: '/version',
  },
  (req, res, next) => {
    next(res.send(201, 'version: 2.1'));
  });
}
