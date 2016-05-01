"use strict";

let assert = require('chai').assert;
let yawac = require('../lib/yawac')
let report;

describe('yawac tests: ', function()  {
  this.timeout(10000);
  before(() => {
    yawac.baseUrl = 'http://unjavascripter.github.io/arraify';
    report = yawac.fetchRoute();
  });

  // Ugly hack, I know :/
  it('should give the test a little bit of time', (done) => {
    setTimeout(() => done(), 2000);
  });

  it('should have a single record', () => {
      assert.equal(1, report.length);
  });

  it('should have a single item on stylesheet & script array ', () => {
    assert.equal(1, report[0]["/"].assets.stylesheet.length);
    assert.equal(1, report[0]["/"].assets.script.length);
  });

  it('should have no links', () => {
      assert.equal(0, report[0]["/"].links.length);
  });

});