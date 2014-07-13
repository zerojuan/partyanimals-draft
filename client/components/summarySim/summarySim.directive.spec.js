'use strict';

describe('Directive: summarySim', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/summarySim/summarySim.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<summary-sim></summary-sim>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the summarySim directive');
  }));
});