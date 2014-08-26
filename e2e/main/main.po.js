/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';
/* jshint -W117 */
var MainPage = function() {
  this.switchElem = element(by.css('#switch-container'));


  this.select = element(by.model('page'));
  this.issues = by.repeater('thing in issues');
  this.awesomeThingsCount = element.all(this.issues).count();
};

module.exports = new MainPage();
