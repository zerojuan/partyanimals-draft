'use strict';

describe('Filter: difficultyparser', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var difficultyparser;
  beforeEach(inject(function ($filter) {
    difficultyparser = $filter('difficultyparser');
  }));

  it('should return the "VERY HIGH" when difficulty is less than 20', function () {
    expect(difficultyparser(10)).toBe('VERY HIGH');
  });

});
