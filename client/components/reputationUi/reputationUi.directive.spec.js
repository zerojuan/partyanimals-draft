'use strict';

describe('Directive: reputationUi', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/reputationUi/reputationUi.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<reputation-ui></reputation-ui>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the reputationUi directive');
  }));
});