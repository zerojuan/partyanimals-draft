'use strict';

describe('Directive: statUi', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/statUi/statUi.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<stat-ui></stat-ui>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the statUi directive');
  }));
});