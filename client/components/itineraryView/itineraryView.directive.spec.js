'use strict';

describe('Directive: itineraryView', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/itineraryView/itineraryView.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<itinerary-view></itinerary-view>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the itineraryView directive');
  }));
});