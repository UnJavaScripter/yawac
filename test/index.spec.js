"use strict";

let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let assert = chai.assert;
let yawac = require('../lib/yawac')
let report;

describe('yawac tests: ', function()  {
  before(() => {
    yawac.baseUrl = 'http://unjavascripter.github.io/arraify';
    report = yawac.fetchRoute();
  });

  it('should have a single record', () => {
    report.then(() => {
        assert.equal(1, report.length);
    });
  });

  it('should have a single item on stylesheet & script array ', () => {
    report.then(() => {
      assert.equal(1, report[0]["/"].assets.stylesheet.length);
      assert.equal(1, report[0]["/"].assets.script.length);
    });
  });

  it('should have no links', () => {
    report.then(() => {
      assert.equal(0, report[0]["/"].links.length);
    });
  });

});