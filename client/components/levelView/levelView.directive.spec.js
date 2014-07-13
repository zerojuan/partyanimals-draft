'use strict';

describe('Directive: levelView', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/levelView/levelView.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<level-view></level-view>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the levelView directive');
  }));
});