'use strict';

describe('Service: Ruleset', function () {

  // load the service's module
  beforeEach(module('partyanimalsDraftApp'));

  // instantiate service
  var Ruleset;
  beforeEach(inject(function (_Ruleset_) {
    Ruleset = _Ruleset_;
  }));

  it('should do something', function () {
    expect(!!Ruleset).toBe(true);
  });

});
