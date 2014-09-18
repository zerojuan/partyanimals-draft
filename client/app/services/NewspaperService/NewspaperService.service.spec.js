'use strict';

describe('Service: Newspaperservice', function () {

  // load the service's module
  beforeEach(module('partyanimalsDraftApp'));

  // instantiate service
  var Newspaperservice;
  beforeEach(inject(function (_Newspaperservice_) {
    Newspaperservice = _Newspaperservice_;
  }));

  it('should do something', function () {
    expect(!!Newspaperservice).toBe(true);
  });

});
