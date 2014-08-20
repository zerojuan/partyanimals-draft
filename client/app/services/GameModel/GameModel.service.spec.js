'use strict';

describe('Service: Gamemodel', function () {

  // load the service's module
  beforeEach(module('partyanimalsDraftApp'));

  // instantiate service
  var Gamemodel;
  beforeEach(inject(function (_Gamemodel_) {
    Gamemodel = _Gamemodel_;
  }));

  it('should do something', function () {
    expect(!!Gamemodel).toBe(true);
  });

});
