'use strict';

describe('Controller: EndgameCtrl', function () {

  // load the controller's module
  beforeEach(module('partyanimalsDraftApp'));

  var EndgameCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EndgameCtrl = $controller('EndgameCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
