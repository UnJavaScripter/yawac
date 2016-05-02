"use strict";

let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let assert = chai.assert;
let yawac = require('../lib/yawac')
let report;

describe('yawac tests: ', function()  {
  before(() => {
    yawac.baseUrl = 'http://unjavascripter.github.io/testrepo';
    report = yawac.fetchRoute();
  });

  

  describe('Page 1 (index)', () => {

    it('should have no items on the icon assets array', (done) => {
      report.then((r) => {
        assert.equal(0, r[0]["/"].assets.icon.length);
        done();
      });
    });

    it('should have no stylesheet references', (done) => {
      report.then((r) => {
        assert.equal(0, r[0]["/"].assets.stylesheet.length);
        done();
      });
    });


    it('should have one script reference', (done) => {
      report.then((r) => {
        assert.equal(1, r[0]["/"].assets.script.length);
        done();
      });
    });

    it('should have one image reference', (done) => {
      report.then((r) => {
        assert.equal(1, r[0]["/"].assets.img.length);
        done();
      });
    });

    it('should have one link', (done) => {
      report.then((r) => {
        assert.equal(1, r[0]["/"].links.length);
        done();
      });
    });
  })

  describe('Page 2 (noonecanfindme)', () => {

    it('should have no items on the icon assets array', (done) => {
      report.then((r) => {
        assert.equal(0, r[1]["/noonecanfindme.html"].assets.icon.length);
        done();
      });
    });

    it('should have one stylesheet reference', (done) => {
      report.then((r) => {
        assert.equal(1, r[1]["/noonecanfindme.html"].assets.stylesheet.length);
        done();
      });
    });


    it('should have no script reference', (done) => {
      report.then((r) => {
        assert.equal(0, r[1]["/noonecanfindme.html"].assets.script.length);
        done();
      });
    });

    it('shouldn\'t have image references', (done) => {
      report.then((r) => {
        assert.equal(0, r[1]["/noonecanfindme.html"].assets.img.length);
        done();
      });
    });

    it('should have no links', (done) => {
      report.then((r) => {
        assert.equal(0, r[1]["/noonecanfindme.html"].links.length);
        done();
      });
    });
  });


});