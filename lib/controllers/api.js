'use strict';

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  res.json([
    {
      name : 'Education',
      info : 'Education Programs Description',
      level: 0
    }, {
      name : 'Law & Order',
      info : 'Police and stuff.',
      level: 0
    }, {
      name : 'Employment',
      info : 'Jobs and small enterprise',
      level: 0
    }, {
      name : 'Health',
      info : 'Healthy people are happy people',
      level: 0
    }, {
      name: 'Religion',
      info: 'God above all things',
      level: 0
    }
  ]);
};
