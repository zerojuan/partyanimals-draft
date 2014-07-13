'use strict';

describe('Filter: formatcost', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var formatcost;
  beforeEach(inject(function ($filter) {
    formatcost = $filter('formatcost');
  }));

  it('should return "FREE" if cost is 0', function () {
    expect(formatcost(0)).toBe('FREE');
  });

});
