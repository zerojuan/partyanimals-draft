'use strict';

describe('Directive: actorInTimeline', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/actorInTimeline/actorInTimeline.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<actor-in-timeline></actor-in-timeline>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the actorInTimeline directive');
  }));
});