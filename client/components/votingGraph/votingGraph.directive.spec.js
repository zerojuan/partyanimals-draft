'use strict';

describe('Directive: votingGraph', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/votingGraph/votingGraph.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<voting-graph></voting-graph>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the votingGraph directive');
  }));
});