'use strict';

describe('Directive: talkui', function () {

  // load the directive's module
  beforeEach(module('partyanimalsDraftApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<talkui></talkui>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the talkui directive');
  }));
});
