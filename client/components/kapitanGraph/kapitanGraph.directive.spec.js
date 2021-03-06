'use strict';

describe('Directive: kapitanGraph', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/kapitanGraph/kapitanGraph.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<kapitan-graph></kapitan-graph>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the kapitanGraph directive');
  }));
});