'use strict';
/* jshint -W117 */
describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
    page = require('./main.po');
  });

  it('should show platform selection initially', function() {
    page.switchElem.getText().then(function(text) {
      console.log('Text: ' + text + ';');
    });
    expect(page.switchElem.element(by.css('h1')).getText(), 'Design your platform:');
  });

  it('should show HQ select after clicked nextPage()', function(){
    var nextPageEl = page.switchElem.element(by.css('a[ng-click="nextPage()"'));
    nextPageEl.click();
    expect(page.switchElem.element(by.css('h1')).getText(), 'Select your HQ');
  });

  it('should render issues', function() {
    page.awesomeThingsCount.then(function(count) {
      expect(count).toBe(5);
    });
  });
});
