'use strict';

describe('Directive: endPaper', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/endPaper/endPaper.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<end-paper></end-paper>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the endPaper directive');
  }));
});