'use strict';

describe('Filter: feelings', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var feelings;
  beforeEach(inject(function ($filter) {
    feelings = $filter('feelings');
  }));

  it('should return the input prefixed with "feelings filter:"', function () {
    var text = 'angularjs';
    expect(feelings(text)).toBe('feelings filter: ' + text);
  });

});
