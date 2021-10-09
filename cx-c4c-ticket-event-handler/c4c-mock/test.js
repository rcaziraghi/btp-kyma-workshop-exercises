#!/usr/bin/env node
'use strict'

const request = require('supertest');
const mock = require("./app.js")

describe('test app', function () {
    it('should work', function (done) {
        this.timeout(20000);
        mock.then(function (app) {

            describe('GET ServiceRequests via ODATA', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/sap/c4c/odata/v1/c4codataapi/ServiceRequests')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', 'application/json; charset=utf-8', done)
                });
            });
            describe('GET ServiceRequests via ODATA', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/sap/c4c/odata/v1/c4codataapi/ServiceRequestPartys')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', 'application/json; charset=utf-8')
                        .expect(/\{"d":\{"results":\[]\}\}/, done)
                });
            });
            describe('GET ServiceRequestPartys via ODATA', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/sap/c4c/odata/v1/c4codataapi/ServiceRequestPartys')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', 'application/json; charset=utf-8')
                        .expect(/\{"d":\{"results":\[]\}\}/, done)
                });
            });
            describe('GET odata metadata', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/sap/c4c/odata/v1/c4codataapi/$metadata')
                        .expect(200)
                        .expect('Content-Type', 'application/xml; charset=utf-8', done)
                });
            });
            describe('GET console', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/api/sap/c4c/odata/v1/c4codataapi/console/')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', 'text/html; charset=UTF-8', done)
                });
            });
            describe('GET metadata', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/metadata')
                        .expect(200)
                        .expect('Content-Type', 'text/yaml; charset=UTF-8', done)
                });
            });
            describe('GET app info', function () {
                it('should return 200', function (done) {
                    request(app)
                        .get('/info')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .expect('Content-Type', 'application/json; charset=utf-8', done)
                });
            });

            done()
        }).catch(error => done(error));
    });
});
