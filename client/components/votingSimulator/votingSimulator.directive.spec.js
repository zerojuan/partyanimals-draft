'use strict';

describe('Directive: votingSimulator', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/votingSimulator/votingSimulator.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<voting-simulator></voting-simulator>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the votingSimulator directive');
  }));
});