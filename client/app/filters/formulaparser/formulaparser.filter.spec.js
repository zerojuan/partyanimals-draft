'use strict';

describe('Filter: formulaparser', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var formulaparser;
  var attributeparser;
  beforeEach(inject(function ($filter) {
    formulaparser = $filter('formulaparser');
    attributeparser = $filter('attributeparser');
  }));

  it('should return value if formula has no variables', function () {
    expect(formulaparser('1')).toBe(1);
    expect(formulaparser('-2')).toBe(-2);
  });

  it('should parse if "versus" attribute is present', function () {
    expect(attributeparser('OKR').isVs).toBe(true);
    expect(attributeparser('KR').isVs).toBe(false);
  });

});
