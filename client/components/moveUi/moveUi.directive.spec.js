'use strict';

describe('Directive: moveUi', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/moveUi/moveUi.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<move-ui></move-ui>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the moveUi directive');
  }));
});