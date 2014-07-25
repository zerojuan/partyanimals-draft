'use strict';

describe('Directive: cardsView', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/cardsView/cardsView.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<cards-view></cards-view>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the cardsView directive');
  }));
});