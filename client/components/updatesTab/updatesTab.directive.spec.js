'use strict';

describe('Directive: updatesTab', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/updatesTab/updatesTab.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<updates-tab></updates-tab>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the updatesTab directive');
  }));
});