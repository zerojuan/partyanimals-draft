'use strict';

describe('Service: Pafirebase', function () {

  // load the service's module
  beforeEach(module('partyanimalsDraftApp'));

  // instantiate service
  var Pafirebase;
  beforeEach(inject(function (_Pafirebase_) {
    Pafirebase = _Pafirebase_;
  }));

  it('should do something', function () {
    expect(!!Pafirebase).toBe(true);
  });

});
