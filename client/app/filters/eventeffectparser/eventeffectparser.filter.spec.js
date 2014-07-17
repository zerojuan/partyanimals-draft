'use strict';

describe('Filter: eventeffectparser', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var eventeffectparser;
  beforeEach(inject(function ($filter) {
    eventeffectparser = $filter('eventeffectparser');
  }));

  it('should return the input prefixed with "eventeffectparser filter:"', function () {
    var text = 'angularjs';
    expect(eventeffectparser(text)).toBe('eventeffectparser filter: ' + text);
  });

});
