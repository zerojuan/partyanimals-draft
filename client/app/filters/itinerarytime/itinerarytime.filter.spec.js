'use strict';

describe('Filter: itinerarytime', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var itinerarytime;
  beforeEach(inject(function ($filter) {
    itinerarytime = $filter('itinerarytime');
  }));

  it('should show 12+ time as PM', function () {
    expect(itinerarytime(13)).toBe('1 PM');
  });

  it('should show midnight as AM', function () {
    expect(itinerarytime(24)).toBe('12 AM');
  });
});
