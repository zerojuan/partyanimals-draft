'use strict';

describe('Directive: ActivitiesList', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/ActivitiesList/ActivitiesList.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-activities-list></-activities-list>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the ActivitiesList directive');
  }));
});