#!/usr/bin/env node
'use strict'

const config = require('@varkes/configuration')
const openapi = require('@varkes/openapi-mock')
const odata = require('@varkes/odata-mock')
const server = require('@varkes/api-server')
const cockpit = require("@varkes/cockpit")
const app = require('express')()
const serviceRequests = require('./service-requests.json');
const serviceRequestParties = require('./service-request-parties.json');
const MOCK_OBJECT_ID = "00163E063FDC1ED487FD43C39DFD4BBE";
const REPORTER_PARTY = "Reporter Party";

var runAsync = async () => {
  var port
  if (process.argv.length > 2 && parseInt(process.argv[2])) {
    port = process.argv[2]
  }

  try {
    customizeMock(app)
    let configuration = await config.resolveFile("./varkes_config.json", __dirname)
    app.use(await cockpit.init(configuration))
    app.use(await server.init(configuration))
    app.use(await odata.init(configuration))
    app.use(await openapi.init(configuration))
    if (port)
      app.listen(port, function () {
        console.info("Started application on port %d", port)
      });
    return app
  } catch (error) {
    console.error("Problem while starting application: %s", error)
  }
}

function customizeMock(app) {

  app.get('/sap/c4c/odata/v1/c4codataapi/ServiceRequests', function (req, res, next) {
    if (req.query && req.query.filter && isSpecifcServiceRequest(req.query.filter)) {
      res.send({ "d": { "results": serviceRequests[MOCK_OBJECT_ID] } });
    } else {
      res.send({ "d": { "results": [] } });
    }
  });

  app.get('/sap/c4c/odata/v1/c4codataapi/ServiceRequestPartys', function (req, res, next) {
    if (req.query && req.query.filter && isSpecifcReporterParty(req.query.filter)) {
      res.send({ "d": { "results": serviceRequestParties[MOCK_OBJECT_ID] } });
    } else {
      res.send({ "d": { "results": [] } });
    }
  });

  return app
}

function isSpecifcServiceRequest(encodedFilter) {
  const filter = decodeFilter(encodedFilter);
  if (filter.where && filter.where.ObjectID && filter.where.ObjectID === MOCK_OBJECT_ID) {
    return true;
  }
  return false;
}

function isSpecifcReporterParty(encodedFilter) {
  const filter = decodeFilter(encodedFilter);
  if (filter.where && filter.where.and) {
    const condition1 = filter.where.and.find(element => element.ParentObjectID === MOCK_OBJECT_ID);
    const condition2 = filter.where.and.find(element => element.RoleCategoryCodeText === REPORTER_PARTY);
    if (condition1 && condition2) {
      return true;
    }
  }
  return false;
}

function decodeFilter(encodedFilter) {
  try {
    const filter = JSON.parse(decodeURI(encodedFilter));
    if (filter) {
      console.log('filter: ', JSON.stringify(filter));
    }
    return filter;
  }
  catch (err) {
    return undefined;
  }
}

module.exports = runAsync();