'use strict';

describe('Service: Gamestate', function () {

  // load the service's module
  beforeEach(module('partyanimalsDraftApp'));

  // instantiate service
  var Gamestate;
  beforeEach(inject(function (_Gamestate_) {
    Gamestate = _Gamestate_;
  }));

  it('should do something', function () {
    expect(!!Gamestate).toBe(true);
  });

});
