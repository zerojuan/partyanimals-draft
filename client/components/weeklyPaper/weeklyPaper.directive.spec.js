'use strict';

describe('Directive: weeklyPaper', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/weeklyPaper/weeklyPaper.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<weekly-paper></weekly-paper>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the weeklyPaper directive');
  }));
});