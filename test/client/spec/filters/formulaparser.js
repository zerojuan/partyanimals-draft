'use strict';

describe('Filter: formulaparser', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var formulaparser;
  beforeEach(inject(function ($filter) {
    formulaparser = $filter('formulaparser');
  }));

  it('should return the input prefixed with "formulaparser filter:"', function () {
    var text = 'angularjs';
    expect(formulaparser(text)).toBe('formulaparser filter: ' + text);
  });

});
