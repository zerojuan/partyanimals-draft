'use strict';

describe('Directive: activitySim', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/activitySim/activitySim.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<activity-sim></activity-sim>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the activitySim directive');
  }));
});