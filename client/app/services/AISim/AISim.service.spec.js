'use strict';

describe('Service: Aisim', function () {

  // load the service's module
  beforeEach(module('partyanimalsDraftApp'));

  // instantiate service
  var Aisim;
  beforeEach(inject(function (_Aisim_) {
    Aisim = _Aisim_;
  }));

  it('should do something', function () {
    expect(!!Aisim).toBe(true);
  });

});
