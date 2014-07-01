'use strict';

describe('Service: PAFirebase', function () {

  // load the service's module
  beforeEach(module('partyanimalsDraftApp'));

  // instantiate service
  var PAFirebase;
  beforeEach(inject(function (_PAFirebase_) {
    PAFirebase = _PAFirebase_;
  }));

  it('should do something', function () {
    expect(!!PAFirebase).toBe(true);
  });

});
