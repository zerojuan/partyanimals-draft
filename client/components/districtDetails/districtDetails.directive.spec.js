'use strict';

describe('Directive: districtDetails', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/districtDetails/districtDetails.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<district-details></district-details>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the districtDetails directive');
  }));
});