'use strict';

describe('Filter: formatcost', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var formatcost;
  beforeEach(inject(function ($filter) {
    formatcost = $filter('formatcost');
  }));

  it('should return the input prefixed with "formatcost filter:"', function () {
    var text = 'angularjs';
    expect(formatcost(text)).toBe('formatcost filter: ' + text);
  });

});
