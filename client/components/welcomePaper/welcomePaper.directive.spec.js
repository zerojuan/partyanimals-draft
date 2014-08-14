'use strict';

describe('Directive: welcomePaper', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/welcomePaper/welcomePaper.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<welcome-paper></welcome-paper>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the welcomePaper directive');
  }));
});