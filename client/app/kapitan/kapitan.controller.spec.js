'use strict';

describe('Controller: KapitanCtrl', function () {

  // load the controller's module
  beforeEach(module('partyanimalsDraftApp'));

  var KapitanCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KapitanCtrl = $controller('KapitanCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
