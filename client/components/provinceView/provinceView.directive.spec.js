'use strict';

describe('Directive: provinceView', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/provinceView/provinceView.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<province-view></province-view>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the provinceView directive');
  }));
});