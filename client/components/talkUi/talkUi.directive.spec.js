'use strict';

describe('Directive: talkUi', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/talkUi/talkUi.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<talk-ui></talk-ui>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the talkUi directive');
  }));
});