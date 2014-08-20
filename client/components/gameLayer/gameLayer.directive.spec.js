'use strict';

describe('Directive: gameLayer', function () {

  // load the directive's module
  beforeEach(module('partyanimalsDraftApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<game-layer></game-layer>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the gameLayer directive');
  }));
});