'use strict';

describe('Filter: messageparser', function () {

  // load the filter's module
  beforeEach(module('partyanimalsDraftApp'));

  // initialize a new instance of the filter before each test
  var messageparser;
  beforeEach(inject(function ($filter) {
    messageparser = $filter('messageparser');
  }));

  it('should replace $issue$ with correct value', function () {
    var value = {
      issue: 'Education'
    };
    expect(messageparser('The issue is $issue$', value)).toBe('The issue is Education');
  });

  it('should replace $issue$ and $district$ with correct value', function () {
    var value = {
      issue: 'Education',
      district: 'Manila'
    };
    expect(messageparser('The issue is $issue$ in $district$', value)).toBe('The issue is Education in Manila');
  });
});
