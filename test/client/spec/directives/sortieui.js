'use strict';

describe('Directive: sortieui', function () {

  // load the directive's module
  beforeEach(module('partyanimalsDraftApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sortieui></sortieui>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the sortieui directive');
  }));
});
