'use strict';

describe('Filter: itinerarytime', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var itinerarytime;
  beforeEach(inject(function ($filter) {
    itinerarytime = $filter('itinerarytime');
  }));

  it('should return the input prefixed with "itinerarytime filter:"', function () {
    var text = 'angularjs';
    expect(itinerarytime(text)).toBe('itinerarytime filter: ' + text);
  });

});
