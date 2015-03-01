'use strict';

describe('Directive: twoSliderInput', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/twoSliderInput/twoSliderInput.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<two-slider-input></two-slider-input>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the twoSliderInput directive');
  }));
});