'use strict';

describe('Directive: issueLevelView', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/issueLevelView/issueLevelView.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<issue-level-view></issue-level-view>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the issueLevelView directive');
  }));
});