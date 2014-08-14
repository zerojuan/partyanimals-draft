'use strict';

describe('Directive: newsItem', function () {

  // load the directive's module and view
  beforeEach(module('partyanimalsDraftApp'));
  beforeEach(module('components/newsItem/newsItem.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<news-item></news-item>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the newsItem directive');
  }));
});