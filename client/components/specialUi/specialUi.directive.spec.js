'use strict';

describe('Directive: specialUi', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/specialUi/specialUi.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<special-ui></special-ui>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the specialUi directive');
  }));
});