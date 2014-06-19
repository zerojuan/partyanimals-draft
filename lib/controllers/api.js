'use strict';

/**
 * Get awesome things
 */
exports.issues = function(req, res) {
  res.json([
    {
      id: 0,
      name : 'Education',
      info : 'Education Programs Description',
      level: 0
    }, {
      id: 1,
      name : 'Law & Order',
      info : 'Police and stuff.',
      level: 0
    }, {
      id: 2,
      name : 'Employment',
      info : 'Jobs and small enterprise',
      level: 0
    }, {
      id: 3,
      name : 'Health',
      info : 'Healthy people are happy people',
      level: 0
    }, {
      id: 4,
      name: 'Religion',
      info: 'God above all things',
      level: 0
    }
  ]);
};

exports.districts = function(req, res){
  res.json([
    {
      id: 0,
      name: 'Kapitolyo',
      info: 'The seat of power'
    },
    {
      id: 1,
      name: 'Casino',
      info: 'Wealthy and crimey'
    },
    {
      id: 2,
      name: 'Fishing Village',
      info: 'Rural poor'
    },
    {
      id: 3,
      name: 'Port',
      info: 'Urban poor'
    },
    {
      id: 4,
      name: 'Cathedral',
      info: 'People love God. God be the glory.'
    },
    {
      id: 5,
      name: 'Resort',
      info: 'Environmentalism and tourism'
    }
  ]);
}
