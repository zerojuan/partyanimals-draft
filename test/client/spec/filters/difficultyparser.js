'use strict';

describe('Filter: difficultyparser', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var difficultyparser;
  beforeEach(inject(function ($filter) {
    difficultyparser = $filter('difficultyparser');
  }));

  it('should return the input prefixed with "difficultyparser filter:"', function () {
    var text = 'angularjs';
    expect(difficultyparser(text)).toBe('difficultyparser filter: ' + text);
  });

});
