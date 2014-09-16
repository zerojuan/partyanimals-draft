'use strict';

describe('Directive: notification', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/notification/notification.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<notification></notification>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the notification directive');
  }));
});