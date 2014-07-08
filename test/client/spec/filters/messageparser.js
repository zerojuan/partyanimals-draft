'use strict';

describe('Filter: messageparser', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var messageparser;
  beforeEach(inject(function ($filter) {
    messageparser = $filter('messageparser');
  }));

  it('should return the input prefixed with "messageparser filter:"', function () {
    var text = 'angularjs';
    expect(messageparser(text)).toBe('messageparser filter: ' + text);
  });

});
