'use strict';

describe('Directive: itineraryview', function () {

  // load the directive's module
  beforeEach(module('partyanimalsDraftApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<itineraryview></itineraryview>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the itineraryview directive');
  }));
});
